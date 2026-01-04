import { baseApi } from "../../app/baseApi";

export type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type PublicUser = {
  id?: string;
  _id?: string;
  name: string;              
  email: string;
  organization: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Issue = {
  _id: string;
  title: string;
  description: string;
  label: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  createdBy: PublicUser;          
  assignFor: PublicUser | null; 
  createdAt: string;
  updatedAt: string;
};

export type ListMeta = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext?: boolean;
};

export type IssuesListResponse = {
  ok: boolean;
  issues: Issue[];
  meta?: ListMeta;
};

export type StatsResponse = {
  ok?: boolean;
  stats?: Record<string, number>; 
  byStatus?: Record<string, number>;
  byPriority?: Record<string, number>;
  recent?: Array<{
    _id: string;
    title: string;
    status: IssueStatus;
    priority: IssuePriority;
    label?: string | null;
    updatedAt: string;
    createdBy?: PublicUser;
    assignFor?: PublicUser | null;
  }>;
};

export type AssigneesResponse = {
  ok: boolean;
  users: Array<{
    id: string;
    name: string;
    email: string;
    organization: string;
    createdAt?: string;
  }>;
};


export const issuesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /** List issues (org scoped on backend) */
    listIssues: b.query<
      IssuesListResponse,
      {
        q?: string;
        label?: string; 
        status?: IssueStatus;
        priority?: IssuePriority;
        page?: number;
        limit?: number;
        sort?: "newest" | "oldest";
      }
    >({
      query: (params) => ({ url: "/issues", params }),
      providesTags: (r) =>
        r?.issues
          ? [
              { type: "Issues", id: "LIST" },
              ...r.issues.map((i) => ({ type: "Issues" as const, id: i._id })),
            ]
          : [{ type: "Issues", id: "LIST" }],
    }),

    /** Single issue (returns createdBy + assignFor populated) */
    getIssue: b.query<{ ok: boolean; issue: Issue }, string>({
      query: (id) => `/issues/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Issues", id }],
    }),

    /** Get users in my org for assign dropdown */
    getAssignees: b.query<AssigneesResponse, void>({
      query: () => "/issues/assignees",
      providesTags: [{ type: "Assignees", id: "LIST" }],
    }),

    /** Create issue (label + assignFor supported) */
    createIssue: b.mutation<
      { ok: boolean; issue: Issue },
      {
        title: string;
        description: string;
        priority?: IssuePriority;
        label?: string | null;
        assignFor?: string | null; 
      }
    >({
      query: (body) => ({ url: "/issues", method: "POST", body }),
      invalidatesTags: [
        { type: "Issues", id: "LIST" },
        { type: "Assignees", id: "LIST" },
      ],
    }),

    /** Update issue (owner-only on backend) */
    updateIssue: b.mutation<
      { ok: boolean; issue: Issue },
      {
        id: string;
        patch: Partial<{
          title: string;
          description: string;
          status: IssueStatus;
          priority: IssuePriority;
          label: string | null;
          assignFor: string | null; // userId or null
        }>;
      }
    >({
      query: ({ id, patch }) => ({ url: `/issues/${id}`, method: "PATCH", body: patch }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Issues", id },
        { type: "Issues", id: "LIST" },
      ],
    }),

    /** Delete issue (owner-only) */
    deleteIssue: b.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/issues/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Issues", id: "LIST" }],
    }),

    /** Stats (org scoped on backend; can include priority + recent) */
    stats: b.query<StatsResponse, void>({
      query: () => "/issues/stats",
    }),
  }),
});

export const {
  useListIssuesQuery,
  useGetIssueQuery,
  useGetAssigneesQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useStatsQuery,
} = issuesApi;
