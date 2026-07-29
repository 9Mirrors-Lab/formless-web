import { BrandShell } from "@/components/app-sidebar";

export default function BrandPage() {
  return (
    <BrandShell activeId="brand" crumb="Overview">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9fb5aa]">
          Brand
        </p>
        <h1 className="mt-4 font-serif text-4xl italic text-cream md:text-5xl">
          Content coming soon
        </h1>
      </div>
    </BrandShell>
  );
}
