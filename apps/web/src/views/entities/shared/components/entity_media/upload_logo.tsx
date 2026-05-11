"use client";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { UploadMedia } from "@/components/upload_file";
import {
  useUpdateEntityLogo,
  useEntityLogo,
} from "@/views/entities/shared/hooks/entities_media_hooks";
import Image from "next/image";
import LogoViewComponent from "@/components/logo_view_component";

export type UploadLogoHandle = {
  uploadIfNeeded: () => Promise<void>;
  hasPendingUpload: () => boolean;
  clearSelection: () => void;
};

type UploadLogoProps = {
  entityId: string;
  initialLogoUrl?: string | null;
  onPreviewUrlChange?: (url: string) => void;
  onPendingChange?: (pending: boolean) => void;
  label?: string;
};

const UploadLogo = forwardRef<UploadLogoHandle, UploadLogoProps>(
  function UploadLogo(
    {
      entityId,
      initialLogoUrl,
      onPreviewUrlChange,
      onPendingChange,
      label = "Upload Yours (optional)",
    },
    ref
  ) {
    const [logoFiles, setLogoFiles] = useState<File[]>([]);
    const { data: logoData } = useEntityLogo(entityId);
    const updateLogo = useUpdateEntityLogo(entityId);
    const [logoUrl, setLogoUrl] = useState<string | null>(
      initialLogoUrl ?? null
    );
    const defaultLogoUrl = "/assets/logos/Tipper_Logos_Brandmark_Ruby.svg";

    // Keep in sync with server value (but do not clobber a pending local selection)
    useEffect(() => {
      if (logoFiles.length > 0) return;
      // prefer API media endpoint; fallback to entity.logo_url if provided
      setLogoUrl(logoData?.url ?? initialLogoUrl ?? null);
    }, [initialLogoUrl, logoData?.url, logoFiles.length]);

    const previewUrl = useMemo(() => {
      if (logoFiles[0]) return URL.createObjectURL(logoFiles[0]);
      return logoUrl || defaultLogoUrl;
    }, [logoFiles, logoUrl]);

    useEffect(() => {
      onPreviewUrlChange?.(previewUrl);
    }, [onPreviewUrlChange, previewUrl]);

    useEffect(() => {
      onPendingChange?.(Boolean(logoFiles[0]));
    }, [logoFiles, onPendingChange]);

    // revoke object urls created for preview to avoid leaking
    useEffect(() => {
      if (!logoFiles[0]) return;
      const objectUrl = URL.createObjectURL(logoFiles[0]);
      return () => URL.revokeObjectURL(objectUrl);
    }, [logoFiles]);

    useImperativeHandle(
      ref,
      () => ({
        hasPendingUpload: () => Boolean(logoFiles[0]),
        clearSelection: () => setLogoFiles([]),
        uploadIfNeeded: async () => {
          const file = logoFiles[0];
          if (!file) return;

          await updateLogo.mutateAsync({ file });
          setLogoFiles([]);
        },
      }),
      [logoFiles, updateLogo]
    );

    return (
      <>
        <LogoViewComponent entityId={entityId} />
        <UploadMedia
          onChange={(files) => setLogoFiles(files.slice(0, 1))}
          multiple={false}
          accept="image/*"
          selected={logoFiles}
          label={label}
        />
      </>
    );
  }
);

export default UploadLogo;
