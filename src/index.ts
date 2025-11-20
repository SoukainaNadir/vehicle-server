import { connectDb, dbConfigFromEnv } from "./database";
import { setupApp } from "./app";

async function main() {
  let port = 8080;

  if (process.env.PORT) {
    port = parseInt(process.env.PORT, 10);
  }

  const db = await connectDb(dbConfigFromEnv());

  setupApp(db).listen(port, () => {
    console.log(`Server is running on port ${port.toString()}`);
  })
}

main().catch((e: unknown) => { console.error(`Something went wrong ${e as string}`); });
