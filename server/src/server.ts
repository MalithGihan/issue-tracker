import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function start() {
  try {
    await connectDB();
    app.listen(env.SERVER_PORT, () =>
      console.log(`API running on :${env.SERVER_PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
