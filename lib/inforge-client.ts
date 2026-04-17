import { createClient } from "@insforge/sdk";

export const insforge = createClient({
  baseUrl:
    process.env.INSFORGE_BASE_URL ||
    "https://b4qvihfq.ap-southeast.insforge.app",
  anonKey: process.env.INSFORGE_API_KEY!,
});
