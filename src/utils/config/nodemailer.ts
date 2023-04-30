import { createTransport } from "nodemailer";

const user = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;


export const transporter = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user,
    pass
  },
});