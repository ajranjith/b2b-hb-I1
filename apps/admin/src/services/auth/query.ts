import { createQueryKeys } from "@lukemorales/query-key-factory";

export const authQueries = createQueryKeys("auth", {
  me: null,
  profile: null,
});
