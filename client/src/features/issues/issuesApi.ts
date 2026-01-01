import { baseApi } from "../../app/baseApi";

export type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH";

export type Issue = {
  _id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ListMeta = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type IssuesListResponse = {
  ok: boolean;
  issues: Issue[];
  meta?: ListMeta;
};

export type StatsResponse = {
  ok?: boolean;
  stats?: Record<string, number>;      // keep old support
  byStatus?: Record<string, number>;
  byPriority?: Record<string, number>;
  recent?: Array<{
    _id: string;
    title: string;
    status: string;
    priority: string;
    updatedAt: string;
  }>;
};



export const issuesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listIssues: b.query<
      IssuesListResponse,
      { q?: string; status?: string; priority?: string; page?: number; limit?: number }
    >({
      query: (params) => ({ url: "/issues", params }),
      providesTags: (r) =>
        r?.issues
          ? [{ type: "Issues", id: "LIST" }, ...r.issues.map((i) => ({ type: "Issues" as const, id: i._id }))]
          : [{ type: "Issues", id: "LIST" }],
    }),

    getIssue: b.query<{ ok: boolean; issue: Issue }, string>({
      query: (id) => `/issues/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Issues", id }],
    }),

    createIssue: b.mutation<{ ok: boolean; issue: Issue }, { title: string; description: string; priority: IssuePriority }>({
      query: (body) => ({ url: "/issues", method: "POST", body }),
      invalidatesTags: [{ type: "Issues", id: "LIST" }],
    }),

    updateIssue: b.mutation<
      { ok: boolean; issue: Issue },
      { id: string; patch: Partial<Pick<Issue, "title" | "description" | "status" | "priority">> }
    >({
      query: ({ id, patch }) => ({ url: `/issues/${id}`, method: "PATCH", body: patch }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Issues", id }, { type: "Issues", id: "LIST" }],
    }),

    deleteIssue: b.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/issues/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Issues", id: "LIST" }],
    }),

    stats: b.query<StatsResponse, void>({
      query: () => "/issues/stats",
    }),
  }),
});

export const {
  useListIssuesQuery,
  useGetIssueQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useStatsQuery,
} = issuesApi;
