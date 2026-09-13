import {
  CONTINUITY_DESK_TOPICS,
  CONTINUITY_MAP_GROUPS,
  type ContinuityDeskId,
  type ContinuityMapGroupId,
  type ContinuitySearchHit,
} from '@/data/continuityHome';

const GROUP_ORDER: ContinuityMapGroupId[] = [
  'orient',
  'presence',
  'work',
  'keep',
  'access',
  'stewards',
];

export function ContinuityDeskNav({
  activeId,
  onSelect,
  hits,
  query,
}: {
  activeId: ContinuityDeskId;
  onSelect: (id: ContinuityDeskId) => void;
  hits: ContinuitySearchHit[];
  query: string;
}) {
  const searching = query.trim().length > 0;
  const visibleIds = new Set(
    searching ? hits.map((hit) => hit.topicId) : CONTINUITY_DESK_TOPICS.map((topic) => topic.id),
  );

  return (
    <nav aria-label="Continuity rooms">
      {searching ? (
        <div>
          <p className="font-sans text-xs text-cream/45">Matches</p>
          {hits.length === 0 ? (
            <p className="mt-3 font-sans text-sm leading-relaxed text-cream/65">
              Nothing matches. Try domain, GitHub, logos, or Sonika.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col">
              {hits.map((hit) => (
                <li key={`${hit.topicId}-${hit.label}`}>
                  <button
                    type="button"
                    onClick={() => onSelect(hit.topicId)}
                    className="flex min-h-11 w-full cursor-pointer flex-col items-start gap-1 py-3 text-left transition-colors duration-200 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
                  >
                    <span className="font-sans text-sm text-cream">{hit.label}</span>
                    <span className="line-clamp-2 font-sans text-xs leading-relaxed text-cream/50">
                      {hit.reason}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <ol className="flex flex-col gap-8">
          {GROUP_ORDER.map((groupId) => {
            const group = CONTINUITY_MAP_GROUPS[groupId];
            const topics = CONTINUITY_DESK_TOPICS.filter(
              (topic) => topic.group === groupId && visibleIds.has(topic.id),
            );
            if (topics.length === 0) return null;
            return (
              <li key={groupId}>
                <p className="font-sans text-xs text-cream/45">
                  {group.label}
                </p>
                <ul className="mt-2">
                  {topics.map((topic) => {
                    const active = topic.id === activeId;
                    return (
                      <li key={topic.id}>
                        <a
                          href={topic.href}
                          aria-current={active ? 'page' : undefined}
                          onClick={(event) => {
                            event.preventDefault();
                            onSelect(topic.id);
                          }}
                          className={`flex min-h-11 cursor-pointer items-center border-l px-3 font-sans text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80 ${
                            active
                              ? 'border-cream text-cream'
                              : 'border-transparent text-cream/60 hover:border-cream/30 hover:text-cream'
                          }`}
                        >
                          {topic.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
