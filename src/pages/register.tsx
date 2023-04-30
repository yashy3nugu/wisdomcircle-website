import { type NextPage } from "next";
import { Field, Form, Formik } from "formik";
import FormInput from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/password-input";
import Link from "next/link";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { registerInputSchema } from "@/utils/schemas/schema";
import { api } from "@/utils/api";
import { Country } from "@/data/countries";
import CountryData from "@/data/countries.json";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import MobileInput from "@/components/ui/mobile-input";

const Register: NextPage = () => {
  const countries: Country[] = CountryData;
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
        {({ isSubmitting, isValid, dirty, values, handleChange }) => {
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
              {/* <div className="flex gap-3">
                <Field
                  className="flex h-12 w-20 rounded-md border-2 bg-transparent  py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
                  name="countryCode"
                  component="select"
                >
                  {countries.map(({ code, dial_code }, idx) => (
                    <option className="" value={dial_code} key={idx}>
                      {`${dial_code}`}
                    </option>
                  ))}
                </Field>

                <FormInput
                  name="mobile"
                  type="text"
                  placeholder="Mobile Number"
                  className="w-full"
                />
              </div> */}

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
