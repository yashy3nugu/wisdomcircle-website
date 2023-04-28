import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { User } from "@prisma/client";

export const createContext = (opts: CreateNextContextOptions) => {
  return {
    req: opts.req,
    res: opts.res,
    user: null as User | null,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
