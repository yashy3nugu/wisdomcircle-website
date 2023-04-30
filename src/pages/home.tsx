import { Button } from "@/components/ui/button";
import { type NextPage } from "next";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

const ForgotPassword: NextPage = () => {
  const router = useRouter();
  const {mutateAsync} = api.auth.logout.useMutation()

  return (
    <>
      <p className="text-lg font-bold lg:text-2xl">Welcome to WisdomCircle</p>
      <Button
        type="button"
        onClick={() => {
          void (async () => {
            await mutateAsync();
            await router.replace("/")
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
