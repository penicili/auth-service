import jwt from "jsonwebtoken";
import { SECRET } from "../utils/env";
import { Request, Response, NextFunction } from "express";

interface DecryptedToken {
  username: string;
  email: string;
  role: string;
  exp: number;
}

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: DecryptedToken;
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ message: "No token provided or token invalid", data: null });
    return; // Just return without next() to stop the request chain
  }
  
  try {
    const decoded = jwt.verify(token, SECRET) as DecryptedToken;
    
    if (decoded.exp < Date.now() / 1000) {
      res.status(401).json({ message: "Token expired", data: null });
      return; // Just return without next() to stop the request chain
    }
    
    // Store user info in request object
    req.user = decoded;
    
    // Continue to the next middleware or controller
    next();
  }
  catch(error) {
    res.status(401).json({ message: "Invalid token", data: null });
    return; // Just return without next() to stop the request chain
  }
};

export default authenticateToken;