import { type NextPage } from "next";
import { Form, Formik } from "formik";
import FormInput from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { sendPasswordRecoveryMailInputSchema } from "@/utils/schemas/schema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

const ForgotPassword: NextPage = () => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const { mutateAsync } = api.auth.sendPasswordRecoveryMail.useMutation({
    onSuccess(data) {
      setOpen(true);
    },
    // onError(error) {

    // },
    onSettled(data) {
      if (data) {
      }
    },
  });
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <p>Thank you! We have sent you a link to reset your password. Please check your email.</p>
        </DialogContent>
      </Dialog>

      <p className="text-lg font-bold lg:text-2xl">Forgot password</p>
      <p className="mt-1 text-brandgray">
        We&apos;ll send you a reset password link to your registered email
        address
      </p>
      <Formik
        onSubmit={async (values, actions) => {
          const { email } = values;

          try {
            await mutateAsync({
              email,
            });
            actions.resetForm()
          } catch (err) {
            const error = err as any;

            if (error.data.code === "NOT_FOUND") {
              actions.setFieldError(
                "email",
                "Sorry! This email is not registered"
              );
            }
          }
        }}
        initialValues={{ email: "" }}
        validationSchema={toFormikValidationSchema(
          sendPasswordRecoveryMailInputSchema
        )}
      >
        {({ isSubmitting, isValid, dirty }) => {
          return (
            <Form className="mt-7 w-full">
              <FormInput
                name="email"
                type="email"
                placeholder="Registered Email"
              />

              <Button
                disabled={isSubmitting || !isValid || !dirty}
                className="mt-6 w-full"
              >
                Email me a recovery link
              </Button>
              <Button
                type="button"
                onClick={() => {
                  void (async () => {
                    await router.push("/");
                  })();
                }}
                variant={"outline"}
                className="mt-3 w-full"
              >
                Return to sign in
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ForgotPassword;
