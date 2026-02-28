import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

export interface ApiConfig {
  baseURL: string;
  timeout: number;
}

const axiosClient = axios.create();

export function initializeAxios(config: ApiConfig) {
  axiosClient.defaults.baseURL = config.baseURL;
  axiosClient.defaults.timeout = config.timeout;
  axiosClient.defaults.headers.Accept = "application/json";
  axiosClient.defaults.withCredentials = true;
}

axiosClient.interceptors.request.use((config) => {
  if (config.params) {
    const cleanParams: Record<string, unknown> = {};
    Object.entries(config.params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        cleanParams[key] = value;
      }
    });
    config.params = cleanParams;
  }
  return config;
});

export function setAuthHeader(_token: string) {}
export function removeAuthHeader() {}

export interface AxiosRequestConfigType extends AxiosRequestConfig {
  url: string;
}

async function AxiosClientRequest<T = unknown>(
  config: AxiosRequestConfigType
): Promise<T> {
  const response: AxiosResponse<T> = await axiosClient(config);
  return response.data;
}

export const GET = <T = unknown>(config: AxiosRequestConfigType) =>
  AxiosClientRequest<T>({ method: "GET", ...config });
export const POST = <T = unknown>(config: AxiosRequestConfigType) =>
  AxiosClientRequest<T>({ method: "POST", ...config });
export const PUT = <T = unknown>(config: AxiosRequestConfigType) =>
  AxiosClientRequest<T>({ method: "PUT", ...config });
export const PATCH = <T = unknown>(config: AxiosRequestConfigType) =>
  AxiosClientRequest<T>({ method: "PATCH", ...config });
export const DELETE = <T = unknown>(config: AxiosRequestConfigType) =>
  AxiosClientRequest<T>({ method: "DELETE", ...config });

export default axiosClient;
