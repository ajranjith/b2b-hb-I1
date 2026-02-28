"use client";

import {
  QueryClient as ReactQueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/react-query";
import { type FC, type PropsWithChildren, useState } from "react";

interface QueryClientProps extends PropsWithChildren {
  config: QueryClientConfig;
}

const QueryClient: FC<QueryClientProps> = ({ children, config }) => {
  const [queryClient] = useState(() => new ReactQueryClient(config));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export { QueryClient };
