import nodemailer from 'nodemailer'
import mailgun from 'nodemailer-mailgun-transport'
import nunjucks from 'nunjucks'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export function sendEmail(email, sub) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const mailgunAuth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    }
  }

  const emailTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'email.html'), 'utf8')
  const smtpTransport = nodemailer.createTransport(mailgun(mailgunAuth))
  const template = nunjucks.compile(emailTemplate)

  const token = jwt.sign({
    iss: 'sens.us magic link',
    exp: Math.floor(Date.now() / 1000) + (60 * 5), // 5 menit
    sub: sub,
    nonce: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }, process.env.JWT_SECRET)

  const htmlToSend = template.render({ token, host: process.env.HOST })

  const mailOptions = {
    from: 'riza@sens.us',
    to: email,
    subject: 'Login ke sens.us dengan magic link',
    html: htmlToSend
  }

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.error(error)
    }
    console.log("Successfully sent email.", response)
    smtpTransport.close()
  })

}
