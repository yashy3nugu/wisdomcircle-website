import { type NextPage } from "next";
import Head from "next/head";
import { Form, Formik } from "formik";
import FormInput from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/password-input";
import Link from "next/link";
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { registerInputSchema } from "@/utils/schemas/schema";

const Register: NextPage = () => {

  return (
    <>
      <p className="text-lg font-bold lg:text-2xl">Create an account</p>
      <p className="mt-1 text-brandgray">
        Already have an account?{" "}
        <Link href="/" className="font-semibold text-link">
          Sign In
        </Link>
      </p>
      <Formik
        onSubmit={(values, actions) => {
          actions.resetForm();
        }}
        validationSchema={toFormikValidationSchema(registerInputSchema)}
        initialValues={{ email: "", password: "", mobile: "", firstName: "", lastName: "" }}
      >
        <Form className="mt-7 w-full">
          <FormInput name="firstName" type="text" placeholder="First Name" />
          <FormInput name="lastName" type="text" placeholder="Last Name" />
          <FormInput name="email" type="email" placeholder="Email Address" />
          <FormInput name="mobile" type="text" placeholder="Mobile Number" />
          <PasswordInput name="password" placeholder="Password" />
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

          <Button className="mt-6 w-full">Sign Up</Button>
        </Form>
      </Formik>
    </>
  );
};

export default Register;
