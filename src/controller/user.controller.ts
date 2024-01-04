import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { v4 as uuid } from 'uuid';

import CustomError from '../utils/customErrors';
import { createUser, getUserByEmail, getUserByEmailVerificationToken, getUserByPasswordResetToken, updateUser } from '../dal/user.dal';
import logger from '../logger/index.logger';
import sendEmail from '../utils/mailer';

const CURRENT_ENV = process.env.NODE_ENV;

interface UserSignupBody {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

interface UserSigninBody {
  email: string;
  password: string;
}

interface PasswordResetBody {
  token: string;
  password: string;
}

export const signup = expressAsyncHandler(async (req: Request<{}, {}, UserSignupBody>, res: Response) => {
  const { name, email, phone, password } = req.body;
  logger.info('User signup request', { name, email, phone, password });

  logger.info('Checking if email exists');
  const checkUser = await getUserByEmail(email);

  if (checkUser !== null) {
    logger.info(` ${email} Email already exists`);
    throw new CustomError('Email already exists, please signin', 409);
  }

  const verifyEmailToken = uuid();
  const emailTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);

  logger.info('Creating new user');
  const createdUser = await createUser({ name, email, phone, password, verifyEmailToken, verifyEmailTokenExpiry: emailTokenExpiry });

  if (CURRENT_ENV !== 'test') {
    await sendEmail({
      email,
      subject: 'Account created successfully',
      body: `
    Hello ${name},
    Your account has been created successfully. Please click in the link below to verify your email.
    ${process.env.CLIENT_URL}/verifyEmail?token=${verifyEmailToken}
    `,
    });
  }

  const userData = {
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    phone: createdUser.phone,
  };

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: userData,
  });
});

export const signin = expressAsyncHandler(async (req: Request<{}, {}, UserSigninBody>, res: Response) => {
  logger.info('User signin request', req.body);

  const { email, password } = req.body;

  logger.info('Getting user info by email');
  const userData = await getUserByEmail(email);

  if (userData) {
    logger.info('Comparing password');
    const passwordMatch = await userData.comparePassword(password);

    if (passwordMatch) {
      logger.info(`Password matched, generating jwt token`);
      const jwtToken = userData.generateToken();

      const data = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      };

      res
        .status(200)
        .cookie('auth', jwtToken, {
          maxAge: 1000 * 60 * 60 * 24 * 1,
          httpOnly: true,
          // secure: true,
        })
        .json({
          success: true,
          message: 'logged in successfully',
          data,
          // token: jwtToken,
        });
    } else {
      logger.info(`Password did not match`);
      throw new CustomError('Invalid password', 401);
    }
  } else {
    logger.info(`User not found for email ${email}`);
    throw new CustomError('User not found', 404);
  }
});

export const signOut = expressAsyncHandler(async (req: Request<{}, {}, UserSigninBody>, res: Response) => {
  logger.info('User signout request');
  res
    .status(200)
    .cookie('auth', '', {
      maxAge: 0,
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'logged out successfully',
    });
});

export const verifyEmail = expressAsyncHandler(async (req: Request, res: Response) => {
  const token = req.query?.token as string;

  if (!token) {
    throw new CustomError('Please send the token!', 400);
  }

  logger.info('Getting user info by token');
  const userData = await getUserByEmailVerificationToken(token);

  if (userData !== null) {
    logger.info('Checking if token is valid');

    if (userData.isEmailVerified) {
      throw new CustomError('Email already verified', 409);
    }

    if (!userData.verifyEmailTokenExpiry || userData.verifyEmailTokenExpiry < new Date()) {
      logger.info('Verify email token expired');
      throw new CustomError('Token expired', 419);
    }

    const updateData = {
      isEmailVerified: true,
      verifyEmailToken: null,
      verifyEmailTokenExpiry: null,
    };

    logger.info('Updating verified email status');
    await updateUser(userData.id, updateData);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } else {
    throw new CustomError('Token not found in database', 404);
  }
});

export const forgotPassword = expressAsyncHandler(async (req: Request, res: Response) => {
  const forgotPasswordEmailId = req.query?.email as string;

  if (!forgotPasswordEmailId) {
    throw new CustomError('Please send the email!', 400);
  }

  logger.info('Getting user info by email');
  const userData = await getUserByEmail(forgotPasswordEmailId);

  if (!userData) {
    throw new CustomError('User data not found!', 404);
  }

  const resetPasswordToken = uuid();
  const resetPasswordTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);

  await sendEmail({
    email: forgotPasswordEmailId,
    subject: 'Password reset request',
    body: `
    Dear user,
    We have received password reset request. Please click in the link below to reset your password.
    ${process.env.CLIENT_URL}/resetPassword?token=${resetPasswordToken}
    `,
  });

  const updateData = {
    resetPasswordToken,
    resetPasswordTokenExpiry,
  };

  await updateUser(userData.id, updateData);
  res.status(200).json({
    success: true,
    message: 'Password reset link sent to your email',
  });
});

export const passwordReset = expressAsyncHandler(async (req: Request<{}, {}, PasswordResetBody>, res: Response) => {
  const { token, password } = req.body;

  logger.info('Getting user info by token');

  const userData = await getUserByPasswordResetToken(token);

  if (!userData) {
    throw new CustomError('User data not found!', 404);
  }

  if (!userData.resetPasswordTokenExpiry || userData.resetPasswordTokenExpiry < new Date()) {
    throw new CustomError('Reset password token expired', 419);
  }

  const updateData = {
    password,
    resetPasswordToken: null,
    resetPasswordTokenExpiry: null,
  };

  await updateUser(userData.id, updateData);

  res.status(200).json({
    message: 'Password reset successfully',
  });
});
