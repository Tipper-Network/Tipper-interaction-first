"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useEntityDetails } from "@/views/entities/shared/hooks/entities_hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/back_button";
import QrCodeStyling from "@/features/qr_code/components/qr_code_styling";
import QRCustomizationPanel from "./qr_customization_panel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useReplaceQrStyleForEntity,
  useResolvedBrandByEntityId,
} from "@/features/brand/hooks/brand-hooks";
import {
  validateQrStyle,
  type QRStyle,
} from "@/features/qr_code/validation/qrcode-validation";
import { DEFAULT_QR_STYLE, useQrCodeStore } from "../store/qr-code-store";
import NavGuardModal from "@/components/navigation-guard/NavGuardModal";
import UploadLogo, {
  type UploadLogoHandle,
} from "@/views/entities/shared/components/entity_media/upload_logo";
import { EntityMediaRole__Enum } from "@tipper/shared";
import {
  CornerDotType__Enum,
  CornerSquareType__Enum,
  DotType__Enum,
} from "@/styles/default-styles";

const EntityQrCode = () => {
  const params = useParams();
  const entityId = params?.id as string;
  const { data: entity, isLoading, isError } = useEntityDetails(entityId);
  const [isCustomizeOpen, setIsCustomizeOpen] = React.useState(false);
  const qrContainerRef = React.useRef<HTMLDivElement | null>(null);
  const uploadLogoRef = React.useRef<UploadLogoHandle | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>(
    "/assets/logos/Tipper_Logos_Brandmark_Ruby.svg"
  );
  const [isLogoDirty, setIsLogoDirty] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollQrToQr = () => {
    qrContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openCustomizer = () => {
    scrollQrToQr();

    // Let the scroll start before opening the sheet so the QR stays visible at the top.
    window.setTimeout(() => setIsCustomizeOpen(true), 150);
  };
  // Brand-based defaults
  const brandQuery = useResolvedBrandByEntityId(entityId);
  const saveQrStyle = useReplaceQrStyleForEntity(entityId);

  // Get store state and actions
  const style = useQrCodeStore((s) => s.style);
  const isDirty = useQrCodeStore((s) => s.isDirty);
  const hasHydrated = useQrCodeStore((s) => s.hasHydrated);
  const reset = useQrCodeStore((s) => s.reset);
  const hydrateFromBrand = useQrCodeStore((s) => s.hydrateFromBrand);
  const markSaved = useQrCodeStore((s) => s.markSaved);
  const setDotsType = useQrCodeStore((s) => s.setDotsType) as (
    type: DotType__Enum
  ) => void as any;
  const setDotsColor = useQrCodeStore((s) => s.setDotsColor);
  const setCornersSquareType = useQrCodeStore(
    (s) => s.setCornersSquareType
  ) as (type: CornerSquareType__Enum) => void as any;
  const setCornersSquareColor = useQrCodeStore((s) => s.setCornersSquareColor);
  const setCornersDotType = useQrCodeStore((s) => s.setCornersDotType) as (
    type: CornerDotType__Enum
  ) => void as any;
  const setCornersDotColor = useQrCodeStore((s) => s.setCornersDotColor);
  const setBackgroundColor = useQrCodeStore((s) => s.setBackgroundColor);

  // Reset store when switching entities so state doesn't leak across entities.
  useEffect(() => {
    if (!entityId) return;
    reset();
  }, [entityId, reset]);

  // Hydrate once from DB (runtime validation + defaults applied here)
  useEffect(() => {
    if (!brandQuery.data) return;
    if (hasHydrated) return;

    const resolved = validateQrStyle(
      brandQuery.data.qrStyle as Record<string, unknown>
    );
    hydrateFromBrand(resolved);
  }, [brandQuery.data, hasHydrated, hydrateFromBrand]);

  const buildPayload = (): QRStyle => ({
    dotsType: style.dotsType,
    dotsColor: style.dotsColor,
    cornersSquareType: style.cornersSquareType,
    cornersSquareColor: style.cornersSquareColor,
    cornersDotType: style.cornersDotType,
    cornersDotColor: style.cornersDotColor,
    backgroundColor: style.backgroundColor,
  });

  const save = async () => {
    const payload: QRStyle = {
      ...buildPayload(),
    };

    setIsSavingAll(true);
    try {
      await Promise.all([
        saveQrStyle.mutateAsync(payload),
        uploadLogoRef.current?.uploadIfNeeded() ?? Promise.resolve(),
      ]);
    } finally {
      setIsSavingAll(false);
    }
    markSaved();
  };

  const discardToLastSaved = () => {
    // revert local state to what DB had (validated), and clear dirty
    const lastSaved = brandQuery.data?.qrStyle
      ? validateQrStyle(brandQuery.data.qrStyle as Record<string, unknown>)
      : DEFAULT_QR_STYLE;
    hydrateFromBrand(lastSaved);
  };

  const discardAll = () => {
    discardToLastSaved();
    uploadLogoRef.current?.clearSelection();
    setIsLogoDirty(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading QR code...</p>
      </div>
    );
  }

  if (isError || !entity) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">
          Failed to load entity details. Please try again.
        </p>
        <BackButton />
      </div>
    );
  }

  const entityType = entity.entity_type?.toLowerCase() || "business";
  const slug = entity.slug;

  if (!slug) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Entity slug is missing. Please set up your entity profile first.
        </p>
        <BackButton />
      </div>
    );
  }

  const logo_url = entity.entityMedia.find((media: any) => {
    if (media.role === EntityMediaRole__Enum.LOGO) return media.url;
  });

  return (
    <div className="w-full h-[110vh] ">
      {!isCustomizeOpen && (
        <NavGuardModal
          handleConfirmChanges={save}
          handleDiscardChanges={discardAll}
          enabled={isDirty || isLogoDirty}
          confirmationMessage="You have unsaved QR style changes. Save before leaving?"
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle>Download QR Code</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 w-full">
          <p className="text-sm text-muted-foreground text-center">
            Scan this QR code to visit {entity.name}&apos;s welcome page
          </p>
          <div
            className="w-full "
            id="qr-code-container"
            ref={qrContainerRef}
            // helps when a sticky header exists; tweak if needed
            style={{ scrollMarginTop: 16 }}
          >
            <div className="">
              <QrCodeStyling
                slug={slug}
                entityType={entityType}
                downloadButton
                logo={logo_url || logoPreviewUrl || undefined}
                stylingOptions={{
                  dotsType: style.dotsType,
                  dotsColor: style.dotsColor,
                  cornersSquareType: style.cornersSquareType,
                  cornersSquareColor: style.cornersSquareColor,
                  cornersDotType: style.cornersDotType,
                  cornersDotColor: style.cornersDotColor,
                  backgroundColor: style.backgroundColor,
                }}
              />
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-2">
            <Sheet
              open={isCustomizeOpen}
              onOpenChange={(open) => {
                setIsCustomizeOpen(open);
                if (!open) {
                  // Radix locks body scroll while the sheet is closing; wait for the close animation.
                  window.setTimeout(() => scrollToTop(), 150);
                }
              }}
            >
              <Button
                variant="secondary"
                className="w-fit px-4"
                onClick={openCustomizer}
              >
                Customize QR style
              </Button>
              <SheetContent
                side="bottom"
                overlayClassName="bg-black/10"
                className="h-[52dvh] rounded-t-2xl p-0"
              >
                <div className="h-full flex flex-col overflow-hidden">
                  <div className="flex items-center justify-center py-3">
                    <div className="h-1.5 w-12 rounded-full bg-muted" />
                  </div>
                  <SheetHeader className="px-4 pb-3">
                    <SheetTitle className="text-left">
                      Customize QR Code
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <div className="mb-4">
                      <UploadLogo
                        ref={uploadLogoRef}
                        entityId={entityId}
                        initialLogoUrl={entity.logo_url ?? null}
                        onPreviewUrlChange={setLogoPreviewUrl}
                        onPendingChange={setIsLogoDirty}
                      />
                    </div>

                    <QRCustomizationPanel
                      defaultOpen
                      dotsType={style.dotsType}
                      dotsColor={style.dotsColor}
                      cornersSquareType={style.cornersSquareType}
                      cornersSquareColor={style.cornersSquareColor}
                      cornersDotType={style.cornersDotType}
                      cornersDotColor={style.cornersDotColor}
                      backgroundColor={style.backgroundColor}
                      onDotsTypeChange={setDotsType}
                      onDotsColorChange={setDotsColor}
                      onCornersSquareTypeChange={setCornersSquareType}
                      onCornersSquareColorChange={setCornersSquareColor}
                      onCornersDotTypeChange={setCornersDotType}
                      onCornersDotColorChange={setCornersDotColor}
                      onBackgroundColorChange={setBackgroundColor}
                    />
                  </div>

                  <div className="border-t bg-background p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => void save()}
                        disabled={
                          (!isDirty && !isLogoDirty) ||
                          saveQrStyle.isPending ||
                          isSavingAll
                        }
                      >
                        {saveQrStyle.isPending || isSavingAll
                          ? "Saving..."
                          : "Save"}
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={discardAll}
                        disabled={
                          (!isDirty && !isLogoDirty) ||
                          saveQrStyle.isPending ||
                          isSavingAll
                        }
                      >
                        Discard
                      </Button>
                    </div>
                    {(isDirty || isLogoDirty) && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Unsaved changes
                      </p>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityQrCode;
