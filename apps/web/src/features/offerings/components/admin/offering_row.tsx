"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Offering } from "../../api/types";
import { useUploadOfferingMedia } from "../../hooks/offerings_hooks";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OfferingType__Enum } from "@tipper/shared";
import Image from "next/image";
import UploadMediaPreview from "@/components/shared/upload_media_preview";

function guessAcceptForType(type: OfferingType__Enum) {
  // For now: most offerings are PDF-based; allow images too.
  if (type === OfferingType__Enum.MENU) return "application/pdf,image/*";
  return "application/pdf,image/*";
}
const OfferingRow = (props: {
  entityId: string;
  offering: Offering;
  onRename: (label: string) => Promise<void>;
  onDelete: () => Promise<void>;
  isMutating: boolean;
}) => {
  const { offering, entityId } = props;
  const [label, setLabel] = useState(offering.label);
  const [files, setFiles] = useState<File[]>([]);

  const uploadMut = useUploadOfferingMedia(entityId, offering.id);

  const draftPdfs = useMemo(
    () =>
      files.filter((f) => {
        const name = (f?.name ?? "").toLowerCase();
        return f?.type === "application/pdf" || name.endsWith(".pdf");
      }),
    [files]
  );

  const onSaveLabel = async () => {
    const next = label.trim();
    if (!next || next === offering.label) return;
    try {
      await props.onRename(next);
      toast.success("Offering updated");
    } catch (e: any) {
      toast.error("Failed to update offering", {
        description: e?.message ?? String(e),
      });
    }
  };

  const onUpload = async () => {
    if (files.length === 0) return;
    try {
      await uploadMut.mutateAsync(files);
      toast.success("Media uploaded");
      setFiles([]);
    } catch (e: any) {
      toast.error("Failed to upload media", {
        description: e?.message ?? String(e),
      });
    }
  };

  const pdf = offering.offeringMedia?.find(
    (m) => m.type === "DOCUMENT" && m.url
  );
  const images = (offering.offeringMedia ?? []).filter(
    (m) => m.type === "IMAGE" && m.url
  );

  return (
    <div className="rounded-2xl bg-muted/30 ring-1 ring-border px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-xs text-muted-foreground">
            {offering.offeringType} • {offering.status} • {offering.format}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="h-8"
            />

            <div className="flex flex-col items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-full px-3 text-xs"
                disabled={props.isMutating || label.trim() === offering.label}
                onClick={onSaveLabel}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-full px-3 text-xs"
                disabled={props.isMutating}
                onClick={props.onDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              multiple
              accept={guessAcceptForType(offering.offeringType)}
              onChange={(e) => {
                const list = e.target.files;
                setFiles(list ? Array.from(list) : []);
              }}
              aria-label="Upload media"
              id="upload-media-input"
            />

            <Button
              type="button"
              className="h-8 rounded-full px-3 text-xs"
              disabled={uploadMut.isPending || files.length === 0}
              onClick={onUpload}
            >
              {uploadMut.isPending ? "Uploading..." : "Upload"}
            </Button>

            <UploadMediaPreview files={files} />
          </div>
        </div>

        {draftPdfs.length > 0 ? (
          <div className="text-xs text-muted-foreground">
            Selected PDF{draftPdfs.length > 1 ? "s" : ""}:{" "}
            {draftPdfs
              .slice(0, 2)
              .map((f) => f.name)
              .join(", ")}
            {draftPdfs.length > 2 ? ` (+${draftPdfs.length - 2} more)` : ""}
          </div>
        ) : null}

        {pdf?.url ? (
          <a
            href={pdf.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium underline decoration-muted-foreground/40 underline-offset-4"
          >
            Open PDF
          </a>
        ) : null}
      </div>
      {images.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {images.slice(0, 6).map((m) => (
            <a
              key={m.id}
              href={m.url!}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline decoration-muted-foreground/40 underline-offset-4"
            >
              <Image
                key={m.id}
                src={m.url!}
                alt="Draft preview"
                className="h-full w-full rounded-md object-cover ring-1 ring-border"
                width={500}
                height={500}
              />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default OfferingRow;
