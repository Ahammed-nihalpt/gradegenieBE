import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utilities/jwt';

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      isSucceed: false,
      data: [],
      msg: 'Unauthorized',
    });
    return;
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    res.status(401).json({
      isSucceed: false,
      data: [],
      msg: 'Invalid token format',
    });
    return;
  }

  try {
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      res.status(401).json({
        isSucceed: false,
        data: [],
        msg: 'Invalid token',
      });
      return;
    }

    // optionally you can attach decoded token to request object
    // req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({
      isSucceed: false,
      data: [],
      msg: 'Invalid token',
    });
    return;
  }
}
