import nodemailer from 'nodemailer';
import config from 'config';

export  const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: config.get<string>('email'), 
    pass: config.get<string>('email_pwd'), 
  },
});