import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { loginInputSchema, registerInputSchema } from "@/utils/schemas/schema";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, firstName, lastName, mobile, password } = input;
      const user = ctx.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password,
          mobile,
        },
      });

      return user;
    }),
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Credentials",
        });
      }

      if (user.password !== password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Credentials",
        });
      }

      return user;
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});
