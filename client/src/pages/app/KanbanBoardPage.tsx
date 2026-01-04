/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { DndContext, useDraggable, useDroppable, type DragEndEvent, } from "@dnd-kit/core";
import toast from "react-hot-toast";
import { Filter, GripVertical } from "lucide-react";

import { useMeQuery } from "../../features/auth/authApi";
import {
  useListIssuesQuery,
  useUpdateIssueMutation,
  type Issue,
  type IssueStatus,
} from "../../features/issues/issuesApi";
import Skeleton from "../../components/ContentLoaders/Skeleton";
import IssueDetailModal from "./IssueDetailModal";

const STATUSES: IssueStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

function getUserIdFromMe(me: any) {
  return me?.user?.id ?? me?.userId ?? "";
}

function getUserId(u: any) {
  return u?._id ?? u?.id ?? u ?? "";
}

function Column({
  status,
  count,
  children,
}: {
  status: IssueStatus;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border border-zinc-200 bg-white p-4 min-h-105 transition ${
        isOver ? "ring-2 ring-zinc-900/10" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-zinc-900">{status}</div>
        <div className="text-xs text-zinc-600 bg-zinc-100 border border-zinc-200 rounded-full px-2 py-0.5">
          {count}
        </div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Card({
  issue,
  onOpen,
}: {
  issue: Issue;
  onOpen: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue._id,
    data: { fromStatus: issue.status },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const createdByName = (issue as any)?.createdBy?.name;
  const label = (issue as any)?.label;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-zinc-200 bg-white p-3 shadow-sm hover:bg-zinc-50 transition ${
        isDragging ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-0.5 text-zinc-400 hover:text-zinc-700"
          {...listeners}
          {...attributes}
          aria-label="Drag"
        >
          <GripVertical size={16} />
        </button>

        <button
          type="button"
          className="flex-1 text-left"
          onClick={() => onOpen(issue._id)}
        >
          <div className="text-sm font-semibold text-zinc-900 line-clamp-2">
            {issue.title}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
            <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5">
              {issue.priority}
            </span>

            {label ? (
              <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5">
                {label}
              </span>
            ) : null}

            {createdByName ? (
              <span className="text-zinc-500">• {createdByName}</span>
            ) : null}
          </div>
        </button>
      </div>
    </div>
  );
}

export default function KanbanBoardPage() {
  const { data: me } = useMeQuery();
  const myId = getUserIdFromMe(me);

  const [assignedOnly, setAssignedOnly] = useState(false);

  // fetch ALL org issues (increase limit if needed)
  const { data, isLoading, isError, refetch } = useListIssuesQuery(
    { page: 1, limit: 200, sort: "newest" } as any,
    { refetchOnMountOrArgChange: true, refetchOnFocus: true, refetchOnReconnect: true }
  );

  const [updateIssue, { isLoading: updating }] = useUpdateIssueMutation();

  const [detailId, setDetailId] = useState<string | null>(null);

  const issues: Issue[] = (data as any)?.issues ?? [];

  const visibleIssues = useMemo(() => {
    if (!assignedOnly) return issues;
    return issues.filter((it: any) => getUserId(it.assignFor) === myId);
  }, [issues, assignedOnly, myId]);

  const byStatus = useMemo(() => {
    const map: Record<IssueStatus, Issue[]> = {
      OPEN: [],
      IN_PROGRESS: [],
      RESOLVED: [],
      CLOSED: [],
    };
    for (const it of visibleIssues) {
      map[it.status as IssueStatus]?.push(it);
    }
    return map;
  }, [visibleIssues]);

  async function onDragEnd(e: DragEndEvent) {
    const issueId = String(e.active.id);
    const overStatus = e.over?.id as IssueStatus | undefined;
    if (!overStatus) return;

    const fromStatus = (e.active.data.current as any)?.fromStatus as IssueStatus | undefined;
    if (!fromStatus || fromStatus === overStatus) return;

    const r = await updateIssue({ id: issueId, patch: { status: overStatus } } as any);
    if ("error" in r) {
      toast.error("Update failed (maybe you don’t have permission)");
      return;
    }
    toast.success("Status updated");
    // listIssues will refresh via invalidatesTags; this is extra safety:
    refetch();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-zinc-900">Kanban Board</h1>
          <p className="mt-1 text-xs text-zinc-600">Drag cards between columns to update status</p>
        </div>

        <button
          type="button"
          onClick={() => setAssignedOnly((v) => !v)}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
            assignedOnly
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
          }`}
        >
          <Filter size={14} />
          {assignedOnly ? "Assigned to me: ON" : "Assigned to me"}
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-4">
          {STATUSES.map((s) => (
            <div key={s} className="rounded-2xl border border-zinc-200 bg-white p-4">
              <Skeleton className="h-4 w-24" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load issues.
          <button className="ml-2 underline font-semibold" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      ) : (
        <DndContext onDragEnd={onDragEnd}>
          <div className="grid gap-4 lg:grid-cols-4">
            {STATUSES.map((status) => (
              <Column key={status} status={status} count={byStatus[status].length}>
                {byStatus[status].map((it) => (
                  <Card key={it._id} issue={it} onOpen={(id) => setDetailId(id)} />
                ))}
              </Column>
            ))}
          </div>

          {updating ? (
            <div className="text-xs text-zinc-500">Updating status…</div>
          ) : null}
        </DndContext>
      )}

      {detailId && <IssueDetailModal id={detailId} onClose={() => setDetailId(null)} />}
    </div>
  );
}
