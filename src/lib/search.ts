import { SEEDED_WORKSPACE } from "./seeded-workspace";
import type { ToolName, WorkspaceSource } from "./types";

const STOPWORDS = new Set([
  "a",
  "about",
  "after",
  "and",
  "asked",
  "before",
  "can",
  "create",
  "draft",
  "find",
  "for",
  "from",
  "has",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "prepare",
  "schedule",
  "the",
  "to",
  "wants",
  "with",
]);

export function searchWorkspace(
  query: string,
  tools?: ToolName[],
): WorkspaceSource[] {
  const queryTokens = tokenize(query);
  const allowedTools = tools ? new Set<ToolName>(tools) : null;

  return SEEDED_WORKSPACE.filter((source) =>
    allowedTools ? allowedTools.has(source.tool) : true,
  )
    .map((source) => scoreSource(source, queryTokens))
    .filter((source) => source.relevanceScore > 0)
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }

      return a.timestamp.localeCompare(b.timestamp);
    });
}

export function tokenize(value: string): string[] {
  return Array.from(
    new Set(
      value
        .toLowerCase()
        .replace(/[^a-z0-9$]+/g, " ")
        .split(/\s+/)
        .map((token) => normalizeToken(token))
        .filter((token) => token.length > 1 && !STOPWORDS.has(token)),
    ),
  );
}

function normalizeToken(token: string): string {
  if (token === "soc" || token === "soc2" || token === "socii") {
    return "soc2";
  }

  if (token === "48k" || token === "$48k") {
    return "48k";
  }

  return token.replace(/^\$/, "");
}

function scoreSource(
  source: WorkspaceSource,
  queryTokens: string[],
): WorkspaceSource {
  const titleTokens = new Set(tokenize(source.title));
  const snippetTokens = new Set(tokenize(source.snippet));
  const contentTokens = new Set(tokenize(source.content));
  const tagTokens = new Set(source.tags.flatMap((tag) => tokenize(tag)));
  const metadataTokens = new Set(
    Object.values(source.metadata).flatMap((value) => tokenize(value)),
  );

  let rawScore = 0;

  for (const token of queryTokens) {
    if (titleTokens.has(token)) rawScore += 5;
    if (tagTokens.has(token)) rawScore += 4;
    if (snippetTokens.has(token)) rawScore += 3;
    if (contentTokens.has(token)) rawScore += 2;
    if (metadataTokens.has(token)) rawScore += 1;
  }

  if (queryTokens.includes(source.tool)) {
    rawScore += 2;
  }

  const maxScore = Math.max(queryTokens.length * 10, 1);
  const relevanceScore = Math.min(0.99, Number((rawScore / maxScore).toFixed(2)));

  return {
    ...source,
    relevanceScore,
    relevance: relevanceScore,
  };
}
