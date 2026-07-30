import { BrandShell } from "@/components/app-sidebar";
import {
  BrandPageBody,
  BrandPageHeader,
} from "@/components/BrandPageHeader";

export default function BrandPage() {
  return (
    <BrandShell activeId="brand" crumb="Overview">
      <BrandPageBody>
        <BrandPageHeader
          eyebrow="Overview"
          title="Content coming soon"
          description="Brand Studio holds internal materials and foundations for Eyes Closed."
        />
      </BrandPageBody>
    </BrandShell>
  );
}
