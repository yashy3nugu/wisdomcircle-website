import { Button } from "@/components/ui/button";
import { type NextPage } from "next";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const ForgotPassword: NextPage = () => {
  const router = useRouter();

  const { isLoading, data } = api.auth.user.useQuery();

  useEffect(() => {
    (async () => {
      if (!isLoading && !data) {
        await router.replace("/");
      }
    })();
  },[data,isLoading,router])

  const { mutateAsync } = api.auth.logout.useMutation();

  if (isLoading) {
    return <Loader2 className="animate-spin mx-auto"/>
  }

  return (
    <>
      <p className="text-lg font-bold lg:text-2xl">Welcome to WisdomCircle</p>
      <pre>{JSON.stringify(data, null, 4)}</pre>
      <Button
        type="button"
        onClick={() => {
          void (async () => {
            await mutateAsync();
            await router.replace("/");
          })();
        }}
        variant={"outline"}
        className="mt-3 w-full"
      >
        Log out
      </Button>
    </>
  );
};

export default ForgotPassword;
