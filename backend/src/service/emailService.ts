import {transporter} from '../core/nodemailer';
import ejs from 'ejs';
import path from 'path';
import config from 'config';
import fs from 'fs';
import { getLogger } from 'nodemailer/lib/shared';

export const sendEmail = async <T extends ejs.Data>(
  to: string,
  subject: string,
  templateName: string,
  data: T,
): Promise<any> => {
  const templatePath = path.join(__dirname, '../utils/templates', `${templateName}.ejs`);

  try {
    if (!fs.existsSync(templatePath) && templateName === 'bevestigingReservatie') {
      getLogger().info('file aanmaken');
      const defaultTemplate = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bevestiging reservatie</title>
          </head>
          <body>
            <h1>Hallo, <%= voornaam %>, <%= achternaam %></h1>
            <p>Je hebt zonet een boek uitgeleend. Alle informatie wordt hieronder nog eens opgelijst voor je:</p>
            <p><b>Titel boek: </b><%= boek_titel %></p>
            <p><b>ISBN: </b><%= ISBN %></p>
            <p><b>Uiterste inleverdatum: </b><%= einddatum %></p>
            <p>Veel leesplezier toegewenst.</p>
          </body>
        </html>
      `;
      fs.writeFileSync(templatePath, defaultTemplate);
      getLogger().info('file aangemaakt');
    } else if (!fs.existsSync(templatePath) && templateName === 'passwordReset'){
      getLogger().info('file aanmaken');
      const defaultTemplate = `
       <!DOCTYPE html>
        <html>
        <head>
          <title>Password Reset</title>
        </head>
        <body>
          <h1>Hallo, <%= voornaam %>, <%= achternaam %>!</h1>
          <p>Je hebt een nieuw wachtwoord aangevraagd. Klik op de onderstaande link:</p>
          <a href="<%= link %>">Reset Wachtwoord</a>
          <p>Dit veroek vervalt binnen 1uur.</p>
          <p>Als je hier niet om hebt gevraagd, negeer deze e-mail dan.</p>
        </body>
        </html>

      `;
      fs.writeFileSync(templatePath, defaultTemplate);
      getLogger().info('file aangemaakt');
    }
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
