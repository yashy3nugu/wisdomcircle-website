import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { registerInputSchema } from "@/utils/schemas/schema";

export const authRouter = createTRPCRouter({
  hello: publicProcedure
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
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});
