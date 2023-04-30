import { type NextPage } from "next";
import { Form, Formik } from "formik";
import FormInput from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

import { api } from "@/utils/api";
import PasswordInput from "@/components/ui/password-input";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as yup from "yup";
import validator from "validator";

const schema = yup.object().shape({
  emailOrMobile: yup
    .string()
    .required("Please provide your email or phone number")
    .test(
      "emailOrMobile",
      "Please provide a valid email address or mobile number",
      function (value) {
        if (!value) return true;
        if (value.includes("@") || value.includes(".")) {
          return (
            validator.isEmail(value) ||
            this.createError({
              message: "Please provide a valid email address",
              path: "emailOrMobile",
            })
          );
        } else {
          return (
            validator.isMobilePhone(value, "any", { strictMode: true }) ||
            this.createError({
              message: "Please provide a valid mobile number",
              path: "emailOrMobile",
            })
          );
        }
      }
    ),

  password: yup.string().required("Please provide your password"),
});

// import { Dialog, Overlay, Portal, Content, Root } from "@radix-ui/react-dialog";

const Home: NextPage = () => {
  const context = api.useContext();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string>("");

  const { mutateAsync } = api.auth.login.useMutation({
    onSuccess(data) {
      context.auth.user.setData(undefined, data);
    },
    // onError(error) {

    // },
    async onSettled(data) {
      if (data) {
        const redirect = (router.query.redirect as string) || "/home";
        await router.replace(redirect);
      }
    },
  });

  return (
    <>
      {/* <button onClick={handleOpen}>Open Dialog</button> */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Verify Email</DialogTitle>
          </DialogHeader>
          <p>
            Please verify your account. We have sent an email to{" "}
            <span className="font-semibold">{unverifiedEmail}</span>. If you are
            unable to find the verification email please contact us at:{" "}
            <span className="font-semibold">+91-9380644532</span>{" "}
          </p>
        </DialogContent>
      </Dialog>

      <p className="text-lg font-bold lg:text-2xl">Sign in to WisdomCircle</p>
      <p className="mt-1 text-brandgray">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-link">
          Sign Up
        </Link>
      </p>
      <Formik
        validationSchema={schema}
        onSubmit={async (values, actions) => {
          const { emailOrMobile, password } = values;

          try {
            await mutateAsync({
              emailOrMobile,
              password,
            });
          } catch (err) {
            const error = err as any;
            console.log({ ...error });

            if (error.data.code === "NOT_FOUND") {
              if (emailOrMobile.includes("@")) {
                actions.setFieldError(
                  "emailOrMobile",
                  "Sorry! This email is not registered"
                );
              } else {
                actions.setFieldError(
                  "emailOrMobile",
                  "Sorry! This mobile number is not registered"
                );
              }
            } else if (error.data.code === "UNAUTHORIZED") {
              if (
                error.shape.message.startsWith("User has not verified email")
              ) {
                const email = error.shape.message.match(
                  /[^ ]+@[^ ]+/
                ) as string;
                setUnverifiedEmail(email);
                setOpen(true);
              } else {
                actions.setFieldError(
                  "password",
                  "Sorry! Password entered is incorrect"
                );
              }
            }
          }
        }}
        initialValues={{ emailOrMobile: "", password: "" }}
      >
        {({ isValid, isSubmitting, dirty }) => {
          return (
            <Form className="mt-7 w-full">
              <FormInput
                name="emailOrMobile"
                type="text"
                placeholder="Email or Mobile Number"
              />
              <PasswordInput name="password" placeholder="Password" />
              <div className="flex justify-end">
                <Link
                  href="/forgotpassword"
                  className="text-sm font-semibold text-link"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                disabled={isSubmitting || !isValid || !dirty}
                loading={isSubmitting}
                className="mt-6 w-full"
              >
                Sign In
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Home;
