export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

export const setCookie = (
  name: string,
  value: string,
  options: {
    domain?: string;
    path?: string;
    maxAge?: number;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  } = {}
): void => {
  if (typeof document === "undefined") return;
  const { domain, path = "/", maxAge, secure = true, sameSite = "Lax" } = options;
  let cookie = `${name}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}`;
  if (domain) cookie += `; domain=${domain}`;
  if (maxAge) cookie += `; max-age=${maxAge}`;
  if (secure) cookie += `; secure`;
  document.cookie = cookie;
};

export const removeCookie = (name: string, domain?: string): void => {
  if (typeof document === "undefined") return;
  const domainPart = domain ? `; domain=${domain}` : "";
  document.cookie = `${name}=; path=/${domainPart}; max-age=0`;
};
