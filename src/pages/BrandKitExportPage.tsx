import { useId, useState, type ReactNode } from "react";
import { Check, Download, Package } from "lucide-react";

import { BrandShell } from "@/components/app-sidebar";
import {
  BrandPageBody,
  BrandPageHeader,
} from "@/components/BrandPageHeader";
import logoWhiteSrc from "../../design/eyes-closed-logo-variations/Final-logos/09a-white-ec-notagline.svg";
import logoBlackSrc from "../../design/eyes-closed-logo-variations/Final-logos/09b-black-ec-notagline.svg";
import ecPublishingWhiteSrc from "../../design/eyes-closed-logo-variations/EC-White-Publishing.svg";
import ecPublishingBlackSrc from "../../design/eyes-closed-logo-variations/EC-Black=Publishing.svg";
import ecPublishingWhitePngSrc from "../../design/eyes-closed-logo-variations/EC-White-Publishing.png";
import ecPublishingBlackPngSrc from "../../design/eyes-closed-logo-variations/EC-Black=Publishing.png";
import qrCodePngSrc from "../../design/eyes-closed-logo-variations/06c-QR-Code-ec.png";
import qrCodeSvgSrc from "../../design/eyes-closed-logo-variations/06b-QR-Code-ec.svg";
import qrCodePdfSrc from "../../design/eyes-closed-logo-variations/06a-QR-Code-ec.pdf?url";

type SafeZoneType = "none" | "circle" | "square";

interface SizeDef {
  id: string;
  name: string;
  width: number;
  height: number;
  safeZoneType: SafeZoneType;
  padding: number;
}

interface ThemeDef {
  id: string;
  name: string;
  shortName: string;
  bgColor: string;
  logo: string;
}

interface ExportGroup {
  id: string;
  name: string;
  shortName: string;
  category: "logos" | "code" | "profiles" | "utility";
  sizes: SizeDef[];
  themes: ThemeDef[];
}

const CHECKER =
  "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv27PkPU4xVA1GCS0pKYDRR8AAAd3cI2uGg+8AAAAAASUVORK5CYII=')";

const PROFILE_SIZES: SizeDef[] = [
  {
    id: "default",
    name: "1080 × 1080",
    width: 1080,
    height: 1080,
    safeZoneType: "circle",
    padding: 200,
  },
];

const PROFILE_THEMES: ThemeDef[] = [
  {
    id: "white",
    name: "White on dark",
    shortName: "White",
    bgColor: "#050806",
    logo: logoWhiteSrc,
  },
  {
    id: "black",
    name: "Black on cream",
    shortName: "Black",
    bgColor: "#f4ebd9",
    logo: logoBlackSrc,
  },
];

const EXPORT_GROUPS: ExportGroup[] = [
  {
    id: "standard",
    name: "Standard mark",
    shortName: "Mark",
    category: "logos",
    sizes: [
      {
        id: "large",
        name: "Large",
        width: 2048,
        height: 918,
        safeZoneType: "none",
        padding: 0,
      },
      {
        id: "medium",
        name: "Medium",
        width: 1024,
        height: 459,
        safeZoneType: "none",
        padding: 0,
      },
      {
        id: "small",
        name: "Small",
        width: 512,
        height: 230,
        safeZoneType: "none",
        padding: 0,
      },
    ],
    themes: [
      {
        id: "white-trans",
        name: "White",
        shortName: "White",
        bgColor: "transparent",
        logo: logoWhiteSrc,
      },
      {
        id: "black-trans",
        name: "Black",
        shortName: "Black",
        bgColor: "transparent",
        logo: logoBlackSrc,
      },
    ],
  },
  {
    id: "ec-publishing",
    name: "EC Publishing",
    shortName: "Publishing",
    category: "logos",
    sizes: [
      {
        id: "svg",
        name: "SVG",
        width: 1401,
        height: 799,
        safeZoneType: "none",
        padding: 0,
      },
      {
        id: "png",
        name: "PNG",
        width: 1401,
        height: 799,
        safeZoneType: "none",
        padding: 0,
      },
    ],
    themes: [
      {
        id: "white-trans",
        name: "White",
        shortName: "White",
        bgColor: "transparent",
        logo: ecPublishingWhiteSrc,
      },
      {
        id: "black-trans",
        name: "Black",
        shortName: "Black",
        bgColor: "transparent",
        logo: ecPublishingBlackSrc,
      },
    ],
  },
  {
    id: "qr",
    name: "QR code",
    shortName: "QR",
    category: "code",
    sizes: [
      {
        id: "png",
        name: "PNG",
        width: 1080,
        height: 1080,
        safeZoneType: "none",
        padding: 100,
      },
      {
        id: "svg",
        name: "SVG",
        width: 1080,
        height: 1080,
        safeZoneType: "none",
        padding: 100,
      },
      {
        id: "pdf",
        name: "PDF",
        width: 1080,
        height: 1080,
        safeZoneType: "none",
        padding: 100,
      },
    ],
    themes: [
      {
        id: "default",
        name: "Black on cream",
        shortName: "Default",
        bgColor: "#f4ebd9",
        logo: qrCodePngSrc,
      },
    ],
  },
  {
    id: "ig",
    name: "Instagram",
    shortName: "IG",
    category: "profiles",
    sizes: PROFILE_SIZES,
    themes: PROFILE_THEMES,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    shortName: "LinkedIn",
    category: "profiles",
    sizes: PROFILE_SIZES,
    themes: PROFILE_THEMES,
  },
  {
    id: "twitter",
    name: "X / Twitter",
    shortName: "X",
    category: "profiles",
    sizes: PROFILE_SIZES,
    themes: PROFILE_THEMES,
  },
  {
    id: "youtube",
    name: "YouTube",
    shortName: "YouTube",
    category: "profiles",
    sizes: PROFILE_SIZES,
    themes: PROFILE_THEMES,
  },
  {
    id: "tiktok",
    name: "TikTok",
    shortName: "TikTok",
    category: "profiles",
    sizes: PROFILE_SIZES,
    themes: PROFILE_THEMES,
  },
  {
    id: "email",
    name: "Email signature",
    shortName: "Email",
    category: "utility",
    sizes: [
      {
        id: "default",
        name: "400 × 150",
        width: 400,
        height: 150,
        safeZoneType: "square",
        padding: 20,
      },
    ],
    themes: [
      {
        id: "white-trans",
        name: "White",
        shortName: "White",
        bgColor: "transparent",
        logo: logoWhiteSrc,
      },
      {
        id: "black-trans",
        name: "Black",
        shortName: "Black",
        bgColor: "transparent",
        logo: logoBlackSrc,
      },
    ],
  },
  {
    id: "favicon",
    name: "Favicon",
    shortName: "Favicon",
    category: "utility",
    sizes: [
      {
        id: "default",
        name: "512 × 512",
        width: 512,
        height: 512,
        safeZoneType: "square",
        padding: 40,
      },
    ],
    themes: [
      {
        id: "white-trans",
        name: "White",
        shortName: "White",
        bgColor: "transparent",
        logo: logoWhiteSrc,
      },
      {
        id: "black-trans",
        name: "Black",
        shortName: "Black",
        bgColor: "transparent",
        logo: logoBlackSrc,
      },
    ],
  },
];

/** Shown in the picker. EC Publishing stays in the full ZIP only. */
const HIDDEN_PICKER_IDS = new Set(["ec-publishing"]);
const PICKER_GROUPS = EXPORT_GROUPS.filter((g) => !HIDDEN_PICKER_IDS.has(g.id));
const DEFAULT_GROUP = PICKER_GROUPS[0];

const CATEGORY_ORDER = [
  { id: "logos" as const, label: "Logos" },
  { id: "code" as const, label: "Code" },
  { id: "profiles" as const, label: "Profiles" },
  { id: "utility" as const, label: "Utility" },
];

function OptionChip({
  selected,
  onSelect,
  children,
  leading,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  leading?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
        selected
          ? "border-clay/60 bg-clay/15 text-cream"
          : "border-cream/12 bg-cream/[0.03] text-cream/65 hover:border-cream/25 hover:text-cream",
      ].join(" ")}
    >
      {leading}
      <span className="font-medium tracking-wide">{children}</span>
      {selected ? <Check size={14} className="text-clay" aria-hidden /> : null}
    </button>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.28em] text-cream/40"
    >
      {children}
    </label>
  );
}

export default function BrandKitExportPage() {
  const [activeGroupId, setActiveGroupId] = useState(DEFAULT_GROUP.id);
  const [activeSizeId, setActiveSizeId] = useState(DEFAULT_GROUP.sizes[0].id);
  const [activeThemeId, setActiveThemeId] = useState(DEFAULT_GROUP.themes[0].id);
  const [isExporting, setIsExporting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const assetSelectId = useId();

  const activeGroup =
    PICKER_GROUPS.find((g) => g.id === activeGroupId) ?? DEFAULT_GROUP;
  const activeSize =
    activeGroup.sizes.find((s) => s.id === activeSizeId) ??
    activeGroup.sizes[0];
  const activeTheme =
    activeGroup.themes.find((t) => t.id === activeThemeId) ??
    activeGroup.themes[0];

  const selectGroup = (group: ExportGroup) => {
    setActiveGroupId(group.id);
    setActiveSizeId(group.sizes[0].id);
    setActiveThemeId(group.themes[0].id);
  };

  const generatePngBlob = async (
    size: SizeDef,
    theme: ThemeDef,
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No 2d context"));

      if (theme.bgColor !== "transparent") {
        ctx.fillStyle = theme.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const img = new Image();
      img.onload = () => {
        const nativeWidth = img.naturalWidth || img.width || 1401;
        const nativeHeight = img.naturalHeight || img.height || 799;
        const availableWidth = canvas.width - size.padding * 2;
        const availableHeight = canvas.height - size.padding * 2;
        const imgRatio = nativeWidth / nativeHeight;
        const availableRatio = availableWidth / availableHeight;

        let drawWidth: number;
        let drawHeight: number;

        if (imgRatio > availableRatio) {
          drawWidth = availableWidth;
          drawHeight = drawWidth / imgRatio;
        } else {
          drawHeight = availableHeight;
          drawWidth = drawHeight * imgRatio;
        }

        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;
        ctx.drawImage(img, x, y, drawWidth, drawHeight);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to generate blob"));
        }, "image/png");
      };
      img.onerror = () => reject(new Error("Image failed to load"));
      img.src = theme.logo;
    });
  };

  const handleDownloadAll = async () => {
    setIsZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      for (const group of EXPORT_GROUPS) {
        if (group.id === "ec-publishing") {
          const folder = zip.folder(group.name);
          if (!folder) continue;

          folder.file(
            "eyes-closed-publishing-white.svg",
            await fetch(ecPublishingWhiteSrc).then((r) => r.blob()),
          );
          folder.file(
            "eyes-closed-publishing-black.svg",
            await fetch(ecPublishingBlackSrc).then((r) => r.blob()),
          );
          folder.file(
            "eyes-closed-publishing-white.png",
            await fetch(ecPublishingWhitePngSrc).then((r) => r.blob()),
          );
          folder.file(
            "eyes-closed-publishing-black.png",
            await fetch(ecPublishingBlackPngSrc).then((r) => r.blob()),
          );
          continue;
        }

        if (group.id === "qr") {
          const folder = zip.folder(group.name);
          if (!folder) continue;
          folder.file(
            "eyes-closed-qr-code.png",
            await fetch(qrCodePngSrc).then((r) => r.blob()),
          );
          folder.file(
            "eyes-closed-qr-code.svg",
            await fetch(qrCodeSvgSrc).then((r) => r.blob()),
          );
          folder.file(
            "eyes-closed-qr-code.pdf",
            await fetch(qrCodePdfSrc).then((r) => r.blob()),
          );
          continue;
        }

        const folder = zip.folder(group.name);
        if (!folder) continue;

        for (const size of group.sizes) {
          for (const theme of group.themes) {
            const blob = await generatePngBlob(size, theme);
            const safeThemeName = theme.name.replace(/\//g, "-");
            const safeSizeName = size.name.replace(/\//g, "-");
            folder.file(
              `eyes-closed-${group.id}-${safeThemeName}-${safeSizeName}.png`,
              blob,
            );
          }
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "eyes-closed-complete-brand-kit.zip";
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to generate zip file.");
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownload = () => {
    if (activeGroup.id === "ec-publishing") {
      const isWhite = activeTheme.id === "white-trans";
      const link = document.createElement("a");
      link.download = `eyes-closed-publishing-${isWhite ? "white" : "black"}.${activeSize.id}`;
      if (activeSize.id === "svg") {
        link.href = isWhite ? ecPublishingWhiteSrc : ecPublishingBlackSrc;
      } else if (activeSize.id === "png") {
        link.href = isWhite ? ecPublishingWhitePngSrc : ecPublishingBlackPngSrc;
      }
      link.click();
      return;
    }

    if (activeGroup.id === "qr") {
      const link = document.createElement("a");
      link.download = `eyes-closed-qr-code.${activeSize.id}`;
      if (activeSize.id === "pdf") link.href = qrCodePdfSrc;
      if (activeSize.id === "svg") link.href = qrCodeSvgSrc;
      if (activeSize.id === "png") link.href = qrCodePngSrc;
      link.click();
      return;
    }

    setIsExporting(true);
    const canvas = document.createElement("canvas");
    canvas.width = activeSize.width;
    canvas.height = activeSize.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    if (activeTheme.bgColor !== "transparent") {
      ctx.fillStyle = activeTheme.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const img = new Image();
    img.src = activeTheme.logo;
    img.onload = () => {
      const nativeWidth = img.naturalWidth || img.width || 1401;
      const nativeHeight = img.naturalHeight || img.height || 799;
      const availableWidth = canvas.width - activeSize.padding * 2;
      const availableHeight = canvas.height - activeSize.padding * 2;
      const imgRatio = nativeWidth / nativeHeight;
      const availableRatio = availableWidth / availableHeight;

      let drawWidth: number;
      let drawHeight: number;

      if (imgRatio > availableRatio) {
        drawWidth = availableWidth;
        drawHeight = drawWidth / imgRatio;
      } else {
        drawHeight = availableHeight;
        drawWidth = drawHeight * imgRatio;
      }

      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;
      ctx.drawImage(img, x, y, drawWidth, drawHeight);

      const link = document.createElement("a");
      link.download = `eyes-closed-${activeGroup.id}-${activeSize.id}-${activeTheme.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsExporting(false);
    };

    img.onerror = () => {
      setIsExporting(false);
      alert("Failed to load SVG asset for export.");
    };
  };

  const paddingPercentage = (activeSize.padding / activeSize.width) * 100;
  const isCircleSafe = activeSize.safeZoneType === "circle";
  const exportLabel =
    activeGroup.id === "qr"
      ? `Download ${activeSize.name}`
      : `Export ${activeSize.width} × ${activeSize.height}`;

  return (
    <BrandShell activeId="brand-kit" crumb="Logo Options">
      <BrandPageBody>
        <div className="w-full min-w-0 max-w-6xl overflow-x-hidden pb-24 md:pb-0">
          <BrandPageHeader
            eyebrow="Export materials"
            title="Logo Options"
            description="Pick an asset, preview it, then export."
            actions={
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={isZipping}
                className="hidden items-center justify-center gap-2.5 rounded-full border border-cream/15 bg-transparent px-5 py-3 text-xs font-bold uppercase tracking-widest text-cream/80 transition-colors hover:border-cream/30 hover:text-cream disabled:opacity-50 md:inline-flex"
              >
                {isZipping ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cream/20 border-t-cream" />
                    Packaging…
                  </>
                ) : (
                  <>
                    <Package size={15} aria-hidden />
                    Full kit ZIP
                  </>
                )}
              </button>
            }
          />

          <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-5 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
            {/* Mobile: asset rail before preview so pick + see share one screen */}
            <div className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-20">
              <aside className="flex min-w-0 flex-col gap-3">
                <div className="min-w-0">
                  <FieldLabel htmlFor={assetSelectId}>Asset</FieldLabel>
                  <p className="mb-3 max-w-sm text-sm leading-snug text-cream/50">
                    Each export is sized and cropped for that platform.
                  </p>
                  <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div
                      id={assetSelectId}
                      role="listbox"
                      aria-label="Brand assets"
                      className="flex w-max max-w-none gap-2 lg:w-full lg:max-w-full lg:flex-col"
                    >
                      {CATEGORY_ORDER.map((category) => {
                        const items = PICKER_GROUPS.filter(
                          (g) => g.category === category.id,
                        );
                        if (items.length === 0) return null;

                        return (
                          <div
                            key={category.id}
                            className="flex shrink-0 items-center gap-2 lg:w-full lg:flex-col lg:items-stretch"
                          >
                            <p className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-cream/30 lg:mb-1 lg:mt-3 lg:block lg:first:mt-0">
                              {category.label}
                            </p>
                            {items.map((group) => {
                              const selected = group.id === activeGroupId;
                              return (
                                <button
                                  key={group.id}
                                  type="button"
                                  role="option"
                                  aria-selected={selected}
                                  onClick={() => selectGroup(group)}
                                  className={[
                                    "inline-flex min-h-10 shrink-0 items-center justify-between gap-3 rounded-full border px-3.5 text-left text-sm transition-colors lg:min-h-11 lg:w-full lg:rounded-xl lg:px-3.5 lg:py-2.5",
                                    selected
                                      ? "border-clay/55 bg-clay/15 text-cream"
                                      : "border-cream/12 bg-cream/[0.03] text-cream/65 hover:border-cream/25 hover:text-cream",
                                  ].join(" ")}
                                >
                                  <span className="font-medium tracking-wide lg:hidden">
                                    {group.shortName}
                                  </span>
                                  <span className="hidden font-medium tracking-wide lg:inline">
                                    {group.name}
                                  </span>
                                  {selected ? (
                                    <Check
                                      size={14}
                                      className="hidden shrink-0 text-clay lg:inline"
                                      aria-hidden
                                    />
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            <section
              aria-label="Asset preview"
              className="relative order-2 min-w-0 overflow-hidden rounded-2xl border border-cream/10 bg-[#0c100e] lg:order-1"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(204,88,51,0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(159,181,170,0.08), transparent 50%)",
                }}
              />

              <div className="relative flex min-w-0 items-center justify-between gap-3 border-b border-cream/[0.07] px-4 py-2.5 sm:px-5 sm:py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#9fb5aa]">
                    Preview
                  </p>
                  <p className="mt-0.5 truncate font-serif text-base italic text-cream sm:mt-1 sm:text-xl">
                    {activeGroup.name}
                  </p>
                </div>
                <p className="max-w-[40%] shrink-0 truncate text-right font-mono text-[10px] leading-relaxed tracking-wide text-cream/45">
                  {activeTheme.shortName}
                  <span className="mx-1.5 text-cream/20">·</span>
                  {activeSize.width}×{activeSize.height}
                </p>
              </div>

              <div className="relative flex min-w-0 items-center justify-center px-4 py-4 sm:px-8 sm:py-10 lg:py-12">
                <div
                  className={[
                    "relative flex h-[132px] w-full max-w-[20rem] items-center justify-center overflow-hidden border border-cream/10 transition-[border-radius] duration-300 sm:h-[240px] sm:max-w-md lg:h-[280px]",
                    isCircleSafe
                      ? "rounded-full !max-w-[132px] sm:!max-w-[240px] lg:!max-w-[280px]"
                      : "rounded-xl",
                  ].join(" ")}
                  style={{
                    backgroundColor:
                      activeTheme.bgColor === "transparent"
                        ? "transparent"
                        : activeTheme.bgColor,
                    backgroundImage:
                      activeTheme.bgColor === "transparent" ? CHECKER : "none",
                    backgroundSize:
                      activeTheme.bgColor === "transparent"
                        ? "10px 10px"
                        : undefined,
                  }}
                >
                  <img
                    src={activeTheme.logo}
                    alt={`${activeGroup.name} — ${activeTheme.name}`}
                    className="pointer-events-none max-h-full max-w-full object-contain"
                    style={{ padding: `${Math.min(paddingPercentage, 18)}%` }}
                  />
                  {isCircleSafe ? (
                    <div
                      className="pointer-events-none absolute inset-0 rounded-full border border-dashed border-clay/50"
                      aria-hidden
                    />
                  ) : null}
                </div>
              </div>

              {/* Format + color under preview */}
              <div className="relative space-y-4 border-t border-cream/[0.07] px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-8">
                  {activeGroup.sizes.length > 1 ? (
                    <div>
                      <FieldLabel>Format</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {activeGroup.sizes.map((size) => (
                          <OptionChip
                            key={size.id}
                            selected={size.id === activeSizeId}
                            onSelect={() => setActiveSizeId(size.id)}
                          >
                            {size.name}
                          </OptionChip>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {activeGroup.themes.length > 1 ? (
                    <div>
                      <FieldLabel>Color</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {activeGroup.themes.map((theme) => (
                          <OptionChip
                            key={theme.id}
                            selected={theme.id === activeThemeId}
                            onSelect={() => setActiveThemeId(theme.id)}
                            leading={
                              <span
                                className="relative h-3.5 w-3.5 overflow-hidden rounded-full border border-cream/25"
                                style={{
                                  backgroundColor:
                                    theme.bgColor === "transparent"
                                      ? "#1a1f1c"
                                      : theme.bgColor,
                                }}
                                aria-hidden
                              >
                                <span
                                  className="absolute inset-[3px] rounded-full"
                                  style={{
                                    backgroundColor: theme.id.includes("white")
                                      ? "#f4ebd9"
                                      : "#050806",
                                  }}
                                />
                              </span>
                            }
                          >
                            {theme.shortName}
                          </OptionChip>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={handleDownloadAll}
                  disabled={isZipping}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cream/12 px-4 py-2.5 text-[11px] font-medium uppercase tracking-widest text-cream/55 transition-colors hover:border-cream/25 hover:text-cream/80 disabled:opacity-50 md:hidden"
                >
                  <Package size={14} aria-hidden />
                  {isZipping ? "Packaging full kit…" : "Full kit ZIP"}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="hidden w-full items-center justify-center gap-2.5 rounded-full bg-clay px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-charcoal transition-colors hover:bg-cream disabled:opacity-50 md:inline-flex"
                >
                  <Download size={16} aria-hidden />
                  {isExporting ? "Exporting…" : exportLabel}
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Mobile sticky export — always reachable */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-cream/10 bg-[#080a09]/92 px-4 py-3 backdrop-blur-md md:hidden">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-clay px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-charcoal transition-colors hover:bg-cream disabled:opacity-50"
          >
            <Download size={16} aria-hidden />
            {isExporting ? "Exporting…" : exportLabel}
          </button>
        </div>
      </BrandPageBody>
    </BrandShell>
  );
}
