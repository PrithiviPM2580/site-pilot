import { createClient } from "@insforge/sdk";
import { auth } from "@insforge/nextjs";

export async function getAuthServer() {
  const { token, user } = await auth();

  const insforge = createClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
    edgeFunctionToken: token || undefined,
  });

  return { insforge, user };
}
