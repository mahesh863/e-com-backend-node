import { Router as expressRouter } from 'express';

import { signup, signin, verifyEmail, forgotPassword, passwordReset, signOut } from '../controller/user.controller';
import { forgotPasswordValidator, passwordResetValidator, signInValidator, signUpValidator } from '../validator/user.validator';
import validate from '../validator/validate.validators';

const router = expressRouter();

router.route('/signup').post(signUpValidator(), validate, signup);
router.route('/signin').post(signInValidator(), validate, signin);
router.route('/signout').get(signOut);
router.route('/verifyEmail').get(verifyEmail);
router.route('/forgotPassword').get(forgotPasswordValidator(), validate, forgotPassword);
router.route('/resetPassword').post(passwordResetValidator(), validate, passwordReset);

export default router;
