const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

export async function getProfileDashboard() {
  return request("/api/profile/dashboard");
}

export async function getProfileInsights() {
  return request("/api/profile/dashboard/insights");
}

export async function getEconomicChurn() {
  return request("/api/profile/dashboard/economic-churn");
}

export async function getEconomicChurnActions() {
  return request("/api/profile/dashboard/economic-churn/actions");
}

export async function trackProfileEvent(payload) {
  return request("/api/profile/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProfileDashboard(patch) {
  return request("/api/profile/dashboard", {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export default {
  getProfileDashboard,
  getProfileInsights,
  getEconomicChurn,
  getEconomicChurnActions,
  trackProfileEvent,
  updateProfileDashboard,
};
