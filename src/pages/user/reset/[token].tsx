import { GetServerSidePropsContext, type NextPage } from "next";
import { api } from "@/utils/api";
import { prisma } from "@/server/db";
import { Form, Formik } from "formik";
import PasswordInput from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { updatePasswordFormSchema } from "@/utils/schemas/schema";

interface PageProps {
  success: boolean;
}

const PasswordResetPage: NextPage<PageProps> = ({ success }) => {
  if (!success) {
    return (
      <>
        <p className="text-lg font-bold lg:text-2xl">Invalid or expired link</p>
        <p className="mt-1 text-brandgray">
          The password reset link is either invalid or expired. Please visit <Link href="/forgotpassword" className="font-semibold text-link">
            forgot password
        </Link>.
        </p>
      </>
    );
  }

  return (
    <>
      <p className="text-lg font-bold lg:text-2xl">Forgot password</p>
      <p className="mt-1 text-brandgray">
        Enter a new password you haven&apos;t used before
      </p>
      <Formik
        onSubmit={(values, actions) => {
          actions.resetForm();
        }}
        validationSchema={toFormikValidationSchema(updatePasswordFormSchema)}
        initialValues={{ password: "", confirmPassword: "" }}
      >
        {({ isSubmitting, isValid }) => {
          return (
            <Form className="mt-7 w-full">
              <PasswordInput name="password" placeholder="New Password" />
              <PasswordInput
                name="confirmPassword"
                placeholder="Confirm New Password"
              />

              <Button
                disabled={isSubmitting || !isValid}
                type="submit"
                className="mt-6 w-full"
              >
                Reset Password
              </Button>
            </Form>
          );
        }}
        
      </Formik>
    </>
  );
};

interface PageContext extends GetServerSidePropsContext {
  params: {
    token: string;
  };
}

export function getServerSideProps(context: PageContext) {
  //   const now = new Date();
  //   const { token } = context.params;

  //   const tokenRecord = await prisma.token.findUnique({
  //     where: { token },
  //     select: { expiresAt: true, user: { select: { id: true } } },
  //   });

  //   if (!tokenRecord || now > tokenRecord.expiresAt) {
  //     return {
  //       props: {
  //         success: false,
  //       },
  //     };
  //   }

  // //   await prisma.user.update({
  // //     where: { id: tokenRecord.user.id },
  // //     data: { verified: true },
  // //   });

  //   await prisma.token.delete({
  //     where: { token },
  //   });

  return {
    props: {
      success: true,
    },
  };
}
export default PasswordResetPage;
