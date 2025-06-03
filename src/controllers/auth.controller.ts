import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encrypt";
import jwt from "jsonwebtoken";

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

export const authController = {
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

  async login(req: Request, res: Response) {
    const { userIdentifier, password } = req.body;
    if (!userIdentifier || !password) {
      return res
        .status(400)
        .json({ message: "User identifier and password are required", data: null });
    }
    try {
      // Cari user berdasarkan username atau email
      const user = await UserModel.findOne({
        $or: [
          { username: userIdentifier },
          { email: userIdentifier }
        ]
      });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username/email or password", data: null });
      }
      // Cek password
      const encryptedPassword = encrypt(password);
      if (user.password !== encryptedPassword) {
        return res
          .status(401)
          .json({ message: "Invalid username/email or password", data: null });
      }
      // Generate JWT
      const { SECRET } = await import("../utils/env");
      const token = jwt.sign(
        { username: user.username, email: user.email, role: user.role },
        SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({
        message: "Login success",
        data: { token },
      });
    } catch (error) {
      const err = error as unknown as Error;
      return res.status(500).json({ message: err.message, data: null });
    }
  },
};
