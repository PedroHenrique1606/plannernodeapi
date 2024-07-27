import nodemailer from 'nodemailer'
import { env } from '../env'

export async function getMailClient() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465, 
        secure: true, 
        auth: {
            user: env.USER_EMAIL,
            pass: env.PASSWORD_MAIL,
        }
    })

    return transporter
}
