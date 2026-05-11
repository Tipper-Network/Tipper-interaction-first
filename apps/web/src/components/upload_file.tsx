import React, { useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import { X } from "lucide-react";

type UploadMediaProps = {
  onChange: (files: File[]) => void;
  label?: string;
  accept?: string;
  multiple?: boolean;
  showCount?: boolean;
  selected?: File[];
  showCameraButton?: boolean;
  className?: string;
  inputClassName?: string;
  cameraButtonLabel?: string;
  disabled?: boolean;
  id?: string;
};

export function UploadMedia({
  onChange,
  label = "Upload Media",
  accept = "image/*,video/*",
  multiple = true,
  showCount = true,
  selected,
  showCameraButton = false,
  className = " gap-2 h",
  inputClassName = "over:transition-all hover:ease-in-out hover:duration-300  mb-2  h-auto w-auto max-w-lg hover:shadow-lg hover:rounded-md hover:translate-y-[1px]",
  cameraButtonLabel = "Open Camera",
  disabled = false,
  id,
}: UploadMediaProps) {
  const inputId = id ?? "upload-media-input";
  const cameraInputId = `${inputId}-camera`;

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    onChange(Array.from(list));
    // allow re-selecting the same files
    e.currentTarget.value = "";
  };

  const handleCameraFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    onChange(Array.from(list));
    e.currentTarget.value = "";
  };

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <div className={className}>
        <input
          id={inputId}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFilesChange}
          className="sr-only"
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={() => document.getElementById(inputId)?.click()}
          variant="outline"
          className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50"
          disabled={disabled}
        >
          {selected && selected.length > 0 ? "Change files" : "Select media"}
        </Button>

        {showCameraButton && (
          <>
            <input
              id={cameraInputId}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={handleCameraFilesChange}
              disabled={disabled}
            />
            <Button
              type="button"
              onClick={() => document.getElementById(cameraInputId)?.click()}
              variant="outline"
              className="mt-2 inline-flex items-center rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50"
              disabled={disabled}
            >
              {cameraButtonLabel}
            </Button>
          </>
        )}

        {showCount &&
          typeof selected?.length === "number" &&
          selected.length > 0 && (
            <div className="mb-2">
              <p className="mt-1 text-sm text-gray-500">
                {selected?.length} file
                {selected.length > 1 ? "s" : ""} selected
              </p>
              <div className="flex flex-row gap-2 rounded-md overflow-hidden flex-wrap ">
                {selected?.map((file, indx) => {
                  return (
                    <div key={indx} className="relative">
                      <Button
                        variant="simple"
                        className="absolute px-1 py-1 h-5 w-5 top-1 right-1 bg-white/40"
                        onClick={() => {
                          onChange?.(selected?.filter((_, i) => i !== indx) || []);
                        }}
                      >
                        <X className="h-2 w-2 " />
                      </Button>
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        width={100}
                        height={100}
                        className="rounded-md object-cover min-h-20 min-w-20 hover:cursor-pointer"
                        onClick={() => {
                          const fileUrl = URL.createObjectURL(file);
                          window.open(fileUrl, "_blank");
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
