import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const port = Number(process.env.PORT || env.SERVER_PORT || 4000);

app.listen(port, "0.0.0.0", () => {
  console.log(`API running on :${port}`);
});

connectDB().catch((err) => {
  console.error("DB connection failed:", err);
});
