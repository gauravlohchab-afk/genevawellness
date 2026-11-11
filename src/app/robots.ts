import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

const disallow = ["/api/", "/admin"];

/**
 * AI search and answer-engine crawlers, named explicitly so the policy is clear even if
 * a crawler ignores the wildcard group. Allowing them lets ChatGPT, Claude, Perplexity,
 * Gemini, Copilot and others cite the clinic. Remove a line to opt that crawler out.
 */
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Meta-ExternalAgent",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiCrawlers, allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
