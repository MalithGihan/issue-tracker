/* eslint-disable @typescript-eslint/no-explicit-any */


export function downloadCsv(filename: string, rows: Record<string, any>[]) {
  const escape = (v: any) => {
    const s = v === null || v === undefined ? "" : String(v);
    const needsQuotes = /[",\n\r]/.test(s);
    const out = s.replace(/"/g, '""');
    return needsQuotes ? `"${out}"` : out;
  };

  if (!rows.length) {
const blob = new Blob([""], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];

  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}