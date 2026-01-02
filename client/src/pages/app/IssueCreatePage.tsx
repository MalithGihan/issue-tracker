import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateIssueMutation,
  type IssuePriority,
} from "../../features/issues/issuesApi";
import { getRtkErrorMessage } from "../../lib/rtkError";
import toast from "react-hot-toast";
import { firstZodError } from "../../lib/zodError";
import { issueCreateSchema } from "../../lib/schemas";

export default function IssueCreatePage() {
  const nav = useNavigate();
  const [createIssue, { isLoading }] = useCreateIssueMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("MEDIUM");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = issueCreateSchema.safeParse({
      title,
      description,
      priority,
    });
    if (!parsed.success) return toast.error(firstZodError(parsed.error));

    const r = await createIssue(parsed.data);
    if ("error" in r)
      return toast.error(getRtkErrorMessage(r.error, "Create failed"));
    toast.success("Issue created");
    nav(`/app/issues/${r.data.issue._id}`, { replace: true });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-xl">
      <h2 className="text-xl font-semibold">Create Issue</h2>

      <input
        className="w-full rounded-lg border p-2 bg-transparent"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full rounded-lg border p-2 bg-transparent"
        placeholder="Description"
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="w-full rounded-lg border p-2 bg-transparent"
        value={priority}
        onChange={(e) => setPriority(e.target.value as IssuePriority)}
      >
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>

      <button
        disabled={isLoading}
        className="rounded-lg border px-3 py-2 text-sm"
      >
        {isLoading ? "Saving..." : "Create"}
      </button>
    </form>
  );
}
