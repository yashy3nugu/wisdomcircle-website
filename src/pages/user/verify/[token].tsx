import { GetServerSidePropsContext, type NextPage } from "next";
import { api } from "@/utils/api";
import { prisma } from "@/server/db";

interface PageProps {
  success: boolean;
}

const EmailVerificationPage: NextPage<PageProps> = ({ success }) => {
  console.log(success);
    if (!success) {
        return <p>invalid token</p>
    }
    
    return <p>return to sign in</p>
};

interface PageContext extends GetServerSidePropsContext {
    params: {
        token: string
    }
}


export async function getServerSideProps(context: PageContext) {
  console.log("server side props ran")
  const now = new Date();
  const { token } = context.params;

  const tokenRecord = await prisma.token.findUnique({
    where: { token },
    select: { expiresAt: true, user: { select: { id: true } } },
  });

  if (!tokenRecord || now > tokenRecord.expiresAt) {
    console.log("falsei")
    return {
      props: {
        success: false,
      },
    };
  }

  await prisma.user.update({
    where: { id: tokenRecord.user.id },
    data: { verified: true },
  });

  await prisma.token.delete({
    where: { token },
  });

  return {
    props: {
      success: true,
    }, 
  };
}
export default EmailVerificationPage;
