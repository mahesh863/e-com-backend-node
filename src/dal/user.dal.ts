import logger from '../logger/index.logger';
import User, { UserInput, UserOutput } from '../model/user.model';
import CustomError from '../utils/customErrors';

export const createUser = async (payload: UserInput): Promise<UserOutput> => {
  try {
    const user = await User.create(payload);
    return user;
  } catch (error) {
    logger.error('Error in creating user:', error);
    throw new CustomError('Failed to create user', 500);
  }
};

export const updateUser = async (id: number, payload: Partial<UserInput>): Promise<UserOutput> => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    const updatedUser = await user.update(payload);
    return updatedUser;
  } catch (error) {
    logger.error('Error in updating user:', error);
    throw new CustomError('Failed to update user', 500);
  }
};

export const getUserById = async (id: number): Promise<UserOutput> => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  return user;
};

export const getUserByEmail = async (email: string): Promise<UserOutput | null> => {
  const user = await User.findOne({ where: { email } });
  return user;
};

export const getUserByEmailVerificationToken = async (token: string): Promise<UserOutput | null> => {
  const user = await User.findOne({ where: { verifyEmailToken: token } });
  return user;
};

export const getUserByPasswordResetToken = async (token: string): Promise<UserOutput | null> => {
  const user = await User.findOne({ where: { resetPasswordToken: token } });
  return user;
};

export const deleteUserById = async (id: number): Promise<boolean> => {
  const deletedUserCount = await User.destroy({ where: { id } });
  return !!deletedUserCount;
};

export const getAdminList = async (): Promise<UserOutput[]> => {
  try {
    const allAdmin = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      where: {
        role: [10, 11, 12],
      },
    });
    return allAdmin;
  } catch (error) {
    logger.error('Error in getting admin list:', error);
    throw new CustomError('Failed to get admin list', 500);
  }
};
