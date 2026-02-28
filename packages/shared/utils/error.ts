import type { AxiosError } from "axios";
import type { IErrorResponse } from "../contracts";

export function getErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred";
  if (typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<IErrorResponse>;
    const data = axiosError.response?.data;
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors[0];
    }
    if (axiosError.message) return axiosError.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export function getAllErrorMessages(error: unknown): string[] {
  if (!error) return ["An unexpected error occurred"];
  if (typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<IErrorResponse>;
    const data = axiosError.response?.data;
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors;
    }
  }
  return [getErrorMessage(error)];
}

export function getFieldErrors(
  error: unknown
): Record<string, string[]> | undefined {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<IErrorResponse>;
    const data = axiosError.response?.data;
    if (data?.fields) return data.fields;
  }
  return undefined;
}

export function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<IErrorResponse>;
    return axiosError.response?.data?.code;
  }
  return undefined;
}
