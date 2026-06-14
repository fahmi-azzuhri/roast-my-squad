export interface RoastResult {
  roastScore: number;
  walletScore: number;
  flexScore: number;
  metaAbuse: number;
  tacticalIQ: number;
  spamThroughPass: number;
  squadType: "Sultan" | "Meta Abuser" | "Balance" | "Casual";
  squadValue: string;
  cardProfile: {
    dominant: "base" | "epic" | "showtime" | "mixed" | "unknown";
    confidence: number;
    clues: string[];
    note: string;
  };
  strengths: string[];
  weaknesses: string[];
  netizanComments: string[];
  toxicRoast: string;
  tiktokMode: string;
  detective: {
    indications: string[];
    conclusion: string;
  };
}
