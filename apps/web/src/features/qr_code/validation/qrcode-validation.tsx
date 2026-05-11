import {
  DotType__Enum,
  CornerDotType__Enum,
  CornerSquareType__Enum,
} from "@/styles/default-styles";
import { DEFAULT_QR_STYLE, type QRStyleState } from "../store/qr-code-store";

export type QRStyle = QRStyleState;

const isAllowed = <T extends string>(
  value: unknown,
  allowed: readonly T[]
): value is T => typeof value === "string" && allowed.includes(value as T);

export function validateQrStyle(
  qrStyle: Record<string, unknown> | undefined
): QRStyleState {
  const dotsTypeValue = qrStyle?.dotsType;
  const cornersSquareTypeValue = qrStyle?.cornersSquareType;
  const cornersDotTypeValue = qrStyle?.cornersDotType;

  return {
    dotsType: isAllowed(dotsTypeValue, Object.values(DotType__Enum))
      ? dotsTypeValue
      : DEFAULT_QR_STYLE.dotsType,
    dotsColor:
      typeof qrStyle?.dotsColor === "string"
        ? qrStyle.dotsColor
        : DEFAULT_QR_STYLE.dotsColor,
    cornersSquareType: isAllowed(
      cornersSquareTypeValue,
      Object.values(CornerSquareType__Enum)
    )
      ? cornersSquareTypeValue
      : DEFAULT_QR_STYLE.cornersSquareType,
    cornersSquareColor:
      typeof qrStyle?.cornersSquareColor === "string"
        ? qrStyle.cornersSquareColor
        : DEFAULT_QR_STYLE.cornersSquareColor,
    cornersDotType: isAllowed(
      cornersDotTypeValue,
      Object.values(CornerDotType__Enum)
    )
      ? cornersDotTypeValue
      : DEFAULT_QR_STYLE.cornersDotType,
    cornersDotColor:
      typeof qrStyle?.cornersDotColor === "string"
        ? qrStyle.cornersDotColor
        : DEFAULT_QR_STYLE.cornersDotColor,
    backgroundColor:
      typeof qrStyle?.backgroundColor === "string"
        ? qrStyle.backgroundColor
        : DEFAULT_QR_STYLE.backgroundColor,
  };
}
