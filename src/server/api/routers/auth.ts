import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { loginInputSchema, registerInputSchema } from "@/utils/schemas/schema";
import { TRPCError } from "@trpc/server";
import * as jwt from "@/server/lib/jwt";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, firstName, lastName, mobile, password } = input;
      const user = await ctx.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password,
          mobile,
        },
      });

      jwt.signToken({ user }, ctx.req, ctx.res);

      return user;
    }),
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { emailOrMobile, password } = input;

      const user = await ctx.prisma.user.findFirst({
        where: {
          OR: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid email or mobile",
        });
      }

      if (user.password !== password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid Credentials",
        });
      }

      jwt.signToken({ user }, ctx.req, ctx.res);

      return user;
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  user: publicProcedure.query(({ ctx }) => {
    return ctx.user || null;
  }),
});
