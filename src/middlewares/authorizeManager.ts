import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils/env";
import { DecryptedToken } from "../types/express";

const authorizeManager = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ 
      message: "No token provided or token invalid", 
      data: null 
    });
    return;
  }
  
  try {
    // Decode the token
    const decoded = jwt.verify(token, SECRET) as DecryptedToken;
    
    // Check if the user has manager role
    if (decoded.role !== "manager") {
      res.status(403).json({
        message: "Access denied. Manager role required.",
        data: null
      });
      return;
    }
    
    // Add decoded user to request for later use
    req.user = decoded;
    
    // User has manager role, proceed
    next();
  } catch (error) {
    res.status(401).json({ 
      message: "Invalid token", 
      data: null 
    });
    return;
  }
};

export default authorizeManager;