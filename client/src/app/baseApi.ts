import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = "http://localhost:4000";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE}/api/v1`,
  credentials: "include",
});

const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );
    return rawBaseQuery(args, api, extraOptions);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Me", "Issues", "Assignees"],
  endpoints: () => ({}),
});
