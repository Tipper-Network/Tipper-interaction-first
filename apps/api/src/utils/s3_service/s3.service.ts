import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as path from 'path';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;
    // Default to eu-north-1 if AWS_REGION is not set (based on bucket URL pattern)
    this.region = this.configService.get<string>('AWS_REGION') || 'eu-north-1';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  /**
   * Uploads a file buffer to S3 and returns a public URL to the uploaded object.
   *
   * If `key` is not provided, a key is generated under `uploads/` using a UUID plus the original file extension.
   *
   * @param buffer - Raw file bytes.
   * @param originalName - Original filename (used to infer extension / MIME type).
   * @param key - Optional explicit S3 object key.
   * @returns Public URL of the uploaded object.
   * @throws Error if the S3 upload fails.
   */
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    key?: string,
  ): Promise<string> {
    const ext = path.extname(originalName);
    const finalKey = key ?? `uploads/${randomUUID()}${ext}`;

    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: finalKey,
      Body: buffer,
      ContentType: this.getMimeType(ext),
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return this.getPublicUrl(finalKey);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('S3 Upload Failed:', {
        message: err.message,
        code: err.name,
        stack: err.stack,
      });

      throw new Error('Failed to upload file to S3');
    }
  }

  /**
   * Overwrites (or creates) an object at a specific key and returns its public URL.
   *
   * This is what you want for "stable URL" assets like entity logos:
   * - Use a deterministic `key` (e.g. `entities/<entityId>/logo`)
   * - Always PUT to the same key (S3 replaces the bytes in-place)
   * - Set `contentType` from the uploaded file's mimetype (do NOT infer from extension)
   * - Optionally set `cacheControl` to minimize stale caching
   */
  async overwriteFile(params: {
    buffer: Buffer;
    key: string;
    contentType: string;
    /**
     * Example for "show updates quickly":
     * `no-cache, max-age=0, must-revalidate`
     *
     * Stronger (heavier) option:
     * `no-store`
     */
    cacheControl?: string;
  }): Promise<string> {
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: params.key,
      Body: params.buffer,
      ContentType: params.contentType,
      CacheControl: params.cacheControl,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return this.getPublicUrl(params.key);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('S3 Overwrite Failed:', {
        message: err.message,
        code: err.name,
        stack: err.stack,
        key: params.key,
      });
      throw new Error('Failed to overwrite file in S3');
    }
  }

  private getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  private getMimeType(ext: string): string {
    const map: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    };
    return map[ext.toLowerCase()] || 'application/octet-stream';
  }

  /**
   * Generates a time-limited presigned download URL for an S3 object.
   *
   * @param key - S3 object key.
   * @param expiresInSeconds - URL expiry in seconds (default: 3600).
   * @returns A presigned URL that can be used to download the object.
   */
  async getPresignedUrl(
    key: string,
    expiresInSeconds = 3600,
    opts?: {
      /**
       * Override response headers on the signed URL.
       * This is critical for in-browser PDF previews (inline vs attachment).
       */
      responseContentType?: string;
      responseContentDisposition?: string;
    },
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ResponseContentType: opts?.responseContentType,
      ResponseContentDisposition: opts?.responseContentDisposition,
    });

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });
  }

  /**
   * Preview-friendly URL (tries to make browsers render inline when possible).
   * Currently tuned for PDFs: inline + correct content-type.
   */
  async getPresignedPreviewUrl(
    key: string,
    expiresInSeconds = 3600,
  ): Promise<string> {
    const ext = path.extname(key).toLowerCase();
    const base = path.basename(key);
    const safeName = base.replace(/"/g, "'");

    if (ext === '.pdf') {
      return this.getPresignedUrl(key, expiresInSeconds, {
        responseContentType: 'application/pdf',
        responseContentDisposition: `inline; filename="${safeName}"`,
      });
    }

    // Default: no forced disposition (let the object metadata decide).
    return this.getPresignedUrl(key, expiresInSeconds);
  }
}
