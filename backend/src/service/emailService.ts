import {transporter} from '../core/nodemailer';
import ejs from 'ejs';
import path from 'path';
import config from 'config';

export const sendEmail = async (to:string, subject:string, templateName:string,
  data:{voornaam:string,achternaam:string,link:string}) => {
  try {
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, '../utils/templates', `${templateName}.ejs`),
      data,
    );

    const mailOptions = {
      from: config.get<string>('email'),
      to,
      subject,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

