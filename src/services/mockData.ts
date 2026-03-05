// Mock data for the Juris AI system

const caseTypes = ["Civil", "Criminal", "Family", "Constitutional", "Commercial", "Labor", "Tax", "Environmental"];
const statuses = ["Active", "Pending", "Adjourned", "Resolved", "Under Review"];
const judges = [
  "Hon. Justice A. Sharma", "Hon. Justice B. Reddy", "Hon. Justice C. Iyer",
  "Hon. Justice D. Patel", "Hon. Justice E. Gupta", "Hon. Justice F. Rao",
  "Hon. Justice G. Singh", "Hon. Justice H. Kumar", "Hon. Justice I. Das",
  "Hon. Justice J. Nair",
];
const courts = ["Supreme Court", "High Court Delhi", "High Court Mumbai", "District Court Bangalore", "Sessions Court Chennai"];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function fmt(d: Date) {
  return d.toISOString().split("T")[0];
}

export interface CaseData {
  caseId: string;
  caseType: string;
  court: string;
  judge: string;
  filedDate: string;
  lastHearingDate: string;
  adjournments: number;
  status: string;
  priorityScore: number;
  adjournmentRisk: number;
  delayProbability: number;
  resolutionEstimate: string;
  timeline: { date: string; event: string; description: string }[];
}

export function generateCases(count = 50): CaseData[] {
  return Array.from({ length: count }, (_, i) => {
    const filed = randomDate(new Date("2021-01-01"), new Date("2024-06-01"));
    const lastHearing = randomDate(filed, new Date("2025-02-01"));
    const adj = Math.floor(Math.random() * 12);
    const risk = Math.round((0.2 + Math.random() * 0.7) * 100) / 100;
    const delay = Math.round((0.1 + Math.random() * 0.8) * 100) / 100;
    const priority = Math.round((risk * 40 + delay * 30 + (adj / 12) * 30));
    const months = Math.ceil(Math.random() * 18) + 1;

    return {
      caseId: `JC-${2024}-${String(i + 1).padStart(4, "0")}`,
      caseType: caseTypes[i % caseTypes.length],
      court: courts[i % courts.length],
      judge: judges[i % judges.length],
      filedDate: fmt(filed),
      lastHearingDate: fmt(lastHearing),
      adjournments: adj,
      status: statuses[i % statuses.length],
      priorityScore: Math.min(priority, 100),
      adjournmentRisk: risk,
      delayProbability: delay,
      resolutionEstimate: `${months} months`,
      timeline: [
        { date: fmt(filed), event: "Filed", description: "Case registered and filed" },
        { date: fmt(randomDate(filed, lastHearing)), event: "Hearing Scheduled", description: "First hearing date assigned" },
        ...(adj > 2 ? [{ date: fmt(randomDate(filed, lastHearing)), event: "Adjourned", description: `Case adjourned (${adj} total)` }] : []),
        { date: fmt(randomDate(filed, lastHearing)), event: "Evidence Submitted", description: "Key evidence documents submitted" },
        { date: fmt(lastHearing), event: "Last Hearing", description: "Most recent court hearing" },
      ],
    };
  });
}

export const sampleCases = generateCases(50);

export const analyticsData = {
  backlogOverTime: Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    cases: 120 + Math.floor(Math.random() * 80) - i * 3,
    resolved: 30 + Math.floor(Math.random() * 40) + i * 2,
  })),
  adjournmentTrends: Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    adjournments: 15 + Math.floor(Math.random() * 25),
  })),
  caseTypeDistribution: caseTypes.map((t) => ({
    name: t,
    value: 5 + Math.floor(Math.random() * 20),
  })),
  monthlyResolution: Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    resolved: 20 + Math.floor(Math.random() * 30) + i * 1.5,
    target: 40,
  })),
};

export function mockPredict() {
  return {
    adjournmentRisk: Math.round(Math.random() * 100) / 100,
    delayProbability: Math.round(Math.random() * 100) / 100,
    resolutionEstimate: `${Math.ceil(Math.random() * 12) + 1} months`,
  };
}
