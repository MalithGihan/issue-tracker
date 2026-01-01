import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetIssueQuery,
  useUpdateIssueMutation,
  type IssuePriority,
  type IssueStatus,
} from "../../features/issues/issuesApi";
import toast from "react-hot-toast";
import { getRtkErrorMessage } from "../../lib/rtkError";

export default function IssueEditPage() {
  const nav = useNavigate();
  const { id } = useParams();
  const issueId = id || "";

  const { data, isLoading } = useGetIssueQuery(issueId, { skip: !issueId });
  const [updateIssue, { isLoading: saving }] = useUpdateIssueMutation();

  if (isLoading) return <div>Loading...</div>;
  if (!data?.ok) return <div>Not found</div>;

  return (
  <IssueEditForm
    key={issueId}
    issue={data.issue}
    onSave={async (patch) => {
      const r = await updateIssue({ id: issueId, patch });
      if ("error" in r) {
        toast.error(getRtkErrorMessage(r.error, "Update failed"));
        return; // Just return, don't return the toast result
      }
      toast.success("Issue updated");
      nav(`/app/issues/${issueId}`, { replace: true });
    }}
    saving={saving}
  />
);
}

function IssueEditForm({
  issue,
  onSave,
  saving,
}: {
  issue: {
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
  };
  onSave: (patch: {
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
  }) => Promise<void>;
  saving: boolean;
}) {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [status, setStatus] = useState<IssueStatus>(issue.status);
  const [priority, setPriority] = useState<IssuePriority>(issue.priority);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave({ title, description, status, priority });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-xl">
      <h2 className="text-xl font-semibold">Edit Issue</h2>

      <input
        className="w-full rounded-lg border p-2 bg-transparent"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full rounded-lg border p-2 bg-transparent"
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="w-full rounded-lg border p-2 bg-transparent"
        value={status}
        onChange={(e) => setStatus(e.target.value as IssueStatus)}
      >
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="RESOLVED">RESOLVED</option>
      </select>

      <select
        className="w-full rounded-lg border p-2 bg-transparent"
        value={priority}
        onChange={(e) => setPriority(e.target.value as IssuePriority)}
      >
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>

      <button disabled={saving} className="rounded-lg border px-3 py-2 text-sm">
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
