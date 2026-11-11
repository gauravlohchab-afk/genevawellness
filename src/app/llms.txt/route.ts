import { buildLlmsTxt, llmsHeaders } from "@/lib/llms";

// Rebuilt hourly so new blog posts appear without a redeploy.
export const revalidate = 3600;

export async function GET() {
  return new Response(await buildLlmsTxt(false), { headers: llmsHeaders });
}
