import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {z} from 'zod'
import dayjs from "dayjs";
import { prisma } from "../lib/prisma";
import nodemailer from 'nodemailer'
import { getMailClient } from "../lib/mail";

export async function createTrip(app:FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/trips',{
        schema:{
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
                owner_name: z.string(),
                owner_email: z.string().email(),
            })
        }
    }, async (request) => {
        const {destination,ends_at, starts_at, owner_email, owner_name} = request.body

        if(dayjs(starts_at).isBefore(new Date())){
            throw new Error('Invalid trip start date')
        }

        if(dayjs(ends_at).isBefore(starts_at)){
            throw new Error('Invalid trip end date')
        }

        const trip  = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at
            }
        })
        const mail = await getMailClient()

        const message = await mail.sendMail({
            from: {
                name: 'Equipe Plann.er',
                address: 'pedro@planner.com' 
            },
            to:{
                name: owner_email,
                address: owner_email
            },
            subject: 'testando envio de e-mail',
            html: '<p>teste do envio de email do planner</p>'
        })

        console.log(nodemailer.getTestMessageUrl(message))
        return {tripID: trip.id}
    })
}