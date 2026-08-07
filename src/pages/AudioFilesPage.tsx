/**
 * Admin file manager for author session takes.
 * List, download, update status, and delete files from audiobook-takes.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  Download,
  FileAudio,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import {
  SESSION_TAKE_KIND_LABELS,
  SESSION_TAKE_STATUS_LABELS,
  deleteSessionTake,
  downloadSessionTake,
  fetchCurrentUserIsAdmin,
  formatFileBytes,
  listSessionTakes,
  updateSessionTakeStatus,
  type SessionTakeKind,
  type SessionTakeRow,
  type SessionTakeStatus,
} from '@/lib/audiobookSessionTakes';
import {
  AUDIOBOOK_TRACK_SOURCE_LABELS,
  downloadAudiobookTrack,
  listPublishedAudiobookTracks,
  type AudiobookTrack,
} from '@/lib/audiobookTracks';

type GateState = 'loading' | 'signed-out' | 'forbidden' | 'ready' | 'misconfigured';
type StatusFilter = SessionTakeStatus | 'all';
type KindFilter = SessionTakeKind | 'all';

const STATUS_OPTIONS: SessionTakeStatus[] = [
  'received',
  'reviewing',
  'accepted',
  'rejected',
];

const KIND_OPTIONS: SessionTakeKind[] = [
  'initial_calibration',
  'session_calibration',
  'chapter_draft',
];

function statusBadgeClass(status: SessionTakeStatus): string {
  switch (status) {
    case 'received':
      return 'border-cream/20 bg-cream/10 text-cream/80';
    case 'reviewing':
      return 'border-clay/35 bg-clay/15 text-clay';
    case 'accepted':
      return 'border-moss/40 bg-moss/20 text-[#9fb5aa]';
    case 'rejected':
      return 'border-red-400/30 bg-red-500/10 text-red-200/90';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function loginHref(): string {
  const next = `${window.location.pathname}${window.location.search}`;
  return `/login?next=${encodeURIComponent(next)}`;
}

export default function AudioFilesPage() {
  const { status: authStatus, user } = useAuth();
  const [gate, setGate] = useState<GateState>('loading');
  const [takes, setTakes] = useState<SessionTakeRow[]>([]);
  const [tracks, setTracks] = useState<AudiobookTrack[]>([]);
  const [tracksError, setTracksError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');
  const [pendingDelete, setPendingDelete] = useState<SessionTakeRow[] | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  const markBusy = useCallback((ids: string[], busy: boolean) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (busy) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }, []);

  const loadTakes = useCallback(async () => {
    setRefreshing(true);
    setLoadError(null);
    setTracksError(null);

    const [takesResult, tracksResult] = await Promise.all([
      listSessionTakes(),
      listPublishedAudiobookTracks(),
    ]);

    setRefreshing(false);

    if (!takesResult.ok) {
      setLoadError(takesResult.error);
      setTakes([]);
    } else {
      setTakes(takesResult.takes);
      setSelectedIds((prev) => {
        const valid = new Set(takesResult.takes.map((take) => take.id));
        return new Set([...prev].filter((id) => valid.has(id)));
      });
    }

    if (!tracksResult.ok) {
      setTracksError(tracksResult.error);
      setTracks([]);
    } else {
      setTracks(tracksResult.tracks);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function resolveGate() {
      if (authStatus === 'loading') {
        setGate('loading');
        return;
      }
      if (authStatus === 'misconfigured') {
        setGate('misconfigured');
        return;
      }
      if (!user) {
        setGate('signed-out');
        return;
      }

      const isAdmin = await fetchCurrentUserIsAdmin();
      if (cancelled) return;
      if (!isAdmin) {
        setGate('forbidden');
        return;
      }

      setGate('ready');
      await loadTakes();
    }

    void resolveGate();
    return () => {
      cancelled = true;
    };
  }, [authStatus, user, loadTakes]);

  const filteredTakes = useMemo(() => {
    return takes.filter((take) => {
      if (statusFilter !== 'all' && take.status !== statusFilter) return false;
      if (kindFilter !== 'all' && take.take_kind !== kindFilter) return false;
      return true;
    });
  }, [takes, statusFilter, kindFilter]);

  const allFilteredSelected =
    filteredTakes.length > 0 &&
    filteredTakes.every((take) => selectedIds.has(take.id));

  const selectedTakes = useMemo(
    () => takes.filter((take) => selectedIds.has(take.id)),
    [takes, selectedIds],
  );

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const take of filteredTakes) next.delete(take.id);
        return next;
      });
      return;
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const take of filteredTakes) next.add(take.id);
      return next;
    });
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleDownload = async (take: SessionTakeRow) => {
    setActionError(null);
    markBusy([take.id], true);
    const result = await downloadSessionTake(take);
    markBusy([take.id], false);
    if (!result.ok) setActionError(result.error);
  };

  const handleTrackDownload = (track: AudiobookTrack) => {
    setActionError(null);
    markBusy([track.id], true);
    const result = downloadAudiobookTrack(track);
    markBusy([track.id], false);
    if (!result.ok) setActionError(result.error);
  };

  const handleBulkDownload = async () => {
    if (selectedTakes.length === 0) return;
    setActionError(null);
    const ids = selectedTakes.map((take) => take.id);
    markBusy(ids, true);
    for (const take of selectedTakes) {
      const result = await downloadSessionTake(take);
      if (!result.ok) {
        setActionError(result.error);
        break;
      }
    }
    markBusy(ids, false);
  };

  const handleStatusChange = async (
    take: SessionTakeRow,
    status: SessionTakeStatus,
  ) => {
    if (take.status === status) return;
    setActionError(null);
    markBusy([take.id], true);
    const result = await updateSessionTakeStatus(take.id, status);
    markBusy([take.id], false);
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    setTakes((prev) =>
      prev.map((row) => (row.id === take.id ? { ...row, status } : row)),
    );
  };

  const confirmDelete = async () => {
    if (!pendingDelete?.length) return;
    setActionError(null);
    const ids = pendingDelete.map((take) => take.id);
    markBusy(ids, true);
    const failed: string[] = [];
    for (const take of pendingDelete) {
      const result = await deleteSessionTake(take);
      if (!result.ok) failed.push(result.error);
    }
    markBusy(ids, false);
    setPendingDelete(null);
    if (failed.length > 0) {
      setActionError(failed[0] ?? 'Delete failed.');
    }
    await loadTakes();
  };

  if (gate === 'loading') {
    return (
      <Shell>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream/45">
          Checking access…
        </p>
      </Shell>
    );
  }

  if (gate === 'misconfigured') {
    return (
      <Shell>
        <Header />
        <p className="mt-8 max-w-lg text-cream/70">
          Supabase is not configured. Add the project URL and anon key to use
          file management.
        </p>
      </Shell>
    );
  }

  if (gate === 'signed-out') {
    return (
      <Shell>
        <Header />
        <p className="mt-8 max-w-lg text-cream/70">
          Sign in with an admin account to review and download client takes.
        </p>
        <a
          href={loginHref()}
          className="mt-8 inline-flex h-10 items-center rounded-full bg-moss px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-moss/85"
        >
          Sign in
        </a>
      </Shell>
    );
  }

  if (gate === 'forbidden') {
    return (
      <Shell>
        <Header />
        <p className="mt-8 max-w-lg text-cream/70">
          This account can view the page shell, but admin access is required to
          list private takes. In Supabase, set{' '}
          <code className="rounded bg-cream/10 px-1.5 py-0.5 font-mono text-[12px] text-cream">
            profiles.is_admin = true
          </code>{' '}
          for your user, then refresh.
        </p>
        <a
          href="/account"
          className="mt-8 inline-flex h-10 items-center rounded-full border border-cream/20 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/80 transition-colors hover:border-cream/40 hover:text-cream"
        >
          Account
        </a>
      </Shell>
    );
  }

  return (
    <Shell>
      <Header
        trackCount={tracks.length}
        takeCount={filteredTakes.length}
        takeTotal={takes.length}
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-cream/20 bg-transparent text-cream hover:bg-cream/10 hover:text-cream"
              onClick={() => void loadTakes()}
              disabled={refreshing}
            >
              <RefreshCw
                className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-cream/20 bg-transparent text-cream hover:bg-cream/10 hover:text-cream"
              onClick={() => void handleBulkDownload()}
              disabled={selectedTakes.length === 0}
            >
              <Download className="size-3.5" />
              Download selected
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setPendingDelete(selectedTakes)}
              disabled={selectedTakes.length === 0}
            >
              <Trash2 className="size-3.5" />
              Delete selected
            </Button>
          </>
        }
      />

      {actionError ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
        >
          {actionError}
        </p>
      ) : null}

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="font-serif text-2xl italic tracking-tight text-cream">
            Chapter tracks
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-cream/55">
            Published originals and optimized masters from the{' '}
            <code className="rounded bg-cream/10 px-1.5 py-0.5 font-mono text-[11px] text-cream/80">
              audiobook
            </code>{' '}
            bucket.
          </p>
        </div>

        {tracksError ? (
          <p
            role="alert"
            className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
          >
            {tracksError}
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-cream/10 bg-charcoal/50">
            <Table>
              <TableHeader>
                <TableRow className="border-cream/10 hover:bg-transparent">
                  <TableHead className="text-cream/50">Chapter</TableHead>
                  <TableHead className="text-cream/50">File</TableHead>
                  <TableHead className="text-cream/50">Source</TableHead>
                  <TableHead className="text-cream/50">Size</TableHead>
                  <TableHead className="w-20 text-cream/50">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tracks.length === 0 ? (
                  <TableRow className="border-cream/10 hover:bg-transparent">
                    <TableCell
                      colSpan={5}
                      className="h-28 text-center text-cream/45"
                    >
                      <div className="inline-flex flex-col items-center gap-3">
                        <FileAudio className="size-6 text-cream/30" />
                        <span>No published chapter tracks yet.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  tracks.map((track) => {
                    const busy = busyIds.has(track.id);
                    const label =
                      track.originalFilename ||
                      track.storagePath.split('/').pop() ||
                      'Untitled track';
                    return (
                      <TableRow
                        key={track.id}
                        className="border-cream/10 text-cream hover:bg-cream/[0.03]"
                      >
                        <TableCell className="text-cream/75">
                          <div className="min-w-0">
                            <p className="font-medium text-cream">
                              {track.chapterTitle}
                            </p>
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/35">
                              Ch {track.chapterNumber}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[18rem]">
                          <div className="min-w-0">
                            <a
                              href={track.publicUrl}
                              download={label}
                              className="truncate font-medium text-cream underline-offset-4 transition-colors hover:text-moss hover:underline"
                              title="Download file"
                            >
                              {label}
                            </a>
                            <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-cream/35">
                              {track.storageBucket} · {track.storagePath}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              track.source === 'optimized'
                                ? 'border-moss/40 bg-moss/20 text-[#9fb5aa]'
                                : 'border-cream/20 bg-cream/10 text-cream/80'
                            }
                          >
                            {AUDIOBOOK_TRACK_SOURCE_LABELS[track.source]}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-cream/65">
                          {track.fileSizeBytes != null
                            ? formatFileBytes(track.fileSizeBytes)
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="text-cream/60 hover:bg-cream/10 hover:text-cream"
                              disabled={busy || !track.publicUrl}
                              aria-label={`Download ${label}`}
                              title="Download"
                              onClick={() => handleTrackDownload(track)}
                            >
                              <Download className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="mb-4">
          <h2 className="font-serif text-2xl italic tracking-tight text-cream">
            Session takes
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-cream/55">
            Client uploads for review. Update status, download originals, or
            delete.
          </p>
        </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger
            size="sm"
            className="min-w-[10rem] border-cream/20 bg-charcoal/40 text-cream"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {SESSION_TAKE_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={kindFilter}
          onValueChange={(value) => setKindFilter(value as KindFilter)}
        >
          <SelectTrigger
            size="sm"
            className="min-w-[12rem] border-cream/20 bg-charcoal/40 text-cream"
          >
            <SelectValue placeholder="Kind" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All kinds</SelectItem>
            {KIND_OPTIONS.map((kind) => (
              <SelectItem key={kind} value={kind}>
                {SESSION_TAKE_KIND_LABELS[kind]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedTakes.length > 0 ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/45">
            {selectedTakes.length} selected
          </p>
        ) : null}
      </div>

      {loadError ? (
        <p
          role="alert"
          className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
        >
          {loadError}
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-cream/10 bg-charcoal/50">
          <Table>
            <TableHeader>
              <TableRow className="border-cream/10 hover:bg-transparent">
                <TableHead className="w-10 text-cream/50">
                  <Checkbox
                    checked={allFilteredSelected}
                    onCheckedChange={() => toggleSelectAll()}
                    aria-label="Select all visible files"
                    className="border-cream/30 data-[state=checked]:border-moss data-[state=checked]:bg-moss"
                  />
                </TableHead>
                <TableHead className="text-cream/50">File</TableHead>
                <TableHead className="text-cream/50">Kind</TableHead>
                <TableHead className="text-cream/50">Status</TableHead>
                <TableHead className="text-cream/50">Size</TableHead>
                <TableHead className="text-cream/50">Received</TableHead>
                <TableHead className="w-20 text-cream/50">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTakes.length === 0 ? (
                <TableRow className="border-cream/10 hover:bg-transparent">
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-cream/45"
                  >
                    <div className="inline-flex flex-col items-center gap-3">
                      <FileAudio className="size-6 text-cream/30" />
                      <span>No session takes match these filters.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTakes.map((take) => {
                  const busy = busyIds.has(take.id);
                  return (
                    <TableRow
                      key={take.id}
                      data-state={selectedIds.has(take.id) ? 'selected' : undefined}
                      className="border-cream/10 text-cream hover:bg-cream/[0.03] data-[state=selected]:bg-moss/10"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(take.id)}
                          onCheckedChange={(checked) =>
                            toggleRow(take.id, checked === true)
                          }
                          aria-label={`Select ${take.original_filename ?? take.id}`}
                          className="border-cream/30 data-[state=checked]:border-moss data-[state=checked]:bg-moss"
                        />
                      </TableCell>
                      <TableCell className="max-w-[18rem]">
                        <div className="min-w-0">
                          <button
                            type="button"
                            className="truncate text-left font-medium text-cream underline-offset-4 transition-colors hover:text-moss hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => void handleDownload(take)}
                            disabled={busy}
                            title="Download file"
                          >
                            {take.original_filename || 'Untitled take'}
                          </button>
                          <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-cream/35">
                            {take.book_slug} · {take.storage_path}
                          </p>
                          {take.notes ? (
                            <p className="mt-1 truncate text-xs text-cream/50">
                              {take.notes}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-cream/75">
                        {SESSION_TAKE_KIND_LABELS[take.take_kind]}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={take.status}
                          onValueChange={(value) =>
                            void handleStatusChange(
                              take,
                              value as SessionTakeStatus,
                            )
                          }
                          disabled={busy}
                        >
                          <SelectTrigger
                            size="sm"
                            className="min-w-[8.5rem] border-transparent bg-transparent px-0 shadow-none"
                          >
                            <Badge
                              variant="outline"
                              className={statusBadgeClass(take.status)}
                            >
                              {SESSION_TAKE_STATUS_LABELS[take.status]}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                              <SelectItem key={status} value={status}>
                                {SESSION_TAKE_STATUS_LABELS[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-cream/65">
                        {take.file_size_bytes != null
                          ? formatFileBytes(take.file_size_bytes)
                          : '—'}
                      </TableCell>
                      <TableCell className="text-cream/65">
                        {formatWhen(take.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-cream/60 hover:bg-cream/10 hover:text-cream"
                            disabled={busy}
                            aria-label={`Download ${take.original_filename || 'file'}`}
                            title="Download"
                            onClick={() => void handleDownload(take)}
                          >
                            <Download className="size-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="text-cream/60 hover:bg-cream/10 hover:text-cream"
                                disabled={busy}
                                aria-label="Row actions"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Manage file</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => void handleDownload(take)}
                              >
                                <Download className="size-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setPendingDelete([take])}
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
      </section>

      <AlertDialog
        open={Boolean(pendingDelete?.length)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent className="border-cream/15 bg-charcoal text-cream">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file{pendingDelete && pendingDelete.length > 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription className="text-cream/60">
              This removes the audio from private storage and deletes the
              metadata row
              {pendingDelete && pendingDelete.length > 1
                ? ` for ${pendingDelete.length} files`
                : ''}
              . This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-cream/20 bg-transparent text-cream hover:bg-cream/10 hover:text-cream">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => void confirmDelete()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#141414] text-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(159,181,170,0.14), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(204,88,51,0.08), transparent 50%)',
        }}
        aria-hidden
      />
      <main className="relative mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        {children}
      </main>
    </div>
  );
}

function Header({
  trackCount,
  takeCount,
  takeTotal,
  actions,
}: {
  trackCount?: number;
  takeCount?: number;
  takeTotal?: number;
  actions?: ReactNode;
}) {
  return (
    <header className="border-b border-cream/10 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-moss">
          Formless · Audio
        </p>
        <nav className="flex flex-wrap gap-4">
          <a
            href="/audio/editorial"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45 transition-colors hover:text-cream"
          >
            Editorial
          </a>
          <a
            href="/audio/send-take"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45 transition-colors hover:text-cream"
          >
            Send take
          </a>
        </nav>
      </div>
      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-4xl italic tracking-tight text-cream md:text-5xl">
            Files
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream/55 md:text-base">
            Browse published chapter tracks and client session takes. Download
            originals or optimized masters from Supabase.
          </p>
          {typeof trackCount === 'number' &&
          typeof takeCount === 'number' &&
          typeof takeTotal === 'number' ? (
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/40">
              {trackCount} chapter tracks · {takeCount} of {takeTotal} session
              takes
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
