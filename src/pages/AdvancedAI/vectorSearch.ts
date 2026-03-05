import sampleCases from "./sample_cases.json";

// --- Types ---
export interface SampleCase {
  case_title: string;
  court: string;
  year: number;
  summary: string;
  embedding_vector: number[];
}

export interface SearchResult {
  case_title: string;
  court: string;
  year: number;
  summary: string;
  similarity: number;
}

// --- Cosine Similarity ---
function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function magnitude(v: number[]): number {
  return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = dotProduct(a, b);
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// --- Query Embedding Generator ---
// Generates a deterministic pseudo-embedding from query text.
// Maps keywords to vector dimensions so that semantically related
// queries produce vectors closer to relevant sample cases.
function generateQueryEmbedding(query: string): number[] {
  const dim = 32;
  const vec = new Array(dim).fill(0);
  const lower = query.toLowerCase();

  // Seed from character codes for base variation
  for (let i = 0; i < lower.length; i++) {
    const idx = lower.charCodeAt(i) % dim;
    vec[idx] += 0.05;
  }

  // Keyword boosting — nudge the vector toward specific regions
  // to simulate semantic awareness
  const keywordMap: Record<string, number[]> = {
    // Tenant / Rent / Eviction cluster (dims 0,2,4,10,23)
    tenant: [0, 2, 10], eviction: [0, 2, 4], rent: [0, 4, 10],
    landlord: [0, 2, 23], lease: [0, 10, 23], unpaid: [0, 4, 10],
    // Property / Tax cluster (dims 1,3,13,16)
    property: [1, 3, 16], tax: [1, 3, 16], municipal: [1, 13, 16],
    assessment: [1, 3, 13], gst: [1, 16, 27],
    // Criminal / Crime cluster (dims 8,12,17)
    criminal: [8, 12, 17], murder: [8, 12], defamation: [8, 3, 17],
    cybercrime: [8, 5, 17], fraud: [8, 5, 6], bail: [8, 12, 6],
    // Land / Acquisition (dims 4,7,13)
    land: [4, 7, 13], acquisition: [4, 7, 9], highway: [4, 7, 13],
    compensation: [4, 7, 9], farmer: [4, 7, 13],
    // Environmental (dims 5,11,15,26)
    environment: [5, 11, 26], pollution: [5, 11, 15], river: [5, 11, 26],
    forest: [5, 26, 15], pil: [5, 11, 15],
    // Family / Domestic (dims 2,4,8,14)
    family: [2, 14, 21], partition: [2, 14, 6], divorce: [2, 14, 8],
    domestic: [2, 14, 4], violence: [2, 14, 8], maintenance: [2, 14, 21],
    // Employment / Labor (dims 9,11,20)
    employment: [9, 20, 25], termination: [9, 20, 11], worker: [9, 11, 20],
    labor: [9, 11, 20], industrial: [9, 11, 5], wages: [9, 20, 25],
    // Real Estate / RERA (dims 1,4,22)
    rera: [1, 4, 22], builder: [1, 4, 22], delay: [1, 22, 4],
    homebuyer: [1, 22, 4], flat: [1, 4, 22],
    // Insurance / Accident (dims 1,7,10)
    insurance: [1, 7, 10], accident: [1, 7, 10], motor: [1, 7, 10],
    claim: [1, 7, 10],
    // Banking / Finance (dims 1,6,30)
    loan: [1, 6, 30], bank: [1, 6, 30], npa: [1, 6, 30],
    recovery: [1, 6, 30], sarfaesi: [1, 6, 30],
  };

  const words = lower.split(/\W+/);
  for (const word of words) {
    if (keywordMap[word]) {
      for (const idx of keywordMap[word]) {
        vec[idx] += 0.25;
      }
    }
  }

  // Normalize to [0,1] range
  const maxVal = Math.max(...vec, 0.01);
  for (let i = 0; i < dim; i++) {
    vec[i] = Math.min(vec[i] / maxVal, 1.0);
  }

  return vec;
}

// --- Vector Search ---
// Find top-k similar cases from the local dataset
export function searchSimilarCases(query: string, topK = 5): SearchResult[] {
  const queryVec = generateQueryEmbedding(query);

  const scored = (sampleCases as SampleCase[]).map((c) => ({
    case_title: c.case_title,
    court: c.court,
    year: c.year,
    summary: c.summary,
    similarity: parseFloat(cosineSimilarity(queryVec, c.embedding_vector).toFixed(4)),
  }));

  // Sort by similarity descending and take top-k
  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}
