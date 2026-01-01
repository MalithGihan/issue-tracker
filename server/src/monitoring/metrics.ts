import client from "prom-client";

client.collectDefaultMetrics(); // CPU/mem/event-loop/etc.

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_ms",
  help: "HTTP request duration in ms",
  labelNames: ["method", "route", "status"] as const,
  buckets: [25, 50, 100, 200, 400, 800, 1500, 3000],
});

export async function metricsText() {
  return client.register.metrics();
}
