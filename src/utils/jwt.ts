import jwt from 'jsonwebtoken';

export const generateJwtToken = (id: number, email: string): string => {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: '1d',
  });
  return token;
};

export const verifyJwtToken = (token: string): boolean => {
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    return true;
  } catch (error) {
    return false;
  }
};
