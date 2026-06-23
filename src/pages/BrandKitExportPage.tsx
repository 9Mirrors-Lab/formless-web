import { useState } from "react";
import { Download, Check } from "lucide-react";

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
  bgColor: string;
  logo: string;
}

interface ExportGroup {
  id: string;
  name: string;
  sizes: SizeDef[];
  themes: ThemeDef[];
}

const EXPORT_GROUPS: ExportGroup[] = [
  {
    id: "ec-publishing",
    name: "EC Publishing Logo",
    sizes: [
      { id: "svg", name: "Download SVG", width: 1401, height: 799, safeZoneType: "none", padding: 0 },
      { id: "png", name: "Download PNG", width: 1401, height: 799, safeZoneType: "none", padding: 0 },
    ],
    themes: [
      { id: "white-trans", name: "White Logo", bgColor: "transparent", logo: ecPublishingWhiteSrc },
      { id: "black-trans", name: "Black Logo", bgColor: "transparent", logo: ecPublishingBlackSrc },
    ]
  },
  {
    id: "qr",
    name: "QR Code",
    sizes: [
      { id: "png", name: "Download PNG", width: 1080, height: 1080, safeZoneType: "none", padding: 100 },
      { id: "svg", name: "Download SVG", width: 1080, height: 1080, safeZoneType: "none", padding: 100 },
      { id: "pdf", name: "Download PDF", width: 1080, height: 1080, safeZoneType: "none", padding: 100 },
    ],
    themes: [
      { id: "default", name: "QR Code (Black)", bgColor: "#f4ebd9", logo: qrCodePngSrc },
    ]
  },
  {
    id: "standard",
    name: "Standard Logos",
    sizes: [
      { id: "large", name: "Large (2048px)", width: 2048, height: 918, safeZoneType: "none", padding: 0 },
      { id: "medium", name: "Medium (1024px)", width: 1024, height: 459, safeZoneType: "none", padding: 0 },
      { id: "small", name: "Small (512px)", width: 512, height: 230, safeZoneType: "none", padding: 0 },
    ],
    themes: [
      { id: "white-trans", name: "White Logo (Transparent)", bgColor: "transparent", logo: logoWhiteSrc },
      { id: "black-trans", name: "Black Logo (Transparent)", bgColor: "transparent", logo: logoBlackSrc },
    ]
  },
  {
    id: "ig",
    name: "Instagram Profile",
    sizes: [
      { id: "default", name: "1080 × 1080", width: 1080, height: 1080, safeZoneType: "circle", padding: 200 },
    ],
    themes: [
      { id: "white", name: "White Logo (Dark bg)", bgColor: "#050806", logo: logoWhiteSrc },
      { id: "black", name: "Black Logo (Cream bg)", bgColor: "#f4ebd9", logo: logoBlackSrc },
    ]
  },
  {
    id: "linkedin",
    name: "LinkedIn Profile",
    sizes: [
      { id: "default", name: "1080 × 1080", width: 1080, height: 1080, safeZoneType: "circle", padding: 200 },
    ],
    themes: [
      { id: "white", name: "White Logo (Dark bg)", bgColor: "#050806", logo: logoWhiteSrc },
      { id: "black", name: "Black Logo (Cream bg)", bgColor: "#f4ebd9", logo: logoBlackSrc },
    ]
  },
  {
    id: "twitter",
    name: "Twitter / X Profile",
    sizes: [
      { id: "default", name: "1080 × 1080", width: 1080, height: 1080, safeZoneType: "circle", padding: 200 },
    ],
    themes: [
      { id: "white", name: "White Logo (Dark bg)", bgColor: "#050806", logo: logoWhiteSrc },
      { id: "black", name: "Black Logo (Cream bg)", bgColor: "#f4ebd9", logo: logoBlackSrc },
    ]
  },
  {
    id: "youtube",
    name: "YouTube Profile",
    sizes: [
      { id: "default", name: "1080 × 1080", width: 1080, height: 1080, safeZoneType: "circle", padding: 200 },
    ],
    themes: [
      { id: "white", name: "White Logo (Dark bg)", bgColor: "#050806", logo: logoWhiteSrc },
      { id: "black", name: "Black Logo (Cream bg)", bgColor: "#f4ebd9", logo: logoBlackSrc },
    ]
  },
  {
    id: "tiktok",
    name: "TikTok Profile",
    sizes: [
      { id: "default", name: "1080 × 1080", width: 1080, height: 1080, safeZoneType: "circle", padding: 200 },
    ],
    themes: [
      { id: "white", name: "White Logo (Dark bg)", bgColor: "#050806", logo: logoWhiteSrc },
      { id: "black", name: "Black Logo (Cream bg)", bgColor: "#f4ebd9", logo: logoBlackSrc },
    ]
  },
  {
    id: "email",
    name: "Email Signature",
    sizes: [
      { id: "default", name: "400 × 150", width: 400, height: 150, safeZoneType: "square", padding: 20 },
    ],
    themes: [
      { id: "white-trans", name: "White Logo (Transparent)", bgColor: "transparent", logo: logoWhiteSrc },
      { id: "black-trans", name: "Black Logo (Transparent)", bgColor: "transparent", logo: logoBlackSrc },
    ]
  },
  {
    id: "favicon",
    name: "Favicon / Web",
    sizes: [
      { id: "default", name: "512 × 512", width: 512, height: 512, safeZoneType: "square", padding: 40 },
    ],
    themes: [
      { id: "white-trans", name: "White Logo (Transparent)", bgColor: "transparent", logo: logoWhiteSrc },
      { id: "black-trans", name: "Black Logo (Transparent)", bgColor: "transparent", logo: logoBlackSrc },
    ]
  }
];

export default function BrandKitExportPage() {
  const [activeGroupId, setActiveGroupId] = useState(EXPORT_GROUPS[0].id);
  const [activeSizeId, setActiveSizeId] = useState(EXPORT_GROUPS[0].sizes[0].id);
  const [activeThemeId, setActiveThemeId] = useState(EXPORT_GROUPS[0].themes[0].id);
  
  const [isExporting, setIsExporting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const activeGroup = EXPORT_GROUPS.find(g => g.id === activeGroupId)!;
  const activeSize = activeGroup.sizes.find(s => s.id === activeSizeId) || activeGroup.sizes[0];
  const activeTheme = activeGroup.themes.find(t => t.id === activeThemeId) || activeGroup.themes[0];

  const generatePngBlob = async (size: SizeDef, theme: ThemeDef): Promise<Blob> => {
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

        const availableWidth = canvas.width - (size.padding * 2);
        const availableHeight = canvas.height - (size.padding * 2);
        
        const imgRatio = nativeWidth / nativeHeight;
        const availableRatio = availableWidth / availableHeight;

        let drawWidth, drawHeight;

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
          
          const whiteSvgBlob = await fetch(ecPublishingWhiteSrc).then(r => r.blob());
          folder.file('eyes-closed-publishing-white.svg', whiteSvgBlob);
          
          const blackSvgBlob = await fetch(ecPublishingBlackSrc).then(r => r.blob());
          folder.file('eyes-closed-publishing-black.svg', blackSvgBlob);

          const whitePngBlob = await fetch(ecPublishingWhitePngSrc).then(r => r.blob());
          folder.file('eyes-closed-publishing-white.png', whitePngBlob);
          
          const blackPngBlob = await fetch(ecPublishingBlackPngSrc).then(r => r.blob());
          folder.file('eyes-closed-publishing-black.png', blackPngBlob);
          continue;
        }

        if (group.id === "qr") {
          const folder = zip.folder(group.name);
          if (!folder) continue;
          
          const pngBlob = await fetch(qrCodePngSrc).then(r => r.blob());
          folder.file('eyes-closed-qr-code.png', pngBlob);
          
          const svgBlob = await fetch(qrCodeSvgSrc).then(r => r.blob());
          folder.file('eyes-closed-qr-code.svg', svgBlob);
          
          const pdfBlob = await fetch(qrCodePdfSrc).then(r => r.blob());
          folder.file('eyes-closed-qr-code.pdf', pdfBlob);
          continue;
        }

        const folder = zip.folder(group.name);
        if (!folder) continue;

        for (const size of group.sizes) {
          for (const theme of group.themes) {
            const blob = await generatePngBlob(size, theme);
            const safeThemeName = theme.name.replace(/\//g, '-');
            const safeSizeName = size.name.replace(/\//g, '-');
            folder.file(`eyes-closed-${group.id}-${safeThemeName}-${safeSizeName}.png`, blob);
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
      const isWhite = activeTheme.id === 'white-trans';
      const link = document.createElement('a');
      link.download = `eyes-closed-publishing-${isWhite ? 'white' : 'black'}.${activeSize.id}`;
      
      if (activeSize.id === 'svg') {
        link.href = isWhite ? ecPublishingWhiteSrc : ecPublishingBlackSrc;
      } else if (activeSize.id === 'png') {
        link.href = isWhite ? ecPublishingWhitePngSrc : ecPublishingBlackPngSrc;
      }
      
      link.click();
      return;
    }

    if (activeGroup.id === "qr") {
      const link = document.createElement('a');
      link.download = `eyes-closed-qr-code.${activeSize.id}`;
      if (activeSize.id === 'pdf') link.href = qrCodePdfSrc;
      if (activeSize.id === 'svg') link.href = qrCodeSvgSrc;
      if (activeSize.id === 'png') link.href = qrCodePngSrc;
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

      const availableWidth = canvas.width - (activeSize.padding * 2);
      const availableHeight = canvas.height - (activeSize.padding * 2);
      
      const imgRatio = nativeWidth / nativeHeight;
      const availableRatio = availableWidth / availableHeight;

      let drawWidth, drawHeight;

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

      const link = document.createElement('a');
      link.download = `eyes-closed-${activeGroup.id}-${activeSize.id}-${activeTheme.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setIsExporting(false);
    };
    
    img.onerror = () => {
      setIsExporting(false);
      alert("Failed to load SVG asset for export.");
    };
  };

  const previewWidth = 400;
  const previewHeight = activeSize.height < activeSize.width 
    ? 400 * (activeSize.height / activeSize.width) 
    : 400;
    
  const paddingPercentage = (activeSize.padding / activeSize.width) * 100;

  return (
    <div className="min-h-screen bg-[#080a09] px-5 py-20 text-cream selection:bg-clay/30 selection:text-cream sm:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-screen-2xl">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-clay">
              Utility
            </span>
            <h1 className="mt-4 font-serif text-4xl italic text-cream md:text-5xl">
              Brand Export Kit
            </h1>
          </div>
          
          <button 
            onClick={handleDownloadAll}
            disabled={isZipping}
            className="flex items-center justify-center gap-3 bg-cream text-charcoal px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-clay hover:text-cream transition-colors shadow-xl disabled:opacity-50"
          >
            {isZipping ? (
              <>
                <div className="w-4 h-4 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
                Packaging Zip...
              </>
            ) : (
              <>
                <Download size={16} />
                Download Entire Kit (ZIP)
              </>
            )}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="flex flex-col gap-4">
            {EXPORT_GROUPS.map((group) => {
              const isGroupActive = activeGroupId === group.id;
              
              return (
                <section key={group.id} className={`rounded-xl border transition-all ${isGroupActive ? 'border-clay/40 bg-clay/5' : 'border-cream/5 bg-transparent'}`}>
                  <button 
                    className="w-full p-4 border-b border-cream/5 text-left cursor-pointer hover:bg-cream/5 transition-colors rounded-t-xl"
                    onClick={() => {
                      setActiveGroupId(group.id);
                      setActiveSizeId(group.sizes[0].id);
                      setActiveThemeId(group.themes[0].id);
                    }}
                  >
                    <h2 className={`text-sm font-bold uppercase tracking-wide flex items-center gap-2 ${isGroupActive ? 'text-clay' : 'text-cream/70'}`}>
                      {group.name}
                    </h2>
                  </button>

                  <div className={`p-4 flex flex-col gap-5 ${isGroupActive ? 'block' : 'hidden'}`}>
                    
                    {group.sizes.length > 1 && (
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mb-3 block">Select Size</span>
                        <div className="flex flex-col gap-2">
                          {group.sizes.map(size => (
                            <button 
                              key={size.id}
                              onClick={() => { setActiveSizeId(size.id); }}
                              className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${activeSizeId === size.id ? 'border-clay/50 bg-clay/10 text-cream' : 'border-cream/10 bg-black/40 text-cream/60 hover:bg-cream/5'}`}
                            >
                              <span className="text-sm font-medium">{size.name}</span>
                              {activeSizeId === size.id && <Check size={14} className="text-clay" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mb-3 block">Select Variation</span>
                      <div className="flex flex-col gap-2">
                        {group.themes.map(theme => (
                          <button 
                            key={theme.id}
                            onClick={() => { setActiveThemeId(theme.id); }}
                            className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${activeThemeId === theme.id ? 'border-clay/50 bg-clay/10 text-cream' : 'border-cream/10 bg-black/40 text-cream/60 hover:bg-cream/5'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border border-cream/20 relative overflow-hidden" style={{ backgroundColor: theme.bgColor === 'transparent' ? '#222' : theme.bgColor }}>
                                {theme.bgColor === 'transparent' && (
                                  <div className="absolute inset-0 opacity-20 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv27PkPU4xVA1GCS0pKYDRR8AAAd3cI2uGg+8AAAAAASUVORK5CYII=')]" />
                                )}
                              </div>
                              <span className="text-sm font-medium">{theme.name}</span>
                            </div>
                            {activeThemeId === theme.id && <Check size={14} className="text-clay" />}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </section>
              );
            })}
          </div>

          <div className="lg:col-span-2 flex flex-col items-center justify-center bg-[#111412] border border-cream/5 rounded-[2rem] p-10 relative min-h-[600px] h-fit">
            <div className="text-center mb-10 w-full">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40 block mb-2">Export Configuration</span>
              <h3 className="text-xl font-serif italic text-cream">{activeGroup.name}</h3>
              <p className="text-sm text-cream/50 mt-1">{activeTheme.name} • {activeSize.width} × {activeSize.height}px</p>
            </div>
            
            <div 
              className="relative flex items-center justify-center border border-cream/10 rounded-lg shadow-2xl transition-all duration-300"
              style={{ 
                width: previewWidth, 
                height: previewHeight,
                backgroundColor: activeTheme.bgColor === 'transparent' ? 'transparent' : activeTheme.bgColor,
                backgroundImage: activeTheme.bgColor === 'transparent' ? "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv27PkPU4xVA1GCS0pKYDRR8AAAd3cI2uGg+8AAAAAASUVORK5CYII=')" : 'none'
              }}
            >
               <img 
                 src={activeTheme.logo} 
                 className="w-full h-full object-contain pointer-events-none" 
                 style={{ padding: `${paddingPercentage}%` }} 
                 alt="Preview"
               />
               
               {activeSize.safeZoneType === 'circle' && (
                 <div className="absolute inset-0 rounded-full border border-dashed border-red-500 pointer-events-none opacity-40" />
               )}
            </div>

            <button 
              onClick={handleDownload}
              disabled={isExporting}
              className="mt-14 inline-flex items-center gap-3 bg-clay text-charcoal px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-cream transition-colors shadow-lg shadow-clay/20 cursor-pointer disabled:opacity-50"
            >
              <Download size={18} />
              {isExporting ? 'Exporting...' : activeGroup.id === "qr" ? activeSize.name : `Export ${activeSize.width} × ${activeSize.height}`}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
