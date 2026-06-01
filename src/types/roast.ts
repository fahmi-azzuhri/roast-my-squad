export interface RoastResult {
  roastScore: number;

  walletScore: number;

  flexScore: number;

  tacticalScore: number;

  originalityScore: number;

  chaosScore: number;

  squadType: string;

  strengths: string[];

  weaknesses: string[];

  comments: string[];

  toxicRoast: string;

  tiktokRoast: string;

  detective: {
    indications: string[];

    conclusion: string;
  };
}
