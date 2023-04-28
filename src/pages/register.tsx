import { type NextPage } from "next";
import Head from "next/head";
import { Form, Formik } from "formik";
import FormInput from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import PasswordInput from "@/components/ui/password-input";
import Link from "next/link";

const Register: NextPage = () => {
  const router = useRouter();

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
        initialValues={{ email: "", password: "" }}
      >
        <Form className="mt-7 w-full">
          <FormInput name="firstName" type="text" placeholder="First Name" />
          <FormInput name="lastName" type="text" placeholder="Last Name" />
          <FormInput name="email" type="email" placeholder="Email Address" />
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

      {/* <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <Formik
          onSubmit={(values, actions) => {
            const { email, password, firstName, lastName, mobile } = values;
            mutate({
              email,
              password,
              firstName,
              lastName,
              mobile,
            });

            //actions.resetForm();
          }}
          initialValues={{
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            mobile: "",
          }}
        >
          <Form>
            <FormInput name="firstName" type="text" label="First Name" />
            <FormInput name="lastName" type="text" label="Last Name" />
            <FormInput name="email" type="email" label="Email Address" />
            <FormInput name="mobile" type="text" label="Mobile Number" />
            <FormInput name="password" type="password" label="Password" />

            <Button>{"Register"}</Button>
          </Form>
        </Formik>
      </main> */}
    </>
  );
};

export default Register;
