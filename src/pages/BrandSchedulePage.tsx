import { useMemo, useState } from "react";

import { BrandShell } from "@/components/app-sidebar";
import { BrandPageBody, BrandPageHeader } from "@/components/BrandPageHeader";
import {
  LAUNCH_DAY_SCRIPT,
  SCHEDULE_CHANNELS,
  SCHEDULE_LISTS,
  SCHEDULE_OWNERS,
  SCHEDULE_PHASES,
  SCHEDULE_WINDOWS,
  currentPhaseId,
  filterScheduleWork,
  findScheduleWork,
  ownerById,
  phasesForWindow,
  scheduleDeskHref,
  scheduleFiltersFromSearch,
  statusLabel,
  summarizeSchedule,
  workInCell,
  workInChannelCell,
  workInListCell,
  workLaneLabel,
  workListTitles,
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

  function selectWindow(window: ScheduleWindowId) {
    update({
      window: filters.window === window ? "all" : window,
      phase: "all",
    });
  }

  const boardProps = {
    phaseFilter: filters.phase,
    windowFilter: filters.window,
    here,
    selectedId: selected?.id ?? null,
    onSelectItem: selectItem,
    onSelectPhase: selectPhase,
    onSelectWindow: selectWindow,
  };

  return (
    <BrandShell activeId="schedule" crumb="Schedule">
      <BrandPageBody>
        <div className="flex flex-col gap-6 md:gap-8">
          <BrandPageHeader
            tone="desk"
            title="Schedule"
            description="Time is the spine. Before, launch day, and after are the three blocks. Lanes sit underneath."
            actions={<CountdownMark tick={tick} />}
          />

          <StatusStrip summary={summary} />

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
              onSelect={(window) => update({ window, phase: "all" })}
            />
          </div>

          <div className="lg:hidden">
            <MobileTimeline
              items={visible}
              selectedId={selected?.id ?? null}
              here={here}
              onSelect={selectItem}
            />
          </div>

          <div className="hidden lg:block">
            {filters.view === "people" ? (
              <ScheduleBoard
                laneLabel="Who"
                caption="Communication work by person and date"
                lanes={owners.map((owner) => ({
                  id: owner.id,
                  title: owner.name,
                  subtitle: owner.role,
                }))}
                cellFor={(laneId, phaseId) =>
                  workInCell(visible, laneId as ScheduleOwner["id"], phaseId)
                }
                {...boardProps}
              />
            ) : null}
            {filters.view === "channels" ? (
              <ScheduleBoard
                laneLabel="Channel"
                caption="Communication work by channel and date"
                lanes={SCHEDULE_CHANNELS.map((channel) => ({
                  id: channel.id,
                  title: channel.title,
                  subtitle: channel.job,
                }))}
                cellFor={(laneId, phaseId) =>
                  workInChannelCell(visible, laneId as ScheduleChannel["id"], phaseId)
                }
                showOwner
                {...boardProps}
              />
            ) : null}
            {filters.view === "lists" ? (
              <ScheduleBoard
                laneLabel="List"
                caption="Email work by distribution list and date"
                lanes={SCHEDULE_LISTS.map((list) => ({
                  id: list.id,
                  title: list.title,
                  subtitle: list.job,
                }))}
                cellFor={(laneId, phaseId) =>
                  workInListCell(visible, laneId as ScheduleList["id"], phaseId)
                }
                showOwner
                {...boardProps}
              />
            ) : null}
          </div>

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

function CountdownMark({
  tick,
}: {
  tick: ReturnType<typeof tickLaunchCountdown>;
}) {
  const runwayDays = 11;
  const elapsed = Math.min(runwayDays, Math.max(0, runwayDays - tick.days));
  const pct = tick.days === 0 ? 100 : Math.round((elapsed / runwayDays) * 100);

  return (
    <div className="flex min-w-[11rem] flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/45">
        {tick.days === 0
          ? "Launch day"
          : `${tick.days} day${tick.days === 1 ? "" : "s"} to Sep 1`}
      </p>
      <div
        className="h-1 overflow-hidden bg-cream/10"
        aria-hidden
      >
        <div
          className="h-full bg-clay"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatusStrip({
  summary,
}: {
  summary: ReturnType<typeof summarizeSchedule>;
}) {
  return (
    <div className="flex flex-col gap-3 border-y border-cream/12 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-sans text-sm text-cream/55">
        {summary.next} this week, {summary.blocked} waiting on a decision,
        {` ${summary.total} pieces on the runway.`}
      </p>
      <ul className="flex flex-wrap gap-4 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
        <li className="flex items-center gap-2">
          <span className="h-3 w-0.5 bg-clay" aria-hidden />
          Needs a decision
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-0.5 bg-cream/70" aria-hidden />
          This week
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-0.5 bg-cream/20" aria-hidden />
          On the calendar
        </li>
      </ul>
    </div>
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

type BoardLane = {
  id: string;
  title: string;
  subtitle: string;
};

function ScheduleBoard({
  laneLabel,
  caption,
  lanes,
  cellFor,
  phaseFilter,
  windowFilter,
  here,
  selectedId,
  showOwner = false,
  onSelectItem,
  onSelectPhase,
  onSelectWindow,
}: {
  laneLabel: string;
  caption: string;
  lanes: readonly BoardLane[];
  cellFor: (laneId: string, phaseId: SchedulePhaseId) => ScheduleWork[];
  phaseFilter: SchedulePhaseId | "all";
  windowFilter: ScheduleWindowId | "all";
  here: SchedulePhaseId | null;
  selectedId: string | null;
  showOwner?: boolean;
  onSelectItem: (item: ScheduleWork) => void;
  onSelectPhase: (phase: SchedulePhaseId) => void;
  onSelectWindow: (window: ScheduleWindowId) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[72rem] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-30 w-[8.75rem] bg-[#080a09] pr-4" />
            {SCHEDULE_WINDOWS.map((group) => {
              const phases = phasesForWindow(group.id);
              const lit = windowFilter === "all" || windowFilter === group.id;
              return (
                <th
                  key={group.id}
                  colSpan={phases.length}
                  className={[
                    "sticky top-0 z-20 px-0 pb-0 pt-0",
                    windowHeadClass(group.id),
                    lit ? "opacity-100" : "opacity-40",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => onSelectWindow(group.id)}
                    aria-pressed={windowFilter === group.id}
                    className="flex w-full flex-col items-start gap-1.5 px-3 pb-2 pt-2.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#9fb5aa]"
                  >
                    <span className="flex w-full items-baseline justify-between gap-3">
                      <span className="font-sans text-[13px] font-semibold tracking-tight text-cream">
                        {group.label}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/40">
                        {group.dates}
                      </span>
                    </span>
                    <span
                      className={[
                        "block h-0.5 w-full",
                        group.id === "day" ? "bg-clay" : "bg-cream/20",
                      ].join(" ")}
                      aria-hidden
                    />
                  </button>
                </th>
              );
            })}
          </tr>
          <tr>
            <th className="sticky left-0 top-[3.25rem] z-30 bg-[#080a09] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
              {laneLabel}
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
          {lanes.map((lane) => (
            <tr key={lane.id} className="align-top">
              <th className="sticky left-0 z-10 border-t border-cream/18 bg-[#080a09] py-4 pr-4">
                <span className="block font-sans text-[13px] font-medium text-cream">
                  {lane.title}
                </span>
                <span className="mt-0.5 block text-[11px] font-normal leading-snug text-cream/40">
                  {lane.subtitle}
                </span>
              </th>
              {SCHEDULE_PHASES.map((phase) => {
                const cell = cellFor(lane.id, phase.id);
                const lit = columnLit(phase, phaseFilter, windowFilter);
                return (
                  <td
                    key={phase.id}
                    className={[
                      "border-t border-cream/18 py-4 pr-3",
                      windowCellClass(phase.window),
                      lit ? "" : "opacity-35",
                    ].join(" ")}
                  >
                    <ChipList
                      items={cell}
                      selectedId={selectedId}
                      showOwner={showOwner}
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
        "sticky top-[3.25rem] z-10 bg-[#080a09]",
        windowHeadClass(phase.window),
        lit ? "opacity-100" : "opacity-35",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={undefined}
        className="w-full px-3 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#9fb5aa]"
      >
        <span className="block font-sans text-[12px] font-medium tracking-tight text-cream">
          {phase.title}
        </span>
        <span className="mt-0.5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
          {phase.when}
          {here ? (
            <span className="text-clay">Now</span>
          ) : null}
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
    return <span className="block min-h-[2.5rem]" />;
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
      <span className="block font-mono text-[8px] uppercase tracking-[0.16em] text-cream/40">
        {item.when}
      </span>
      <span className="mt-0.5 block text-[12px] font-medium leading-snug">
        {item.title}
      </span>
      <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
        {showOwner ? `${owner.name} · ` : ""}
        {workLaneLabel(item)}
      </span>
      <WorkLists item={item} />
    </button>
  );
}

function MobileTimeline({
  items,
  selectedId,
  here,
  onSelect,
}: {
  items: readonly ScheduleWork[];
  selectedId: string | null;
  here: SchedulePhaseId | null;
  onSelect: (item: ScheduleWork) => void;
}) {
  return (
    <ol className="flex flex-col gap-10">
      {SCHEDULE_WINDOWS.map((group) => {
        const phases = phasesForWindow(group.id).filter((phase) =>
          items.some((item) => item.phase === phase.id),
        );
        if (phases.length === 0) return null;
        return (
          <li key={group.id}>
            <div
              className={[
                "mb-5 border-l-2 pl-3",
                group.id === "day" ? "border-clay" : "border-cream/25",
              ].join(" ")}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/40">
                {group.dates}
              </p>
              <h2 className="mt-1 font-sans text-[1.2rem] font-semibold tracking-tight text-cream">
                {group.label}
              </h2>
            </div>
            <ol className="flex flex-col gap-7">
              {phases.map((phase) => {
                const row = items.filter((item) => item.phase === phase.id);
                return (
                  <li key={phase.id}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                      {phase.when}
                      {here === phase.id ? " · now" : ""}
                    </p>
                    <h3 className="mt-1 font-sans text-[1.05rem] font-medium tracking-tight text-cream">
                      {phase.title}
                    </h3>
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
                                selected
                                  ? "text-cream"
                                  : "text-cream/80 hover:text-cream",
                              ].join(" ")}
                            >
                              <span className="min-w-0">
                                <span className="block font-mono text-[8px] uppercase tracking-[0.16em] text-cream/40">
                                  {item.when}
                                </span>
                                <span className="mt-0.5 block text-[13px] font-medium tracking-wide">
                                  {item.title}
                                </span>
                                <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
                                  {workLaneLabel(item)}
                                </span>
                                <WorkLists item={item} />
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
          </li>
        );
      })}
    </ol>
  );
}

function WorkLists({ item }: { item: ScheduleWork }) {
  const lists = workListTitles(item);
  if (lists.length === 0) return null;

  return (
    <ul className="mt-1.5 flex flex-col gap-0.5">
      {lists.map((title) => (
        <li
          key={title}
          className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/35"
        >
          {title}
        </li>
      ))}
    </ul>
  );
}

function WorkDetail({ item }: { item: ScheduleWork }) {
  const owner = ownerById(item.owner);
  const phase = SCHEDULE_PHASES.find((entry) => entry.id === item.phase);
  const lane = workLaneLabel(item);
  const lists = workListTitles(item);
  const window = SCHEDULE_WINDOWS.find((entry) => entry.id === item.window);

  return (
    <article
      className="scroll-mt-24 border-t border-cream/12 pt-7"
      aria-labelledby="schedule-item-heading"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9fb5aa]/70">
        {window?.label} · {item.when} · {owner.name}
        {lane ? ` · ${lane}` : ""} · {statusLabel(item.status)}
      </p>
      <h2
        id="schedule-item-heading"
        className="mt-2 font-sans text-[1.55rem] font-semibold leading-tight tracking-[-0.03em] text-cream"
      >
        {item.title}
      </h2>
      {lists.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-1.5 border-y border-cream/12 py-3">
          {lists.map((title) => (
            <li
              key={title}
              className="border-l-2 border-cream/25 pl-3 text-[13px] leading-snug text-cream/80"
            >
              {title}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-cream/80">
        {item.work}
      </p>
      <p className="mt-3 max-w-[62ch] text-[0.8125rem] leading-relaxed text-cream/50">
        {item.purpose}
      </p>
      {phase ? (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/35">
          {phase.title} · {phase.when} · {phase.job}
        </p>
      ) : null}
    </article>
  );
}

function LaunchDayScript() {
  return (
    <section aria-labelledby="launch-day-script-heading">
      <div className="flex items-baseline justify-between gap-4 border-b border-clay/40 pb-3">
        <h2
          id="launch-day-script-heading"
          className="font-sans text-[1.2rem] font-semibold tracking-tight text-cream"
        >
          September 1 order
        </h2>
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-clay">
          Launch day
        </p>
      </div>
      <div className="mt-5 grid gap-6 md:grid-cols-3">
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
              "border-l border-cream/15 pl-3 text-[13px] leading-snug",
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
        className="font-sans text-[1.2rem] font-semibold tracking-tight text-cream"
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
        <p className="text-[13px] font-medium text-cream">{row.title}</p>
        <p className="mt-0.5 text-[11px] text-cream/40">{row.job}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {slots.map((slot) => {
          const lit = focus === "all" || focus === slot.id;
          return (
            <p
              key={slot.id}
              className={[
                "border-l pl-3",
                slot.id === "day" ? "border-clay/50" : "border-cream/15",
                lit ? "opacity-100" : "opacity-35",
              ].join(" ")}
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

function windowHeadClass(window: ScheduleWindowId): string {
  switch (window) {
    case "now":
      return "bg-[#0b100e]";
    case "day":
      return "bg-[#14110f]";
    case "after":
      return "bg-[#080a09]";
    default: {
      const _never: never = window;
      return _never;
    }
  }
}

function windowCellClass(window: ScheduleWindowId): string {
  switch (window) {
    case "now":
      return "bg-[#0b100e]/80";
    case "day":
      return "border-x border-clay/35 bg-clay/[0.06]";
    case "after":
      return "bg-[#080a09]";
    default: {
      const _never: never = window;
      return _never;
    }
  }
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
