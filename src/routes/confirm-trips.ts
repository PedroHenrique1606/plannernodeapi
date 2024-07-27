import "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";
import { ClientError } from "../erros/client-error";
import { env } from "../env";

export async function confirmTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm', {
        schema: {
            params: z.object({
                tripId: z.string().uuid(),
            })
        }
    }, async (request, rep) => {
        const { tripId } = request.params
        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId,
            },
            include: {
                participants: {
                    where: {
                        is_owner: false,
                    }
                }
            }
        })

        if (!trip) {
            return new ClientError('trip not found')
        }

        if (trip.is_confirmed) {
            return rep.redirect(`http://localhost:3000/trips/${tripId}`)
        }

        await prisma.trip.update({
            where: { id: tripId },
            data: { is_confirmed: true },
        })

        trip.participants

        const formattedStartDate = dayjs(trip.starts_at).format('LL')
        const formattedEndDate = dayjs(trip.starts_at).format('LL')

        const mail = await getMailClient()

        await Promise.all(
            trip.participants.map(async (participant) => {
                const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`

                const message = await mail.sendMail({
                    from: {
                        name: 'Equipe Plann.er',
                        address: 'pedro@planner.com'
                    },
                    to: participant.email,
                    subject: `Confirme sua presença na viagem para ${trip.destination}`,
                    html: `
                        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                            <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de
                                <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>
                            </p>
                            <p>
                            <p></p>
                            <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                            <a href="${confirmationLink}">
                                Confirmar Viagem
                            </a>
                            </p>
                            <p></p>
                            <p>Caso você não saiba do que se trata esse e-mail, apenas o ignore.</p>
                        </div>￼
                    `.trim()
                })

                console.log(nodemailer.getTestMessageUrl(message))

            })
        )

        return rep.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`)
    })
}