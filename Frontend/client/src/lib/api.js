const rawApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const withoutTrailingCommas = rawApiUrl.replace(/,+$/, "");

// Remove trailing slashes to avoid malformed URLs like //api/...
export const API_BASE_URL = withoutTrailingCommas.replace(/\/+$/, "");

export const apiUrl = (path = "") => {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
