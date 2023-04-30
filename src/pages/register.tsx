import { type NextPage } from "next";
import { Form, Formik } from "formik";
import FormInput from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/password-input";
import Link from "next/link";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { registerInputSchema } from "@/utils/schemas/schema";
import { api } from "@/utils/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import MobileInput from "@/components/ui/mobile-input";

const Register: NextPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string>("");
  const { mutateAsync } = api.auth.register.useMutation({
    onSuccess(data) {
      setUnverifiedEmail(data.email);
      setOpen(true);

      // context.auth.user.setData(undefined, data);
    },
    // onError(error) {

    // },
  });

  return (
    <>
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

      <p className="text-lg font-bold lg:text-2xl">Create an account</p>
      <p className="mt-1 text-brandgray">
        Already have an account?{" "}
        <Link href="/" className="font-semibold text-link">
          Sign In
        </Link>
      </p>
      <Formik
        onSubmit={async (values, actions) => {
          try {
            await mutateAsync(values);
          } catch (err) {
            const error = err as any;
            console.log({ ...error });
            if (error.data.code === "BAD_REQUEST") {
              if (error.shape.message.includes("email")) {
                actions.setFieldError(
                  "email",
                  "Sorry! This email is already in use"
                );
              } else if (error.shape.message.includes("mobile")) {
                actions.setFieldError(
                  "mobile",
                  "Sorry! This mobile number is already in use"
                );
              }
            }
          }
        }}
        validationSchema={toFormikValidationSchema(registerInputSchema)}
        initialValues={{
          email: "",
          password: "",
          mobile: "",
          firstName: "",
          lastName: "",
          countryCode: "+91",
        }}
      >
        {({ isSubmitting, isValid, dirty }) => {
          return (
            <Form className="mt-7 w-full">
              <FormInput
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <FormInput name="lastName" type="text" placeholder="Last Name" />
              <FormInput
                name="email"
                type="email"
                placeholder="Email Address"
              />
              {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
              <MobileInput
                placeholder="Mobile Number"
                countryName="countryCode"
                numberName="mobile"
              />

              <PasswordInput
                name="password"
                placeholder="Password"
                helper="Password must be at least 8 characters"
              />
              <p className="mt-6 text-xs">
                By clicking Sign Up you are indicating that you have read and
                acknowledged the{" "}
                <Link className="font-semibold text-link" href="/404">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link className="font-semibold text-link" href="/404">
                  Privacy Notice
                </Link>
              </p>

              <Button
                loading={isSubmitting}
                disabled={isSubmitting || !isValid || !dirty}
                className="mt-6 w-full"
              >
                Sign Up
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Register;
