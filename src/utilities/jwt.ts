import jwt from 'jsonwebtoken';

export const verifyToken = (token: string) => {
  try {
    // getting secret key from dotenv
    const secretKey = process.env.JWT_SECRET;
    // verifying the token
    return jwt.verify(token, secretKey || 'dasfasdfasdfasdf434');
  } catch (err) {
    // returning error in error occurs
    throw new Error('Invalid token');
  }
};

export const generateTokenForSftp = (payload: any): string => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign(payload, secretKey || 'dasfasdfasdfasdf434');
};
