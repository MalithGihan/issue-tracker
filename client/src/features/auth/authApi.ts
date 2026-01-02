import { baseApi } from "../../app/baseApi";

type Ok = { ok: boolean };
type Me = { ok: boolean; userId: string };

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    register: b.mutation<Ok, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      invalidatesTags: ["Me"],
    }),
    login: b.mutation<Ok, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Me"],
    }),
    logout: b.mutation<Ok, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Me"],
    }),
    me: b.query<Me, void>({
      query: () => ({ url: "/auth/me" }),
      providesTags: ["Me"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useMeQuery } = authApi;
