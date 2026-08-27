import { useMemo } from 'react';

import {
  AMAZON_PREORDERS,
  amazonPreorderDailyTotals,
  amazonPreorderTotal,
} from '@/data/amazonPreorders';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CLAY = '#c4a574';

function formatUnits(units: number): string {
  return units.toLocaleString('en-US');
}

export function BrandAmazonPreorders() {
  const total = amazonPreorderTotal();
  const daily = useMemo(() => amazonPreorderDailyTotals(), []);

  return (
    <section
      aria-labelledby="brand-amazon-preorder-heading"
      className="rounded-lg border border-[#c4a574]/22 bg-[#080a09]/62 px-4 py-4 shadow-[inset_0_1px_0_rgba(242,240,233,0.05)] backdrop-blur-[3px] sm:px-5 sm:py-5"
    >
      <header>
        <h2
          id="brand-amazon-preorder-heading"
          className="font-sans text-[15px] font-medium tracking-[-0.01em] text-cream"
        >
          Kindle Pre-orders
        </h2>
        <p className="mt-1 flex items-center gap-2 font-sans text-[11px] text-cream/48">
          <span>
            {daily.length} {daily.length === 1 ? 'day' : 'days'} with orders
          </span>
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: CLAY }}
            aria-hidden
          />
        </p>
      </header>

      <div className="mt-4 flex items-end justify-between gap-4 py-3">
        <div className="min-w-0">
          <p
            className="font-sans text-[2rem] font-medium leading-none tracking-[-0.03em] sm:text-[2.25rem]"
            style={{ color: CLAY }}
          >
            {formatUnits(total)}
          </p>
          <p className="mt-2 font-sans text-[13px] leading-snug text-cream/85">
            Pre-order units
          </p>
        </div>
        <span className="shrink-0 font-sans text-[11px] text-cream/48">total</span>
      </div>

      <Accordion type="single" collapsible className="mt-3 border-t border-cream/10">
        <AccordionItem value="history" className="border-none">
          <AccordionTrigger className="py-3 text-[12px] font-medium text-[#c4a574] hover:no-underline hover:text-[#d4b888] [&>svg]:size-3.5 [&>svg]:text-[#c4a574]">
            Show pre-order history
          </AccordionTrigger>
          <AccordionContent className="pb-1">
            <div className="rounded-md border border-cream/10 bg-black/20">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-cream/10 text-[9px] uppercase tracking-[0.1em] text-cream/40">
                    <th className="px-2 py-2 font-normal">Date</th>
                    <th className="px-2 py-2 text-right font-normal">Units</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.map((day) => {
                    const isLatest = day.orderDate === AMAZON_PREORDERS.asOf;
                    const tone = isLatest ? 'text-[#c4a574]' : 'text-cream/55';
                    return (
                      <tr
                        key={day.orderDate}
                        className="border-t border-cream/8 first:border-t-0"
                      >
                        <td className={`px-2 py-2 font-sans text-[11px] ${tone}`}>
                          {day.label}
                        </td>
                        <td
                          className={`px-2 py-2 text-right font-sans text-[12px] tabular-nums ${tone}`}
                        >
                          {formatUnits(day.units)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-cream/10">
                    <td className="px-2 py-2 font-sans text-[11px] font-medium text-cream/72">
                      Total
                    </td>
                    <td
                      className="px-2 py-2 text-right font-sans text-[12px] font-medium tabular-nums text-[#c4a574]"
                    >
                      {formatUnits(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
