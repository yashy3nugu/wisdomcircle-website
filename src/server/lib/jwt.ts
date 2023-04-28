import * as jwt from "jsonwebtoken";
import type { NextApiResponse, NextApiRequest } from "next";
import { Cookie } from "next-cookie";
import type { User } from "@prisma/client";

export const signToken = (
  payload: { user: User },
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = jwt.sign({ id: payload.user.id }, process.env.JWT_SECRET!, {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN!) * 60 * 60,
  });

  const cookie = Cookie.fromApiRoute(req, res);

  cookie.set("wisdomcircle", token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    maxAge: parseInt(process.env.JWT_EXPIRES_IN!) * 60 * 60,
    path: "/",
  });

  return token;
};

export const decodeToken = (token: string) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  return payload;
};

