const MISTRAL_API_URL = "https://api.mistral.ai/v1";

export function getMistralApiKey() {
  const apiKey =
    import.meta.env.VITE_MISTRAL_API_KEY ?? import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing Mistral API key");
  }

  return apiKey;
}

export async function mistralFetch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${MISTRAL_API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getMistralApiKey()}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data &&
        typeof data === "object" &&
        "error" in data &&
        data.error &&
        typeof data.error === "object" &&
        "message" in data.error &&
        typeof data.error.message === "string" &&
        data.error.message) ||
      `Mistral request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}
