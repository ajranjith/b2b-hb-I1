import type {
  UseQueryOptions,
  UseQueryResult,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { IErrorResponse } from "./index";

export type UseQueryType<R> = (
  options?: UseQueryOptions<unknown, unknown, R, readonly unknown[]>
) => UseQueryResult<R>;

export type UseMutationType<TResponse, TRequest> = (
  options?: UseMutationOptions<
    TResponse,
    AxiosError<IErrorResponse>,
    TRequest,
    unknown
  >
) => UseMutationResult<
  TResponse,
  AxiosError<IErrorResponse>,
  TRequest,
  unknown
>;

export type UseQueryDataType<R, D> = (
  data: D,
  options?: UseQueryOptions<unknown, unknown, R, readonly unknown[]>
) => UseQueryResult<R>;
