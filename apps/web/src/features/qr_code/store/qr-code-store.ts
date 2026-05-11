"use client";

import { create } from "zustand";
import {
  DotType__Enum,
  CornerSquareType__Enum,
  CornerDotType__Enum,
  DEFAULT_BRAND,
} from "@/styles/default-styles";

export type QRStyleState = {
  dotsType: DotType__Enum;
  dotsColor: string;
  cornersSquareType: CornerSquareType__Enum;
  cornersSquareColor: string;
  cornersDotType: CornerDotType__Enum;
  cornersDotColor: string;
  backgroundColor: string;
};

export const DEFAULT_QR_STYLE: QRStyleState = {
  dotsType: DEFAULT_BRAND.qrStyle.dotsType,
  dotsColor: DEFAULT_BRAND.colors.primary,
  cornersSquareType: DEFAULT_BRAND.qrStyle.cornersSquareType,
  cornersSquareColor: DEFAULT_BRAND.colors.primary,
  cornersDotType: DEFAULT_BRAND.qrStyle.cornersDotType,
  cornersDotColor: DEFAULT_BRAND.colors.primary,
  backgroundColor: DEFAULT_BRAND.colors.background,
};

type QRCodeStore = {
  style: QRStyleState;
  isDirty: boolean;
  hasHydrated: boolean;

  reset: () => void;
  hydrateFromBrand: (style: QRStyleState) => void;
  markSaved: () => void;

  setDotsType: (value: DotType__Enum) => void;
  setDotsColor: (value: string) => void;
  setCornersSquareType: (value: CornerSquareType__Enum) => void;
  setCornersSquareColor: (value: string) => void;
  setCornersDotType: (value: CornerDotType__Enum) => void;
  setCornersDotColor: (value: string) => void;
  setBackgroundColor: (value: string) => void;
};

export const useQrCodeStore = create<QRCodeStore>((set) => ({
  style: DEFAULT_QR_STYLE,
  isDirty: false,
  hasHydrated: false,

  reset: () =>
    set({
      style: DEFAULT_QR_STYLE,
      isDirty: false,
      hasHydrated: false,
    }),

  hydrateFromBrand: (style) =>
    set({
      style,
      isDirty: false,
      hasHydrated: true,
    }),

  markSaved: () => set({ isDirty: false }),

  setDotsType: (value) =>
    set((s) => ({ style: { ...s.style, dotsType: value }, isDirty: true })),
  setDotsColor: (value) =>
    set((s) => ({ style: { ...s.style, dotsColor: value }, isDirty: true })),
  setCornersSquareType: (value) =>
    set((s) => ({
      style: { ...s.style, cornersSquareType: value },
      isDirty: true,
    })),
  setCornersSquareColor: (value) =>
    set((s) => ({
      style: { ...s.style, cornersSquareColor: value },
      isDirty: true,
    })),
  setCornersDotType: (value) =>
    set((s) => ({
      style: { ...s.style, cornersDotType: value },
      isDirty: true,
    })),
  setCornersDotColor: (value) =>
    set((s) => ({
      style: { ...s.style, cornersDotColor: value },
      isDirty: true,
    })),
  setBackgroundColor: (value) =>
    set((s) => ({
      style: { ...s.style, backgroundColor: value },
      isDirty: true,
    })),
}));
