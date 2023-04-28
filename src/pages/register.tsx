import { type NextPage } from "next";
import Head from "next/head";
import { Form, Formik } from "formik";
import FormInput from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/password-input";
import Link from "next/link";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { registerInputSchema } from "@/utils/schemas/schema";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

const Register: NextPage = () => {
  const context = api.useContext();
  const router = useRouter();

  const { mutateAsync } = api.auth.register.useMutation({
  
    
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
            await mutateAsync(
            values
          )
          }
          catch (err) {
            const error = err as any;
            console.log({ ...error });
            if(error.shape.message.includes('email')) {
              actions.setFieldError(
                  "email",
                  "Sorry! This email is already in use"
                );
            }
            else if(error.shape.message.includes('mobile')) {
              actions.setFieldError(
                "mobile",
                "Sorry! This mobile number is already in use"
              );
            }
          }
          
          // actions.resetForm();
        }}
        validationSchema={toFormikValidationSchema(registerInputSchema)}
        initialValues={{
          email: "",
          password: "",
          mobile: "",
          firstName: "",
          lastName: "",
        }}
      >
        {({ isSubmitting, isValid }) => {
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
              <FormInput
                name="mobile"
                type="text"
                placeholder="Mobile Number"
              />
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

              <Button
                disabled={isSubmitting || !isValid}
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
