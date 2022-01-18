import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";

const isAuth: RequestHandler<{}, any, any, {}, { userId?: string }> = async (
  req,
  _,
  next
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("Not authenticated");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("not authenticated");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    // @ts-ignore
    req.userId = payload.userId;
    next();
    return;
  } catch (err) {}

  throw new Error("not authenticated");
};

export default isAuth;
