// QR Code styling enums matching qr-code-styling library
export enum DotType__Enum {
  DOTS = "dots",
  ROUNDED = "rounded",
  CLASSY = "classy",
  CLASSY_ROUNDED = "classy-rounded",
  SQUARE = "square",
  EXTRA_ROUNDED = "extra-rounded",
}

export enum CornerSquareType__Enum {
  DOT = "dot",
  SQUARE = "square",
  EXTRA_ROUNDED = "extra-rounded",
  DOTS = "dots",
  ROUNDED = "rounded",
  CLASSY = "classy",
  CLASSY_ROUNDED = "classy-rounded",
}

export enum CornerDotType__Enum {
  DOT = "dot",
  SQUARE = "square",
  DOTS = "dots",
  ROUNDED = "rounded",
  CLASSY = "classy",
  CLASSY_ROUNDED = "classy-rounded",
  EXTRA_ROUNDED = "extra-rounded",
}

/**
 * Default brand configuration
 * Lives in code, NEVER in DB
 * Uses CSS variables from global.css
 */
export const DEFAULT_BRAND = {
  colors: {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    background: "hsl(var(--background))",
  },
  qrStyle: {
    dotsType: DotType__Enum.ROUNDED,
    dotsColor: "hsl(var(--primary))",
    cornersSquareType: CornerSquareType__Enum.CLASSY_ROUNDED,
    cornersSquareColor: "hsl(var(--secondary))",
    cornersDotType: CornerDotType__Enum.CLASSY_ROUNDED,
    backgroundColor: "hsl(var(--background))",
  },
};
