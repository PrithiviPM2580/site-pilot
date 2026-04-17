import { createClient } from "@insforge/sdk";
import { auth } from "@insforge/nextjs";

export async function getAuthServer() {
  const { token, user } = await auth();

  const insforge = createClient({
    baseUrl:
      process.env.INSFORGE_BASE_URL ||
      "https://b4qvihfq.ap-southeast.insforge.app",
    edgeFunctionToken: token || undefined,
  });

  return { insforge, user };
}
