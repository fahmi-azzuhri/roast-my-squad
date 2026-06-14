import { mistralFetch } from "./mistral";

type MistralOcrResponse = {
  pages?: Array<{
    markdown?: string;
  }>;
};

export async function extractTextFromImage(base64: string) {
  try {
    const imageUrl = base64.startsWith("data:")
      ? base64
      : `data:image/jpeg;base64,${base64}`;

    const response = await mistralFetch<MistralOcrResponse>("/ocr", {
      model: "mistral-ocr-latest",
      document: {
        type: "image_url",
        image_url: imageUrl,
      },
      include_image_base64: false,
    });

    const text =
      response.pages
        ?.map((page) => page.markdown?.trim() || "")
        .filter(Boolean)
        .join("\n\n")
        .trim() || "";

    const summary = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 10)
      .join(" | ");

    return { text, summary };
  } catch (error) {
    console.warn("OCR failed:", error);
    return { text: "", summary: "" };
  }
}
