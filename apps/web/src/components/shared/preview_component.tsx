"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type PreviewInput =
  | File
  | string
  | {
      url: string;
      name?: string;
      type?: string;
    }
  | null
  | undefined;

export type PreviewKind = "image" | "pdf" | "video" | "other";

export type PreviewVariant = "thumb" | "full" | "embed" | "link";

type PreviewComponentProps = {
  file: PreviewInput;
  /**
   * - `thumb`: small thumbnail (image/video) or a compact card (pdf/other)
   * - `full`: full-size render (image/video) or embedded PDF
   * - `embed`: for PDFs, embed viewer (iframe); for others falls back to `link`
   * - `link`: link-only
   */
  variant?: PreviewVariant;
  className?: string;
  /**
   * Used for embedding PDFs (height in px).
   */
  embedHeight?: number;
  /**
   * Open links in a new tab (default true).
   */
  openInNewTab?: boolean;
  /**
   * When `variant="thumb"`, clicking the preview opens a full preview dialog.
   */
  enableFullPreview?: boolean;
  /**
   * Dialog content height for PDF embeds (px).
   */
  fullPreviewHeight?: number;
};

function isFile(x: unknown): x is File {
  return typeof File !== "undefined" && x instanceof File;
}

function normalize(
  input: PreviewInput
): { url: string; name?: string; type?: string; isFile?: boolean } | null {
  if (!input) return null;
  if (typeof input === "string") return { url: input };
  if (isFile(input))
    return { url: "", name: input.name, type: input.type, isFile: true };
  if (typeof input === "object" && typeof (input as any).url === "string")
    return input as any;
  return null;
}

function guessKind(url: string, type?: string, name?: string): PreviewKind {
  const t = (type ?? "").toLowerCase();
  const n = (name ?? "").toLowerCase();
  const u = (url ?? "").toLowerCase();

  if (t.startsWith("image/")) return "image";
  if (t.startsWith("video/")) return "video";
  if (t === "application/pdf") return "pdf";

  if (n.endsWith(".pdf") || u.includes(".pdf")) return "pdf";
  if (
    n.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)$/) ||
    u.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)(\?|$)/)
  )
    return "image";
  if (n.match(/\.(mp4|webm|mov|m4v)$/) || u.match(/\.(mp4|webm|mov|m4v)(\?|$)/))
    return "video";

  return "other";
}

export default function PreviewComponent({
  file,
  variant = "thumb",
  className,
  embedHeight = 720,
  openInNewTab = true,
  enableFullPreview = true,
  fullPreviewHeight = 840,
}: PreviewComponentProps) {
  const meta = React.useMemo(() => normalize(file), [file]);

  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isFile(file)) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!meta) return null;

  const url = objectUrl ?? meta.url;
  const kind = guessKind(url, meta.type, meta.name);
  const label = meta.name ?? (kind === "pdf" ? "PDF" : "File");

  if (!url) {
    return (
      <div className={className}>
        <div className="text-xs text-muted-foreground">Preparing preview…</div>
      </div>
    );
  }

  const linkTarget = openInNewTab ? "_blank" : undefined;
  const linkRel = openInNewTab ? "noreferrer" : undefined;

  const renderImage = (size: "thumb" | "full") => {
    const isBlob = url.startsWith("blob:") || url.startsWith("data:");
    const sizeClass =
      size === "thumb" ? "h-16 w-16" : "max-h-[80vh] w-auto max-w-full";

    return (
      <div className={cn("inline-block", size === "thumb" ? className : "")}>
        {isBlob ? (
          <img
            src={url}
            alt={label}
            className={cn(
              sizeClass,
              "rounded-md object-cover ring-1 ring-border"
            )}
          />
        ) : (
          <Image
            src={url}
            alt={label}
            width={1200}
            height={1200}
            className={cn(
              sizeClass,
              "rounded-md object-contain ring-1 ring-border"
            )}
          />
        )}
      </div>
    );
  };

  const renderVideo = (size: "thumb" | "full") => {
    return (
      <div className={size === "thumb" ? className : ""}>
        <video
          src={url}
          controls
          className={cn(
            size === "thumb" ? "h-16 w-28" : "max-h-[80vh] w-full",
            "rounded-md ring-1 ring-border"
          )}
        />
        {size === "thumb" ? (
          <div className="mt-1 text-xs text-muted-foreground">{label}</div>
        ) : null}
      </div>
    );
  };
  // Some PDF viewers respect these hash params; harmless if ignored.
  // Note: the hash is NOT part of the signed URL, so it won't break presigning.
  const pdfUrl = url.includes("#")
    ? url
    : `${url}#toolbar=0&navpanes=0&view=FitH`;
  const renderPdfEmbed = (height: number) => {
    return (
      <div className="w-full">
        <div
          className="w-full overflow-hidden rounded-xl ring-1 ring-border bg-background"
          style={{ height }}
        >
          <iframe
            src={pdfUrl}
            title={label}
            className="h-full w-full"
            // allowFullScreen
          />
        </div>
        <a
          href={url}
          target={linkTarget}
          rel={linkRel}
          className="mt-2 block text-xs underline decoration-muted-foreground/40 underline-offset-4"
        >
          Open in new tab
        </a>
      </div>
    );
  };

  if (kind === "image") {
    if (variant !== "thumb") {
      return <div className={className}>{renderImage("full")}</div>;
    }

    const thumb = renderImage("thumb");
    if (!enableFullPreview) return thumb;
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button type="button" className="inline-flex" aria-label={label}>
            {thumb}
          </button>
        </DialogTrigger>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle className="truncate">{label}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">{renderImage("full")}</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (kind === "video") {
    if (variant === "link") {
      return (
        <a
          href={url}
          target={linkTarget}
          rel={linkRel}
          className={cn(
            "text-xs underline decoration-muted-foreground/40 underline-offset-4",
            className
          )}
        >
          Open video
        </a>
      );
    }

    if (variant !== "thumb") {
      return <div className={className}>{renderVideo("full")}</div>;
    }

    const thumb = renderVideo("thumb");
    if (!enableFullPreview) return thumb;
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button type="button" className="inline-flex" aria-label={label}>
            {thumb}
          </button>
        </DialogTrigger>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle className="truncate">{label}</DialogTitle>
          </DialogHeader>
          {renderVideo("full")}
        </DialogContent>
      </Dialog>
    );
  }

  if (kind === "pdf" && (variant === "embed" || variant === "full")) {
    return (
      <div className={className}>
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-2">{renderPdfEmbed(embedHeight)}</div>
      </div>
    );
  }

  // pdf + other → compact card or link
  if (variant === "link") {
    return (
      <a
        href={url}
        target={linkTarget}
        rel={linkRel}
        className={cn(
          "text-xs underline decoration-muted-foreground/40 underline-offset-4",
          className
        )}
      >
        {kind === "pdf" ? "Open PDF" : "Open file"}
      </a>
    );
  }

  const compact = (
    <div
      className={cn(
        "rounded-md ring-1 ring-border bg-background/50 px-2 py-2",
        variant === "thumb" ? "max-w-[220px]" : "",
        className
      )}
    >
      <div className="text-sm font-medium truncate">{label}</div>
      <a
        href={url}
        target={linkTarget}
        rel={linkRel}
        className="mt-1 block text-xs underline decoration-muted-foreground/40 underline-offset-4"
      >
        {kind === "pdf" ? "Preview PDF" : "Open file"}
      </a>
    </div>
  );

  if (kind === "pdf" && variant === "thumb" && enableFullPreview) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button type="button" className="text-left" aria-label={label}>
            {compact}
          </button>
        </DialogTrigger>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle className="truncate">{label}</DialogTitle>
          </DialogHeader>
          {renderPdfEmbed(fullPreviewHeight)}
        </DialogContent>
      </Dialog>
    );
  }

  return compact;
}

/**
 * Upload-time preview (before the file has a URL).
 * Always uses a thumbnail + optional full preview dialog.
 */
export function UploadPreview(props: {
  file: File | null | undefined;
  className?: string;
  enableFullPreview?: boolean;
}) {
  const { file, className, enableFullPreview = true } = props;
  if (!file) return null;
  return (
    <PreviewComponent
      file={file}
      variant="thumb"
      className={className}
      enableFullPreview={enableFullPreview}
    />
  );
}
