/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function getRtkErrorMessage(err: unknown, fallback = "Something went wrong") {
  const e = err as FetchBaseQueryError | any;
  if (e?.data?.error) return String(e.data.error);
  if (e?.error) return String(e.error);
  if (typeof e?.status === "number") return `Request failed (${e.status})`;

  return fallback;
}
