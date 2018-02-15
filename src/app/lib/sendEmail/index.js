import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

export default function ({ to, title, content, html, }) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'config.json'), 'utf-8', (error, data) => {
      if (error) {
        return reject(error);
      }
      const account = JSON.parse(data);
      const smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
          user: account.host,
          pass: account.password,
        },
      });
      const mailOptions = {
        from: account.host,
        to: to || account.host,
        subject: title,
        text: content,
        html,
      };
      return smtpTransport.sendMail(mailOptions, (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
        return smtpTransport.close();
      });
    });
  });
}
