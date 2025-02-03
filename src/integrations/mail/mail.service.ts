import { Inject, Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import mailConfig from './config/mail.config';
import { ConfigType } from '@nestjs/config';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { EmailType } from './enum/email-types.enum';

@Injectable()
export class MailService {
  private transporter: nodeMailer.Transporter;
  private mailOptions: MailOptions;

  constructor(
    @Inject(mailConfig.KEY)
    private readonly mailConfigrations: ConfigType<typeof mailConfig>,
  ) {
    this.transporter = nodeMailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      secure: true,
      auth: {
        user: mailConfigrations.user,
        pass: mailConfigrations.password,
      },
    });
  }

  async sendEmail(
    emailType: EmailType,
    to: string,
    options?: { resetToken: string },
  ) {
    let subject: string;
    let text: string;

    switch (emailType) {
      case EmailType.VerifyEmail: {
        subject = 'Verify Your Email Address';
        text = `
            Click the link below to verify your email:  
            POST/ ${process.env.BASE_URL}/verify-email/{token}  

            This link will expire in 24 hours. If you did not sign up, please ignore this email.`;
        break;
      }
      case EmailType.ResetPassword: {
        subject = 'Password Reset Request';
        text = `
         Click the link below to reset your password:  
         POST/ ${process.env.BASE_URL}/change-password?token=${options?.resetToken} 

         This link will expire in 1 hour. If you did not request this, please ignore this email.`;
        break;
      }
      case EmailType.Welcome: {
        subject = 'Welcome to Our Service!';
        text = `Hello, welcome to our streaming service!`;
        break;
      }
      default: {
        throw new Error('Invalid email type');
      }
    }
    this.mailOptions = {
      from: this.mailConfigrations.user,
      to,
      subject,
      text,
    };
    try {
      await this.transporter.sendMail(this.mailOptions);
    } catch (err) {
      console.log(err);
      throw new Error('Can not send an email');
    }
  }
}
