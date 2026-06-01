import { GoogleGenAI } from "@google/genai";
import type { RoastResult } from "../types/roastResult";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export type RoastLevel = "smooth" | "medium" | "brutal" | "toxic";

const levelConfig = {
  smooth: {
    intensity: "MILD - Humor based, mostly observational",
    tone: "friendly tapi tetap sarcastic",
    comments: "5 komentar meme tapi santai",
    roastLength: "2 kalimat ringan",
  },
  medium: {
    intensity: "STANDARD - Balanced roast dengan kepedasan medium",
    tone: "mix of humor dan sarcasm yang pedas",
    comments: "5 komentar meme agak toxic",
    roastLength: "3 kalimat cukup pedas",
  },
  brutal: {
    intensity: "EXTREME - No filter, brutal criticism with humor",
    tone: "super pedas, tidak peduli perasaan",
    comments: "5 komentar super toxic dan lucu",
    roastLength: "4 kalimat sangat pedas dan hard-hitting",
  },
  toxic: {
    intensity: "CHAOS MODE - Maximum destruction, pure toxicity",
    tone: "ultimate toxic, sarkastik level dewa",
    comments: "5 komentar paling toxic dan savage yang pernah ada",
    roastLength: "5 kalimat utterly devastating dan tidak terlupakan",
  },
};

export async function roastSquad(
  imageBase64: string,
  level: RoastLevel = "medium",
  ocrText?: string,
): Promise<RoastResult> {
  const config = levelConfig[level];

  const ocrSection = ocrText && ocrText.trim() ? `\nDETECTED TEXT (OCR): ${ocrText.trim()}` : "";

  const prompt = `Kamu adalah AI Roaster eFootball Indonesia yang BRUTAL, JUJUR, dan VIRAL.
LEVEL ROAST: ${config.intensity}
TONE: ${config.tone}

TUGAS: Analisa DETAIL screenshot squad eFootball ini. PERHATIKAN:
- Formasi yang dipakai
- Pemain premium vs gratisan
- Quality build vs investasi dompet
- Tingkat meta abuse (spam through pass, counter attack, etc)
- IQ taktik dan gameplay
- Key player yang jadi tulang punggung

${ocrSection}

SCORING (0-10):
- roastScore: Seberapa parah squad ini? 10 = "ini akun diwarisin", 0 = "ok lah"
- walletScore: Berapa banyak duit yang dikeluarin? 10 = sultan 100%, 0 = squad gratisan
- flexScore: Seberapa dia flex? 10 = "gw kaya banget", 0 = "low-key"
- metaAbuse: Seberapa meta? 10 = pure meta abuse, 0 = creative build
- tacticalIQ: Skill taktik defensanya gimana? 10 = "bisa main sabar", 0 = "auto klik"
- spamThroughPass: Persen kemungkinan spam through pass (0-100)

NETIZEN COMMENTS: ${config.comments}. Generate yang LUCU dan MEMORABLE.

TOXIC ROAST: ${config.roastLength} Buat yang pedas, memorable, dan bikinin orang tertawa.

TIKTOK MODE: Format super pendek (2-3 baris) yang VIRAL di TikTok, pake emoji

DETECTIVE:
- indications: List 3-5 bukti dari squad ini
- conclusion: Satu kesimpulan bold

WAJIB RETURN PURE JSON (no markdown, no backticks, no code blocks):
{
  "roastScore": <number 0-10>,
  "walletScore": <number 0-10>,
  "flexScore": <number 0-10>,
  "metaAbuse": <number 0-10>,
  "tacticalIQ": <number 0-10>,
  "spamThroughPass": <number 0-100>,
  "squadType": "<Sultan|Meta Abuser|Balance|Casual>",
  "squadValue": "<est. value e.g. Rp XXX.XXX.XXX+>",
  "strengths": [<string>, <string>, <string>],
  "weaknesses": [<string>, <string>, <string>],
  "netizanComments": [<string>, <string>, <string>, <string>, <string>],
  "toxicRoast": "<string roast>",
  "tiktokMode": "<string 2-3 baris>",
  "detective": {
    "indications": [<string>, <string>, <string>],
    "conclusion": "<string bold conclusion>"
  }
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64,
        },
      },
      {
        text: prompt,
      },
    ],
  });

  const responseText = response.text.trim();

  try {
    const parsed = JSON.parse(responseText);
    return parsed as RoastResult;
  } catch {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as RoastResult;
    }
    throw new Error("Failed to parse AI response");
  }
}
