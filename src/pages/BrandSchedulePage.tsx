import { useMemo, useState } from "react";

import { BrandShell } from "@/components/app-sidebar";
import { BrandPageBody, BrandPageHeader } from "@/components/BrandPageHeader";
import {
  LAUNCH_DAY_SCRIPT,
  SCHEDULE_CHANNELS,
  SCHEDULE_LISTS,
  SCHEDULE_OWNERS,
  SCHEDULE_PHASES,
  currentPhaseId,
  filterScheduleWork,
  findScheduleWork,
  ownerById,
  scheduleDeskHref,
  scheduleFiltersFromSearch,
  statusLabel,
  summarizeSchedule,
  workInCell,
  workInChannelCell,
  workInListCell,
  workLaneLabel,
  type ScheduleChannel,
  type ScheduleFilters,
  type ScheduleList,
  type ScheduleOwner,
  type SchedulePhase,
  type SchedulePhaseId,
  type ScheduleStatus,
  type ScheduleWindowId,
  type ScheduleWork,
} from "@/data/launchCommsSchedule";
import { tickLaunchCountdown } from "@/lib/launchCountdown";

const TAB_CLASS =
  "inline-flex h-11 items-center rounded-full border px-3.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors";

function setFiltersInUrl(filters: ScheduleFilters) {
  window.history.replaceState({}, "", scheduleDeskHref(filters));
}

export default function BrandSchedulePage() {
  const [filters, setFilters] = useState<ScheduleFilters>(() =>
    scheduleFiltersFromSearch(window.location.search),
  );
  const tick = useMemo(() => tickLaunchCountdown(), []);
  const here = useMemo(() => currentPhaseId(), []);

  const visible = useMemo(
    () => filterScheduleWork(filters),
    [filters],
  );
  const summary = useMemo(() => summarizeSchedule(), []);
  const selected = findScheduleWork(filters.item);
  const owners =
    filters.who === "all"
      ? SCHEDULE_OWNERS
      : SCHEDULE_OWNERS.filter((owner) => owner.id === filters.who);

  function update(next: Partial<ScheduleFilters>) {
    setFilters((current) => {
      const merged: ScheduleFilters = { ...current, ...next };
      setFiltersInUrl(merged);
      return merged;
    });
  }

  function selectItem(item: ScheduleWork) {
    update({
      item: filters.item === item.id ? null : item.id,
    });
  }

  function selectPhase(phase: SchedulePhaseId) {
    update({
      phase: filters.phase === phase ? "all" : phase,
      window: "all",
    });
  }

  function boardForView() {
    const shared = {
      items: visible,
      phaseFilter: filters.phase,
      windowFilter: filters.window,
      here,
      selectedId: selected?.id ?? null,
      onSelectItem: selectItem,
      onSelectPhase: selectPhase,
    };

    switch (filters.view) {
      case "people":
        return <PeopleBoard owners={owners} {...shared} />;
      case "channels":
        return <ChannelBoard {...shared} />;
      case "lists":
        return <ListBoard {...shared} />;
      default: {
        const _never: never = filters.view;
        return _never;
      }
    }
  }

  return (
    <BrandShell activeId="schedule" crumb="Schedule">
      <BrandPageBody>
        <div className="flex flex-col gap-6 md:gap-8">
          <BrandPageHeader
            title="Schedule"
            description="Who is doing what, on which channel, and which list it goes to."
            actions={
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/45">
                {tick.days === 0
                  ? "Launch day"
                  : `${tick.days} day${tick.days === 1 ? "" : "s"} to Sep 1`}
              </p>
            }
          />

          <p className="border-b border-cream/12 pb-3 font-sans text-sm text-cream/55">
            {summary.next} this week, {summary.blocked} waiting on a decision,
            {` ${summary.total} pieces on the runway.`}
          </p>

          <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-start xl:gap-x-8 xl:gap-y-3">
            <FilterRow
              label="See"
              items={[
                { id: "people", label: "By person" },
                { id: "channels", label: "By channel" },
                { id: "lists", label: "By list" },
              ]}
              active={filters.view}
              onSelect={(view) => update({ view })}
            />
            <FilterRow
              label="Who"
              items={[
                { id: "all", label: "Everyone" },
                ...SCHEDULE_OWNERS.map((owner) => ({
                  id: owner.id,
                  label: owner.name,
                  count: summary.byOwner[owner.id],
                })),
              ]}
              active={filters.who}
              onSelect={(who) => update({ who })}
            />
            <FilterRow
              label="When"
              items={[
                { id: "all", label: "Full runway" },
                { id: "now", label: "Before" },
                { id: "day", label: "Launch day" },
                { id: "after", label: "After" },
              ]}
              active={filters.window}
              onSelect={(window) =>
                update({ window, phase: "all" })
              }
            />
          </div>

          <PhaseRail
            active={filters.phase}
            window={filters.window}
            here={here}
            onSelect={selectPhase}
          />

          <div className="lg:hidden">
            <MobileTimeline
              items={visible}
              selectedId={selected?.id ?? null}
              onSelect={selectItem}
            />
          </div>

          <div className="hidden lg:block">{boardForView()}</div>

          {selected ? <WorkDetail item={selected} /> : null}

          {filters.window === "day" || filters.phase === "day" ? (
            <LaunchDayScript />
          ) : null}

          {filters.view === "channels" ? (
            <LaneJobs
              heading="What each channel is for"
              note="Email, LinkedIn, and Instagram are the channels. Lists are who the email goes to."
              rows={SCHEDULE_CHANNELS}
              phase={filters.phase}
              window={filters.window}
            />
          ) : null}

          {filters.view === "lists" ? (
            <LaneJobs
              heading="What each list is for"
              note="Book waitlist, Stay Close, and advance listen are distribution lists, not channels."
              rows={SCHEDULE_LISTS}
              phase={filters.phase}
              window={filters.window}
            />
          ) : null}
        </div>
      </BrandPageBody>
    </BrandShell>
  );
}

function FilterRow<T extends string>({
  label,
  items,
  active,
  onSelect,
}: {
  label: string;
  items: Array<{ id: T; label: string; count?: number }>;
  active: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-12 shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-cream/35">
        {label}
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {items.map((item) => {
          const on = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(item.id)}
              className={[
                TAB_CLASS,
                on
                  ? "border-cream/30 bg-cream/[0.06] text-cream"
                  : "border-cream/12 text-cream/60 hover:border-cream/25 hover:text-cream",
              ].join(" ")}
            >
              {item.label}
              {item.count != null ? (
                <span className="ml-2 text-cream/40">{item.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PhaseRail({
  active,
  window,
  here,
  onSelect,
}: {
  active: SchedulePhaseId | "all";
  window: ScheduleWindowId | "all";
  here: SchedulePhaseId | null;
  onSelect: (phase: SchedulePhaseId) => void;
}) {
  return (
    <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-cream/12 bg-cream/12 sm:grid-cols-3 lg:grid-cols-6">
      {SCHEDULE_PHASES.map((phase) => {
        const lit =
          (active === "all" || active === phase.id) &&
          (window === "all" || window === phase.window);
        const isDay = phase.id === "day";
        const isHere = here === phase.id;
        return (
          <li key={phase.id} className="bg-[#080a09]">
            <button
              type="button"
              onClick={() => onSelect(phase.id)}
              aria-pressed={active === phase.id}
              className={[
                "flex h-full w-full flex-col items-start px-3 py-3 text-left transition-opacity",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#9fb5aa]",
                lit ? "opacity-100" : "opacity-40",
                isDay ? "bg-cream/[0.04]" : "",
              ].join(" ")}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/45">
                  {phase.when}
                </span>
                {isHere ? (
                  <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-clay">
                    Now
                  </span>
                ) : null}
              </span>
              <span className="mt-1.5 font-serif text-[1.05rem] italic leading-none tracking-[-0.02em] text-cream">
                {phase.title}
              </span>
              <span className="mt-1.5 text-[11px] leading-snug text-cream/45">
                {phase.job}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function PeopleBoard({
  owners,
  items,
  phaseFilter,
  windowFilter,
  here,
  selectedId,
  onSelectItem,
  onSelectPhase,
}: {
  owners: readonly ScheduleOwner[];
  items: readonly ScheduleWork[];
  phaseFilter: SchedulePhaseId | "all";
  windowFilter: ScheduleWindowId | "all";
  here: SchedulePhaseId | null;
  selectedId: string | null;
  onSelectItem: (item: ScheduleWork) => void;
  onSelectPhase: (phase: SchedulePhaseId) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[64rem] border-collapse text-left">
        <caption className="sr-only">
          Communication work by person and date
        </caption>
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-20 w-[8.5rem] bg-[#080a09] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
              Who
            </th>
            {SCHEDULE_PHASES.map((phase) => (
              <PhaseHead
                key={phase.id}
                phase={phase}
                lit={columnLit(phase, phaseFilter, windowFilter)}
                here={here === phase.id}
                onSelect={() => onSelectPhase(phase.id)}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.id} className="align-top">
              <th className="sticky left-0 z-10 bg-[#080a09] py-3 pr-4">
                <span className="block font-sans text-[13px] text-cream">
                  {owner.name}
                </span>
                <span className="mt-0.5 block text-[11px] font-normal leading-snug text-cream/40">
                  {owner.role}
                </span>
              </th>
              {SCHEDULE_PHASES.map((phase) => {
                const cell = workInCell(items, owner.id, phase.id);
                return (
                  <td
                    key={phase.id}
                    className={[
                      "border-t border-cream/10 py-3 pr-3",
                      columnLit(phase, phaseFilter, windowFilter)
                        ? ""
                        : "opacity-35",
                      phase.id === "day" ? "bg-cream/[0.03]" : "",
                    ].join(" ")}
                  >
                    <ChipList
                      items={cell}
                      selectedId={selectedId}
                      onSelect={onSelectItem}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChannelBoard({
  items,
  phaseFilter,
  windowFilter,
  here,
  selectedId,
  onSelectItem,
  onSelectPhase,
}: {
  items: readonly ScheduleWork[];
  phaseFilter: SchedulePhaseId | "all";
  windowFilter: ScheduleWindowId | "all";
  here: SchedulePhaseId | null;
  selectedId: string | null;
  onSelectItem: (item: ScheduleWork) => void;
  onSelectPhase: (phase: SchedulePhaseId) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[64rem] border-collapse text-left">
        <caption className="sr-only">
          Communication work by channel and date
        </caption>
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-20 w-[9.5rem] bg-[#080a09] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
              Channel
            </th>
            {SCHEDULE_PHASES.map((phase) => (
              <PhaseHead
                key={phase.id}
                phase={phase}
                lit={columnLit(phase, phaseFilter, windowFilter)}
                here={here === phase.id}
                onSelect={() => onSelectPhase(phase.id)}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {SCHEDULE_CHANNELS.map((channel) => (
            <tr key={channel.id} className="align-top">
              <th className="sticky left-0 z-10 bg-[#080a09] py-3 pr-4">
                <span className="block font-sans text-[13px] text-cream">
                  {channel.title}
                </span>
                <span className="mt-0.5 block text-[11px] font-normal leading-snug text-cream/40">
                  {channel.job}
                </span>
              </th>
              {SCHEDULE_PHASES.map((phase) => {
                const cell = workInChannelCell(items, channel.id, phase.id);
                return (
                  <td
                    key={phase.id}
                    className={[
                      "border-t border-cream/10 py-3 pr-3",
                      columnLit(phase, phaseFilter, windowFilter)
                        ? ""
                        : "opacity-35",
                      phase.id === "day" ? "bg-cream/[0.03]" : "",
                    ].join(" ")}
                  >
                    <ChipList
                      items={cell}
                      selectedId={selectedId}
                      showOwner
                      onSelect={onSelectItem}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListBoard({
  items,
  phaseFilter,
  windowFilter,
  here,
  selectedId,
  onSelectItem,
  onSelectPhase,
}: {
  items: readonly ScheduleWork[];
  phaseFilter: SchedulePhaseId | "all";
  windowFilter: ScheduleWindowId | "all";
  here: SchedulePhaseId | null;
  selectedId: string | null;
  onSelectItem: (item: ScheduleWork) => void;
  onSelectPhase: (phase: SchedulePhaseId) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[64rem] border-collapse text-left">
        <caption className="sr-only">
          Email work by distribution list and date
        </caption>
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-20 w-[9.5rem] bg-[#080a09] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
              List
            </th>
            {SCHEDULE_PHASES.map((phase) => (
              <PhaseHead
                key={phase.id}
                phase={phase}
                lit={columnLit(phase, phaseFilter, windowFilter)}
                here={here === phase.id}
                onSelect={() => onSelectPhase(phase.id)}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {SCHEDULE_LISTS.map((list) => (
            <tr key={list.id} className="align-top">
              <th className="sticky left-0 z-10 bg-[#080a09] py-3 pr-4">
                <span className="block font-sans text-[13px] text-cream">
                  {list.title}
                </span>
                <span className="mt-0.5 block text-[11px] font-normal leading-snug text-cream/40">
                  {list.job}
                </span>
              </th>
              {SCHEDULE_PHASES.map((phase) => {
                const cell = workInListCell(items, list.id, phase.id);
                return (
                  <td
                    key={phase.id}
                    className={[
                      "border-t border-cream/10 py-3 pr-3",
                      columnLit(phase, phaseFilter, windowFilter)
                        ? ""
                        : "opacity-35",
                      phase.id === "day" ? "bg-cream/[0.03]" : "",
                    ].join(" ")}
                  >
                    <ChipList
                      items={cell}
                      selectedId={selectedId}
                      showOwner
                      onSelect={onSelectItem}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PhaseHead({
  phase,
  lit,
  here,
  onSelect,
}: {
  phase: SchedulePhase;
  lit: boolean;
  here: boolean;
  onSelect: () => void;
}) {
  return (
    <th
      className={[
        "sticky top-0 z-10 bg-[#080a09]",
        lit ? "opacity-100" : "opacity-35",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onSelect}
        className="w-full py-2 pr-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]"
      >
        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
          {phase.when}
          {here ? " · now" : ""}
        </span>
      </button>
    </th>
  );
}

function ChipList({
  items,
  selectedId,
  showOwner = false,
  onSelect,
}: {
  items: readonly ScheduleWork[];
  selectedId: string | null;
  showOwner?: boolean;
  onSelect: (item: ScheduleWork) => void;
}) {
  if (items.length === 0) {
    return <span className="text-[12px] text-cream/18">—</span>;
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item.id}>
          <WorkChip
            item={item}
            selected={item.id === selectedId}
            showOwner={showOwner}
            onSelect={() => onSelect(item)}
          />
        </li>
      ))}
    </ul>
  );
}

function WorkChip({
  item,
  selected,
  showOwner,
  onSelect,
}: {
  item: ScheduleWork;
  selected: boolean;
  showOwner?: boolean;
  onSelect: () => void;
}) {
  const owner = ownerById(item.owner);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={[
        "block w-full rounded-sm border-l-2 px-2 py-1.5 text-left transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]",
        statusBorder(item.status),
        selected
          ? "bg-cream/[0.08] text-cream"
          : "text-cream/80 hover:bg-cream/[0.04] hover:text-cream",
      ].join(" ")}
    >
      <span className="block text-[12px] leading-snug">{item.title}</span>
      <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
        {showOwner ? `${owner.name} · ` : ""}
        {workLaneLabel(item)}
      </span>
    </button>
  );
}

function MobileTimeline({
  items,
  selectedId,
  onSelect,
}: {
  items: readonly ScheduleWork[];
  selectedId: string | null;
  onSelect: (item: ScheduleWork) => void;
}) {
  return (
    <ol className="flex flex-col gap-7">
      {SCHEDULE_PHASES.map((phase) => {
        const row = items.filter((item) => item.phase === phase.id);
        if (row.length === 0) return null;
        return (
          <li key={phase.id}>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
              {phase.when}
            </p>
            <h2 className="mt-1 font-serif text-[1.35rem] italic leading-tight tracking-[-0.02em] text-cream">
              {phase.title}
            </h2>
            <p className="mt-1 text-[12px] text-cream/45">{phase.job}</p>
            <ul className="mt-4 divide-y divide-cream/10 border-y border-cream/12">
              {row.map((item) => {
                const owner = ownerById(item.owner);
                const selected = item.id === selectedId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      aria-current={selected ? "true" : undefined}
                      className={[
                        "flex w-full min-h-11 items-baseline justify-between gap-4 py-3.5 text-left",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9fb5aa]",
                        selected ? "text-cream" : "text-cream/80 hover:text-cream",
                      ].join(" ")}
                    >
                      <span className="min-w-0">
                        <span className="block text-[13px] tracking-wide">
                          {item.title}
                        </span>
                        <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
                          {workLaneLabel(item)} · {item.when}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-[11px] leading-snug text-cream/45">
                        {owner.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

function WorkDetail({ item }: { item: ScheduleWork }) {
  const owner = ownerById(item.owner);
  const phase = SCHEDULE_PHASES.find((entry) => entry.id === item.phase);
  const lane = workLaneLabel(item);

  return (
    <article
      className="scroll-mt-24 border-t border-cream/12 pt-7"
      aria-labelledby="schedule-item-heading"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9fb5aa]/70">
        {item.when} · {owner.name}
        {lane ? ` · ${lane}` : ""} · {statusLabel(item.status)}
      </p>
      <h2
        id="schedule-item-heading"
        className="mt-2 font-serif text-[1.75rem] italic leading-tight tracking-[-0.02em] text-cream"
      >
        {item.title}
      </h2>
      <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-cream/80">
        {item.work}
      </p>
      <p className="mt-3 max-w-[62ch] text-[0.8125rem] leading-relaxed text-cream/50">
        {item.purpose}
      </p>
      {phase ? (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/35">
          {phase.title} · {phase.job}
        </p>
      ) : null}
    </article>
  );
}

function LaunchDayScript() {
  return (
    <section aria-labelledby="launch-day-script-heading">
      <h2
        id="launch-day-script-heading"
        className="font-serif text-[1.35rem] italic leading-tight tracking-[-0.02em] text-cream"
      >
        September 1 order
      </h2>
      <div className="mt-4 grid gap-6 border-t border-cream/12 pt-5 md:grid-cols-3">
        <ScriptColumn title="Morning" lines={LAUNCH_DAY_SCRIPT.morning} />
        <ScriptColumn title="Day" lines={LAUNCH_DAY_SCRIPT.day} />
        <ScriptColumn title="Do not" lines={LAUNCH_DAY_SCRIPT.skip} muted />
      </div>
    </section>
  );
}

function ScriptColumn({
  title,
  lines,
  muted = false,
}: {
  title: string;
  lines: readonly string[];
  muted?: boolean;
}) {
  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
        {title}
      </h3>
      <ul className="mt-3 flex flex-col gap-2">
        {lines.map((line) => (
          <li
            key={line}
            className={[
              "text-[13px] leading-snug",
              muted ? "text-cream/45" : "text-cream/80",
            ].join(" ")}
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LaneJobs({
  heading,
  note,
  rows,
  phase,
  window,
}: {
  heading: string;
  note: string;
  rows: readonly ScheduleChannel[] | readonly ScheduleList[];
  phase: SchedulePhaseId | "all";
  window: ScheduleWindowId | "all";
}) {
  const focus: ScheduleWindowId | "all" =
    phase === "all" ? window : phaseToWindow(phase);

  return (
    <section aria-labelledby="lane-jobs-heading">
      <h2
        id="lane-jobs-heading"
        className="font-serif text-[1.35rem] italic leading-tight tracking-[-0.02em] text-cream"
      >
        {heading}
      </h2>
      <p className="mt-2 max-w-[54ch] text-[0.8125rem] leading-relaxed text-cream/50">
        {note}
      </p>
      <ul className="mt-5 divide-y divide-cream/10 border-y border-cream/12">
        {rows.map((row) => (
          <LaneJobRow key={row.id} row={row} focus={focus} />
        ))}
      </ul>
    </section>
  );
}

function LaneJobRow({
  row,
  focus,
}: {
  row: ScheduleChannel | ScheduleList;
  focus: ScheduleWindowId | "all";
}) {
  const slots: Array<{ id: ScheduleWindowId; label: string; text: string }> = [
    { id: "now", label: "Before", text: row.before },
    { id: "day", label: "Sep 1", text: row.day },
    { id: "after", label: "After", text: row.after },
  ];

  return (
    <li className="grid gap-3 py-4 md:grid-cols-[9.5rem_1fr] md:items-start">
      <div>
        <p className="text-[13px] text-cream">{row.title}</p>
        <p className="mt-0.5 text-[11px] text-cream/40">{row.job}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {slots.map((slot) => {
          const lit = focus === "all" || focus === slot.id;
          return (
            <p
              key={slot.id}
              className={lit ? "opacity-100" : "opacity-35"}
            >
              <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-cream/35">
                {slot.label}
              </span>
              <span className="mt-1 block text-[12px] leading-snug text-cream/75">
                {slot.text}
              </span>
            </p>
          );
        })}
      </div>
    </li>
  );
}

function columnLit(
  phase: SchedulePhase,
  phaseFilter: SchedulePhaseId | "all",
  windowFilter: ScheduleWindowId | "all",
): boolean {
  const phaseOk = phaseFilter === "all" || phaseFilter === phase.id;
  const windowOk = windowFilter === "all" || windowFilter === phase.window;
  return phaseOk && windowOk;
}

function phaseToWindow(phase: SchedulePhaseId): ScheduleWindowId {
  return SCHEDULE_PHASES.find((entry) => entry.id === phase)?.window ?? "now";
}

function statusBorder(status: ScheduleStatus): string {
  switch (status) {
    case "blocked":
      return "border-clay";
    case "next":
      return "border-cream/70";
    case "later":
      return "border-cream/20";
    default: {
      const _never: never = status;
      return _never;
    }
  }
}
