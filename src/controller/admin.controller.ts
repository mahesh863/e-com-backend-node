import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { UserInput } from '../model/user.model';
import { createUser, getAdminList, getUserByEmail, getUserById, updateUser } from '../dal/user.dal';
import { v4 as uuid } from 'uuid';
import sendEmail from '../utils/mailer';
import logger from '../logger/index.logger';
import CustomError from '../utils/customErrors';

// admin section
export const createAdmin = expressAsyncHandler(async (req: Request<{}, {}, UserInput>, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const userDetails = await getUserByEmail(email);

    if (userDetails) {
      await updateUser(userDetails.id, { role });

      await sendEmail({
        email,
        subject: 'Admin Account created successfully',
        body: `

    Hello ${name},
    Your account has been updated to admin account successfully.

    You can login with your existing credentials.
    
    Thanks,
    `,
      });
    } else {
      const verifyEmailToken = uuid();
      const emailTokenExpiry = new Date(Date.now() + 24 * 1 * 60 * 60 * 1000);

      await createUser({ name, email, password, role, verifyEmailToken, verifyEmailTokenExpiry: emailTokenExpiry });

      await sendEmail({
        email,
        subject: 'Admin Account created successfully',
        body: `
    Hello ${name},
    Your admin account has been created successfully. Please click in the link below to verify your email.
    ${process.env.CLIENT_URL}/verifyEmail?token=${verifyEmailToken}

    You can login with following credentials:
    Email: ${email}
    Password: ${password}
    
    Thanks,
    `,
      });
    }

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    logger.error('error in creating admin', error);
    throw new CustomError('Failed to create admin', 500);
  }
});

export const updateAdmin = expressAsyncHandler(async (req: Request<{}, {}, Partial<UserInput>>, res: Response) => {
  const { id, ...updatedDetails } = req.body;

  await updateUser(Number(id), updatedDetails);

  res.status(200).json({ message: 'Data updated successfully' });
});

export const deleteAdmin = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const userDetails = await getUserById(Number(id));

    if (!userDetails) {
      throw new Error('User not found');
    }

    await updateUser(userDetails.id, { role: 1 });

    await sendEmail({
      email: userDetails.email,
      subject: 'Your admin access has been revoked',
      body: `
        Hello ${userDetails.name},
        Your admin access has been revoked.
        
        Thanks,
        `,
    });

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    logger.error('error in deleting admin', error);
    throw new CustomError('Failed to delete admin', 500);
  }
});

export const getAllAdmin = expressAsyncHandler(async (req: Request, res: Response) => {
  const allAdmin = await getAdminList();
  res.status(200).json({ data: allAdmin });
});
