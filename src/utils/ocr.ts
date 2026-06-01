export async function extractTextFromImage(base64: string) {
  try {
    // dynamic import to avoid forcing dependency at build time
    const Tesseract = await import("tesseract.js");
    const dataUrl = base64.startsWith("data:")
      ? base64
      : `data:image/jpeg;base64,${base64}`;

    const result = await Tesseract.recognize(dataUrl, "eng+ind");

    const text = result?.data?.text?.trim() || "";
    const summary = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 10)
      .join(" | ");

    return { text, summary };
  } catch (error) {
    console.warn("OCR failed:", error);
    return { text: "", summary: "" };
  }
}
