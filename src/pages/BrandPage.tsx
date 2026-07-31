import { BrandShell } from "@/components/app-sidebar";
import { ShaderBackdrop } from "@/components/shader/ShaderBackdrop";

export default function BrandPage() {
  return (
    <BrandShell activeId="brand" crumb="Overview" noise={false}>
      <div className="relative h-full min-h-[calc(100dvh-2.5rem)] overflow-hidden">
        <ShaderBackdrop theme="forest" position="absolute" overlay={false} />
        <h1 className="sr-only">Brand Toolkit</h1>
      </div>
    </BrandShell>
  );
}
