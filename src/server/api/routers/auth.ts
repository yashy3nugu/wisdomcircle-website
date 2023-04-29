import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  loginInputSchema,
  registerInputSchema,
  resetPasswordSchema,
  sendPasswordRecoveryMailInputSchema,
} from "@/utils/schemas/schema";
import { TRPCError } from "@trpc/server";
import * as jwt from "@/server/lib/jwt";
import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from "nodemailer";
import bcrypt from "bcrypt";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerInputSchema)
    .mutation(async ({ input, ctx }) => {
      // const { email } = input;

      const { email, firstName, lastName, mobile, password } = input;
      // create user

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await ctx.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          mobile,
        },
      });

      // create token and expiration
      const token = uuidv4();
      const expirationDate = DateTime.now().plus({ minutes: 10 }).toJSDate();

      await ctx.prisma.token.create({
        data: {
          token,
          expiresAt: expirationDate,
          userId: user.id,
        },
      });

      const testAccount = await createTestAccount();

      const transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      //TODO: remove later
      console.log("Token: %s", token);

      const info = await transporter.sendMail({
        from: '"WisdomCircle" <onboarding@wisdomcircle.com>',
        to: email,
        subject: "Welcome to WisdomCircle!",
        text: token,
        html: `<p>To activate your account please follow this link: <a target="_" href="${ctx
          .req.headers.host!}/user/verify/${token}">${ctx.req.headers
          .host!}/verify/token </a></p>`,
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", getTestMessageUrl(info));

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

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid Credentials",
        });
      }

      if (!user.verified) {
        const token = uuidv4();
        const expirationDate = DateTime.now().plus({ minutes: 10 }).toJSDate();

        await ctx.prisma.token.create({
          data: {
            token,
            expiresAt: expirationDate,
            userId: user.id,
          },
        });

        const testAccount = await createTestAccount();

        const transporter = createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, 
          auth: {
            user: testAccount.user, 
            pass: testAccount.pass, 
          },
        });

        const info = await transporter.sendMail({
          from: '"WisdomCircle" <onboarding@wisdomcircle.com>',
          to: user.email,
          subject: "Welcome to WisdomCircle!",
          text: token,
          html: `<p>To activate your account please follow this link: <a target="_" href="${ctx
            .req.headers.host!}/user/verify/${token}">${ctx.req.headers
            .host!}/verify/token </a></p>`,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", getTestMessageUrl(info));

        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `User has not verified email: ${user.email}`,
        });
      }

      jwt.signToken({ user }, ctx.req, ctx.res);

      return user;
    }),

  sendPasswordRecoveryMail: publicProcedure
    .input(sendPasswordRecoveryMailInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { email } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid email",
        });
      }

      const token = uuidv4();
      const expirationDate = DateTime.now().plus({ minutes: 10 }).toJSDate();

      await ctx.prisma.token.create({
        data: {
          token,
          expiresAt: expirationDate,
          userId: user.id,
        },
      });

      const testAccount = await createTestAccount();

      const transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user, 
          pass: testAccount.pass, 
        },
      });
      //TODO: remove later
      console.log("Token: %s", token);

      const info = await transporter.sendMail({
        from: '"WisdomCircle" <onboarding@wisdomcircle.com>', 
        to: email, 
        subject: "Reset password of your WisdomCircle account", 
        text: token, 
        html: `<p>To reset your password please follow this link: <a target="_" href="${ctx
          .req.headers.host!}/user/reset/${token}">${ctx.req.headers
          .host!}/users/reset </a></p>`, // html body
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", getTestMessageUrl(info));

      return { success: true };
    }),

  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { password, token } = input;

      const tokenRecord = await ctx.prisma.token.findUnique({
        where: { token: token },
        select: { userId: true },
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      await ctx.prisma.user.update({
        where: { id: tokenRecord?.userId },
        data: { password: hashedPassword },
      });

      await ctx.prisma.token.delete({
        where: { token },
      });

      return true;
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  user: publicProcedure.query(({ ctx }) => {
    return ctx.user || null;
  }),
});
