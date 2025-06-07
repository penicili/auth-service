import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

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
  role: Yup.string().oneOf(["manager", "pengemudi", "admin"], "Role is invalid"),
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
    /** 
      #swagger.tags = ['Auth']
      #swagger.summary = 'Registrasi User'
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/RegisterRequest"}}
     */

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
      });      res.status(200).json({
        message: "Registration success",
        data: { result },
      });
      console.log("=== New User Registration ===");
      console.log("User registered:", {
        id: result._id,
        username: result.username,
        email: result.email,
        role: result.role,
        timestamp: new Date().toISOString()
      });
      console.log("=== End of Registration Event ===");
      return;
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });      console.log("=== Registration Error ===");
      console.log("Error:", err.message);
      console.log("Request data:", {
        email: email,
        username: username,
        role: role,
        timestamp: new Date().toISOString()
      });
      console.log("=== End of Registration Error ===");
      return;
    }
  },  async login(req: Request, res: Response) {

    /**
      #swagger.tags = ['Auth']
      #swagger.summary = 'Login User'
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/LoginRequest" }
      }
     */
    const { userIdentifier, password } = req.body;
    if (!userIdentifier || !password) {
      return res
        .status(400)
        .json({ message: "User identifier and password are required", data: null });
    }    try {
      // Cari user berdasarkan username atau email
      const userQuery = {
        $or: [
          { username: userIdentifier },
          { email: userIdentifier }
        ]
      };
      
      const user = await UserModel.findOne(userQuery);
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
      }      // Generate JWT
      const { SECRET } = await import("../utils/env");
      
      // Set expiration to 1 day from now (in seconds since epoch)
      const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours
      
      const token = jwt.sign(
        { 
          username: user.username, 
          email: user.email, 
          role: user.role,
          exp: exp 
        },
        SECRET
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
