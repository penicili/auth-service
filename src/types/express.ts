// This file extends the Express namespace with our custom types

// Define the DecryptedToken interface once
export interface DecryptedToken {
  username: string;
  email: string;
  role: string;
  exp: number;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: DecryptedToken;
    }
  }
}
