const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export async function getQlikConfig() {
  return request("/api/qlik/config");
}

export async function pingQlik() {
  return request("/api/qlik/ping");
}

export async function listQlikItems() {
  return request("/api/qlik/items");
}

export async function listQlikApps() {
  return request("/api/qlik/apps");
}

export default {
  getQlikConfig,
  pingQlik,
  listQlikItems,
  listQlikApps,
};
