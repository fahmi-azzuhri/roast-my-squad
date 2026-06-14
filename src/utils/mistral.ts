const MISTRAL_API_URL = "https://api.mistral.ai/v1";

export function getMistralApiKey() {
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Mistral API key. Set VITE_MISTRAL_API_KEY in .env and restart the dev server.",
    );
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
      response.status === 401
        ? "Mistral API rejected the key (401). Check VITE_MISTRAL_API_KEY in .env, make sure it is an active Mistral key, and restart the dev server."
        : (data &&
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
