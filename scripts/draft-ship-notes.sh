#!/usr/bin/env bash
# Rebuild draft ship notes from commits since the last published tag.
# Used by .github/workflows/draft-ship-notes.yml and runnable locally.
set -euo pipefail

DRAFT_TAG="${DRAFT_RELEASE_TAG:-draft-ship-notes}"
DRAFT_TITLE="${DRAFT_RELEASE_TITLE:-Draft ship notes}"
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

LAST_TAG="$(git describe --tags --abbrev=0 --match '20*' 2>/dev/null || true)"
if [[ -n "$LAST_TAG" ]]; then
  RANGE="${LAST_TAG}..HEAD"
  RANGE_LABEL="since ${LAST_TAG}"
else
  RANGE="HEAD~50..HEAD"
  if ! git rev-parse --verify HEAD~50 >/dev/null 2>&1; then
    RANGE="HEAD"
  fi
  RANGE_LABEL="recent commits (no published 20* tags yet)"
fi

COMMITS="$(git log "$RANGE" --pretty='- %s' --no-merges 2>/dev/null || true)"
if [[ -z "$COMMITS" ]]; then
  COMMITS="- (no commits yet ${RANGE_LABEL})"
fi

BODY="$(cat <<EOF
## Draft ship notes

Auto-built from \`main\` ${RANGE_LABEL}.
Publish this when a milestone or coherent batch lands.
Rename the tag to something like \`2026.09-print-live\` and give it a plain title.

### Commits

${COMMITS}

---
_Updated by scripts/draft-ship-notes.sh_
EOF
)"

if gh release view "$DRAFT_TAG" >/dev/null 2>&1; then
  gh release edit "$DRAFT_TAG" \
    --draft \
    --title "$DRAFT_TITLE" \
    --notes "$BODY"
  echo "Updated draft release: ${DRAFT_TAG}"
else
  gh release create "$DRAFT_TAG" \
    --draft \
    --target main \
    --title "$DRAFT_TITLE" \
    --notes "$BODY"
  echo "Created draft release: ${DRAFT_TAG}"
fi
