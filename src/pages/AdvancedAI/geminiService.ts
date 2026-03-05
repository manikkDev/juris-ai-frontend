import type { SearchResult } from "./vectorSearch";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-1.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Send a legal analysis prompt to Gemini and return the response text.
 * Falls back to a local explanation if the API key is missing or the call fails.
 */
export async function generateLegalInsight(
  userQuery: string,
  caseResults: SearchResult[]
): Promise<string> {
  const caseResultsText = caseResults
    .map(
      (c, i) =>
        `${i + 1}. ${c.case_title}\n   Court: ${c.court}\n   Year: ${c.year}\n   Similarity: ${c.similarity}\n   Summary: ${c.summary}`
    )
    .join("\n\n");

  const prompt = `You are a legal assistant helping judges analyze case similarity.

User case:
${userQuery}

Similar cases:
${caseResultsText}

Explain why these cases are relevant and what legal insight they provide. Structure your response with:
1. A brief overview of the legal themes in the user's query
2. For each similar case, explain the specific legal relevance
3. Key takeaways and precedent patterns the judge should consider

Keep the tone professional and suitable for a judicial officer.`;

  // If no API key, generate a local fallback explanation
  if (!GEMINI_API_KEY) {
    return generateLocalFallback(userQuery, caseResults);
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Gemini API error:", response.status, errBody);
      return generateLocalFallback(userQuery, caseResults);
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";
    return text;
  } catch (err) {
    console.error("Gemini API call failed:", err);
    return generateLocalFallback(userQuery, caseResults);
  }
}

/**
 * Local fallback when Gemini API key is not configured.
 * Generates a structured analysis from the search results.
 */
function generateLocalFallback(
  userQuery: string,
  results: SearchResult[]
): string {
  const topCase = results[0];
  const themes = extractThemes(userQuery);

  let analysis = `## Legal Analysis — AI Generated Insight\n\n`;
  analysis += `**Query:** ${userQuery}\n\n`;
  analysis += `**Identified Legal Themes:** ${themes.join(", ")}\n\n`;
  analysis += `---\n\n`;
  analysis += `### Similar Case Analysis\n\n`;

  results.forEach((r, i) => {
    const relevance =
      r.similarity > 0.85
        ? "Highly relevant"
        : r.similarity > 0.75
        ? "Strongly relevant"
        : r.similarity > 0.65
        ? "Moderately relevant"
        : "Contextually relevant";

    analysis += `**${i + 1}. ${r.case_title}** (${r.court}, ${r.year})\n`;
    analysis += `- **Relevance:** ${relevance} (similarity: ${r.similarity})\n`;
    analysis += `- **Summary:** ${r.summary}\n`;
    analysis += `- **Judicial Significance:** This case provides precedent on ${themes[0] || "the legal issue"} and may inform the court's reasoning on procedural and substantive aspects.\n\n`;
  });

  analysis += `---\n\n`;
  analysis += `### Key Takeaways\n\n`;
  analysis += `1. The most closely matched precedent is **${topCase.case_title}** with a similarity score of ${topCase.similarity}, suggesting strong factual and legal overlap.\n`;
  analysis += `2. Multiple cases from ${[...new Set(results.map((r) => r.court))].join(", ")} address similar legal issues, indicating a consistent judicial approach.\n`;
  analysis += `3. The court may consider the reasoning in these cases when evaluating the merits of the present matter.\n\n`;
  analysis += `> *Note: This analysis was generated locally. Configure \`VITE_GEMINI_API_KEY\` in your environment for Gemini-powered insights.*`;

  return analysis;
}

/** Extract likely legal themes from query text. */
function extractThemes(query: string): string[] {
  const themes: string[] = [];
  const lower = query.toLowerCase();
  const themeMap: Record<string, string> = {
    tenant: "Tenancy & Rent Control",
    eviction: "Eviction Proceedings",
    rent: "Rent Disputes",
    landlord: "Landlord-Tenant Relations",
    property: "Property Law",
    tax: "Taxation",
    land: "Land Acquisition",
    criminal: "Criminal Law",
    murder: "Homicide",
    defamation: "Defamation",
    cyber: "Cybercrime",
    fraud: "Fraud",
    environment: "Environmental Law",
    pollution: "Pollution Control",
    family: "Family Law",
    divorce: "Matrimonial Disputes",
    domestic: "Domestic Violence",
    employment: "Employment Law",
    termination: "Wrongful Termination",
    labor: "Labor Rights",
    rera: "Real Estate Regulation",
    builder: "Real Estate Disputes",
    insurance: "Insurance Claims",
    accident: "Motor Accident Claims",
    loan: "Banking & Finance",
    compensation: "Compensation Claims",
    constitutional: "Constitutional Law",
    fundamental: "Fundamental Rights",
  };

  for (const [keyword, theme] of Object.entries(themeMap)) {
    if (lower.includes(keyword)) themes.push(theme);
  }

  return themes.length > 0 ? themes.slice(0, 4) : ["General Civil Law"];
}
