import nodemailer from 'nodemailer';
import logger from '../logger/index.logger';

interface MailOptions {
  email: string;
  subject: string;
  body: string;
}

const sendEmail = async (options: MailOptions) => {
  // create a transporter to send the mail
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT as unknown as number,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const mail = {
    from: 'mahesh@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.body,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    // As sending email is not strongly coupled to the business logic it is not worth to raise an error when email sending fails
    // So it's better to fail silently rather than breaking the app
    logger.error('Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file');
    logger.error('Error: ', error);
  }
};

export default sendEmail;
