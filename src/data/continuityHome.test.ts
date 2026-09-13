import { describe, expect, it } from 'vitest';

import {
  CONTINUITY_ASSETS,
  CONTINUITY_CREDENTIALS,
  CONTINUITY_DESK_TOPICS,
  CONTINUITY_MAP_EDGES,
  CONTINUITY_MAP_NODES,
  CONTINUITY_PATH,
  CONTINUITY_RUNNING,
  CONTINUITY_START_HERE,
  CONTINUITY_VERCEL,
  continuityAssetsNeedingConsolidation,
  continuityContainsForbiddenSecrets,
  parseContinuityHash,
  searchContinuityDesk,
} from '@/data/continuityHome';

describe('continuityHome', () => {
  it('keeps the private route off the public path list shape', () => {
    expect(CONTINUITY_PATH).toBe('/continuity');
    expect(CONTINUITY_PATH.startsWith('/brand')).toBe(false);
  });

  it('maps every ecosystem node once', () => {
    const ids = CONTINUITY_MAP_NODES.map((node) => node.id);
    expect(new Set(ids).size).toBe(12);
    expect(ids).toEqual(
      expect.arrayContaining([
        'website',
        'formless',
        'domain',
        'files',
        'accounts',
        'email',
        'payments',
        'social',
        'distribution',
        'infrastructure',
        'people',
        'what-to-do',
      ]),
    );
  });

  it('only connects known nodes', () => {
    const ids = new Set(CONTINUITY_MAP_NODES.map((node) => node.id));
    for (const edge of CONTINUITY_MAP_EDGES) {
      expect(ids.has(edge.from)).toBe(true);
      expect(ids.has(edge.to)).toBe(true);
    }
  });

  it('keeps the Start Here path as five plain steps', () => {
    expect(CONTINUITY_START_HERE.steps).toHaveLength(5);
    expect(CONTINUITY_START_HERE.title).toContain("Ryan isn't available");
  });

  it('never stores secret values in the continuity record', () => {
    expect(continuityContainsForbiddenSecrets()).toBe(false);
    const blob = JSON.stringify({
      credentials: CONTINUITY_CREDENTIALS,
      vercel: CONTINUITY_VERCEL,
    });
    expect(blob).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}/);
    expect(CONTINUITY_VERCEL.environmentVariableNames.every((item) => item.name.length > 0)).toBe(
      true,
    );
  });

  it('treats the desk as rooms plus start-here and how it fits', () => {
    const ids = CONTINUITY_DESK_TOPICS.map((topic) => topic.id);
    expect(ids).toEqual(
      expect.arrayContaining(['start-here', 'picture', 'files', 'infrastructure', 'people']),
    );
    expect(parseContinuityHash('#files')).toBe('files');
    expect(parseContinuityHash('#supabase-home')).toBe('infrastructure');
    expect(parseContinuityHash('#unknown')).toBe('start-here');
  });

  it('finds file collections and people from a desk search', () => {
    const logoHits = searchContinuityDesk('logos');
    expect(logoHits.some((hit) => hit.topicId === 'files')).toBe(true);
    const sonikaHits = searchContinuityDesk('Sonika');
    expect(sonikaHits.some((hit) => hit.topicId === 'people')).toBe(true);
  });

  it('flags split asset locations that need consolidation', () => {
    expect(continuityAssetsNeedingConsolidation().length).toBeGreaterThan(0);
    expect(CONTINUITY_ASSETS.some((asset) => asset.brand === 'Formless')).toBe(true);
    expect(CONTINUITY_ASSETS.some((asset) => asset.brand === 'Eyes Closed')).toBe(true);
  });

  it('marks domain, hosting, and database as critical running services', () => {
    const critical = CONTINUITY_RUNNING.filter((row) => row.importance === 'critical').map(
      (row) => row.service,
    );
    expect(critical).toEqual(expect.arrayContaining(['Domain', 'Vercel', 'Supabase', '1Password']));
  });
});
