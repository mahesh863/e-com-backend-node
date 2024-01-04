import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constants/password';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const validatePassword = async (password: string, hash: string): Promise<boolean> => {
  const isValidPassword = await bcrypt.compare(password, hash);
  return isValidPassword;
};
