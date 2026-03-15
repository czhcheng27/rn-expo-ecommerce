const API_BASE_PATH = "/api";

function normalizeApiPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildApiPath(path: string) {
  return `${API_BASE_PATH}${normalizeApiPath(path)}`;
}

type ApiPayload = Record<string, unknown> | string | null;

function buildHeaders(init: RequestInit) {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

async function parseResponse(response: Response): Promise<ApiPayload> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

function getErrorMessage(payload: ApiPayload, status: number) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const message =
      ("message" in payload && payload.message) ||
      ("error" in payload && payload.error);

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return `Request failed with status ${status}`;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(buildApiPath(path), {
    ...init,
    credentials: init.credentials || "include",
    headers: buildHeaders(init),
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, response.status));
  }

  return payload as T;
}
