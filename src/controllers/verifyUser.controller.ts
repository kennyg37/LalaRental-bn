import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { generateToken } from "../utils/tokenGenerator.utils";
import { successResponse, errorResponse } from "../utils/response.utils";
import { USER_MESSAGES, JWT_CONSTANTS } from "../utils/variable.utils";

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const decoded = (req as any).decoded;
    const user = await UserService.getUserByEmail(decoded.email);

    if (!user) {
      errorResponse(res, 404, USER_MESSAGES.USER_NOT_FOUND);
      return;
    }

    user.verified = true;
    await UserService.updateUser(user);

    const authToken = await generateToken(user, JWT_CONSTANTS.AUTH_TOKEN_EXPIRY);
    successResponse(res, 200, USER_MESSAGES.EMAIL_VERIFIED, { token: authToken });
    return;

  } catch (error) {
    errorResponse(res, 500, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    return;
  }
};