import { GetServerSidePropsContext, type NextPage } from "next";
import { prisma } from "@/server/db";
import Link from "next/link";

interface PageProps {
  success: boolean;
}

const EmailVerificationPage: NextPage<PageProps> = ({ success }) => {
  if (!success) {
    return (
      <>
        <p className="text-lg font-bold lg:text-2xl">Invalid or expired link</p>
        <p className="mt-1 text-brandgray">
          The password reset link is either invalid or expired. Please visit{" "}
          <Link href="/" className="font-semibold text-link">
            sign in
          </Link>
          .
        </p>
      </>
    );
  }

  return (
    <>
      <p className="text-lg font-bold lg:text-2xl">Email verification successful</p>
      <p className="mt-1 text-brandgray">
        Email verification successful. Go back to {" "}
        <Link href="/" className="font-semibold text-link">
          sign in
        </Link>
        .
      </p>
    </>
  );
};

interface PageContext extends GetServerSidePropsContext {
  params: {
    token: string;
  };
}

export async function getServerSideProps(context: PageContext) {
  const now = new Date();
  const { token } = context.params;

  const tokenRecord = await prisma.token.findUnique({
    where: { token },
    select: { expiresAt: true, user: { select: { id: true } } },
  });

  if (!tokenRecord || now > tokenRecord.expiresAt) {
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
