import { type NextPage } from "next";
import Head from "next/head";
import { Form, Formik } from "formik";
import FormInput from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

import { api } from "@/utils/api";

const Home: NextPage = () => {
  const context = api.useContext();
  const router = useRouter();

  const users = api.auth.getAll.useQuery();

  const { mutate, isLoading } = api.auth.login.useMutation({
    onSuccess(data) {
      context.auth.user.setData(undefined, data);
    },
    // onError(error) {
      
    // },
    async onSettled(data) {
      if (data) {
        const redirect = (router.query.redirect as string) || '/app';
        await router.replace(redirect);
      }
    },
  })

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Formik
          onSubmit={(values, actions) => {
            const { email, password } = values;
            mutate({
              email,
              password,
            });

            actions.resetForm(); 
          }}
          initialValues={{ email: "", password: "" }}
        >
          <Form>
            <FormInput name="email" type="email" label="Email Address" />
            <FormInput name="password" type="password" label="Password" />

            <Button className="u-w-100">
              {"Login"}
            </Button>
          </Form>
        </Formik>
        <pre>
          {JSON.stringify(users.data)}
        </pre>
      </main>
    </>
  );
};

export default Home;
