import { GetServerSidePropsContext, type NextPage } from "next";
import { api } from "@/utils/api";
import { prisma } from "@/server/db";
import { Form, Formik } from "formik";
import PasswordInput from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { resetPasswordFormSchema } from "@/utils/schemas/schema";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface PageProps {
  success: boolean;
  token: string;
}

const PasswordResetPage: NextPage<PageProps> = ({ success, token }) => {
  const { toast } = useToast();
  const [redirect, setRedirect] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const navigateToOtherPage = async () => {
      await router.replace("/");
    };
    if (redirect) {
      const timer = setTimeout(() => {
        void navigateToOtherPage();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [redirect, router]);

  const { mutateAsync } = api.auth.resetPassword.useMutation({
    onSuccess(data) {
      toast({
        description: "Your password is reset successfully",
      });
      setRedirect(true);
    },
    onError(error) {
      toast({
        description: "Error. Please try again",
        variant: "destructive",
      });
    },
    onSettled(data) {
      if (data) {
      }
    },
  });

  if (!success) {
    return (
      <>
        <p className="text-lg font-bold lg:text-2xl">Invalid or expired link</p>
        <p className="mt-1 text-brandgray">
          The password reset link is either invalid or expired. Please visit{" "}
          <Link href="/forgotpassword" className="font-semibold text-link">
            forgot password
          </Link>
          .
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
        onSubmit={async (values, actions) => {
          const { password } = values;
          await mutateAsync({
            password,
            token,
          });
        }}
        validationSchema={toFormikValidationSchema(resetPasswordFormSchema)}
        initialValues={{ password: "", confirmPassword: "" }}
      >
        {({ isSubmitting, isValid, dirty }) => {
          return (
            <Form className="mt-7 w-full">
              <PasswordInput
                name="password"
                placeholder="New Password"
                helper="Password must be at least 8 characters"
              />
              <div className="my-4"></div>
              <PasswordInput
                name="confirmPassword"
                placeholder="Confirm New Password"
                helper="Both passwords must match!"
              />

              <Button
                disabled={isSubmitting || !isValid || !dirty}
                loading={isSubmitting}
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

export async function getServerSideProps(context: PageContext) {
  const now = new Date();
  const { token } = context.params;

  const tokenRecord = await prisma.token.findUnique({
    where: { token },
    select: { expiresAt: true, user: { select: { id: true } } },
  });

  if (!tokenRecord || now > tokenRecord.expiresAt) {
    return {
      props: {
        success: true,
        token,
      },
    };
  }

  return {
    props: {
      success: true,
      token,
    },
  };
}
export default PasswordResetPage;
