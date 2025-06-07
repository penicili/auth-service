import jwt from "jsonwebtoken";
import { SECRET } from "../utils/env";
import { Request, Response, NextFunction } from "express";
import { DecryptedToken } from "../types/express";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ message: "No token provided or token invalid", data: null });
    return; // Just return without next() to stop the request chain
  }
  
  try {
    const decoded = jwt.verify(token, SECRET) as DecryptedToken;
    
    // Add the decoded token to the request object
    req.user = decoded;
    
    next();
  }
  catch(error) {
    res.status(401).json({ message: "Invalid token", data: null });
    return; // Just return without next() to stop the request chain
  }
};

export default authenticateToken;