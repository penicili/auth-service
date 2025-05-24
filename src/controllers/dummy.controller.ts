import jwt from "jsonwebtoken";
import { SECRET } from "../utils/env";
import { Request, Response } from "express";
import UserModel from "../models/user.model";

export default {
  async dummy(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided", data: null });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, SECRET) as { username: string };
      const user = await UserModel.findOne({ username: decoded.username });
      if (!user) {
        return res.status(404).json({ message: "User not found", data: null });
      }
      return res.status(200).json({
        message: "User data fetched successfully",
        data: {user},
      });
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token", data: null });
    }
  },
};
