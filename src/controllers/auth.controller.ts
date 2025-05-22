import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";

// type definition
// type untuk request body register
type TRegisterRequest = {
  fullName: string;
  email: string;
  username: string;
  role: string;
  password: string;
  confirmPassword: string;
};

// validasi dengan Yup
const registerValidationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  username: Yup.string().required("Username is required"),
  role: Yup.string().oneOf(["admin", "pengemudi", "user"], "Role is invalid"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .test(
      "one-uppercase-letter",
      "Password must contain at least one uppercase letter",
      (value) => {
        if (!value) return false;
        // regex
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      }
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default {
  // controller untuk register
  async register(req: Request, res: Response) {
    // destructure body dari request
    const { fullName, email, username, role, password, confirmPassword } =
      req.body as TRegisterRequest;
    // validasi request body
    try {
      await registerValidationSchema.validate({
        fullName,
        email,
        username,
        role,
        password,
        confirmPassword,
      });
      // buat User pakai model User
      const result = await UserModel.create({
        fullName,
        email,
        username,
        role,
        password,
      });
      res.status(200).json({
        message: "Registration success",
        data: { result },
      });
      return;
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
      return;
    }
  },
};
