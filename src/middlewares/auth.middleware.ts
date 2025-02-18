import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { isBlacklisted } from "../utils/tokenBlacklist";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (!req.headers.authorization) {
      res.status(401).json({ message: "Authorization header missing" });
      return;
    }
    token = req.headers.authorization.split(" ")[1];
    const jwt_secret: string | undefined = process.env.JWT_SECRET;
    if (!jwt_secret) {
      res.status(401).json({ message: "JWT_SECRET is missing" });
      return;
    }
    if (isBlacklisted(token)) {
      res.status(401).json({
        status: "error",
        message: "Token has been invalidated.",
      });
      return;
    } 


    jwt.verify(token, jwt_secret, async (err, user) => {
      if (err) {
        res
          .status(401)
          .json({ message: "Unauthorized request, Try again" });
      } else {
        req.user = user;
        next();
      }
    });

    return;

  } catch (err) {
    console.log(err, "Error occurred");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized request" });
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }
    next();
  };
};
