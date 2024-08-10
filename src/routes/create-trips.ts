import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";
import { ClientError } from "../erros/client-error";
import { env } from "../env";

dayjs.extend(localizedFormat);
dayjs.locale('pt-br')

export async function createTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema: {
            body: z.object({
                destination: z.string({ required_error: 'Destination is required' }).min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
                owner_name: z.string(),
                owner_email: z.string().email(),
                emails_to_invite: z.array(z.string().email())
            })
        }
    }, async (request) => {
        const { destination, ends_at, starts_at, owner_email, owner_name, emails_to_invite } = request.body;

        if (dayjs(starts_at).isBefore(new Date())) {
            throw new ClientError('Invalid trip start date');
        }

        if (dayjs(ends_at).isBefore(starts_at)) {
            throw new ClientError('Invalid trip end date');
        }

        const trip = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at,
                participants: {
                    createMany: {
                        data: [
                            {
                                name: owner_name,
                                email: owner_email,
                                is_owner: true,
                                is_confirmed: true,
                            },
                            ...emails_to_invite.map(email => {
                                return { email }
                            })
                        ],
                    }
                }
            }
        });

        const formattedStartDate = dayjs(starts_at).format('LL');
        const formattedEndDate = dayjs(ends_at).format('LL');
        const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`;

        const mail = await getMailClient();

        const logoBase64 = "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";

        const message = await mail.sendMail({
            from: {
                name: 'Equipe Plann.er',
                address: 'pedromelosilva11911@gmail.com'
            },
            to: owner_email,
            subject: `Confirme sua viagem para ${destination}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="cid:logo" style="width: 25%;" />
                    </div>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #444;">Confirme sua viagem para <strong>${destination}</strong></h2>
                        <p>Olá ${owner_name},</p>
                        <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de
                            <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.
                        </p>
                        <p>Para confirmar a sua viagem, clique no botão abaixo:</p>
                        <p style="text-align: center;">
                            <a href="${confirmationLink}" style="display: inline-block; background-color: #1e88e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirmar Viagem</a>
                        </p>
                        <p>Se você não solicitou essa viagem, por favor ignore este e-mail.</p>
                        <p>Atenciosamente,<br>Equipe Plann.er</p>
                    </div>
                    <div style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
                        <p>Plann.er Inc.</p>
                        <p>Rua Exemplo, 123 - Fortaleza, CE, 71878-851</p>
                    </div>
                </div>
            `.trim(),
            attachments: [{
                filename: 'logo.png',
                content: Buffer.from(logoBase64, 'base64'),
                cid: 'logo'
            }]
        });

        for (const email of emails_to_invite) {
            await mail.sendMail({
                from: '"Travel Planner" <no-reply@travelplanner.com>',
                to: email,
                subject: `Convite para Viagem: ${destination}`,
                html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="cid:logo" style="width: 25%;" />
                    </div>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #444;">Você foi para uma viagem à <strong>${destination}</strong></h2>
                        <p>Você foi convidado por ${owner_name} para uma viagem com destino à <strong>${destination}</strong> nas datas de
                            <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.
                        </p>
                        <p>Para confirmar a sua viagem, clique no botão abaixo:</p>
                        <p style="text-align: center;">
                            <a href="${confirmationLink}" style="display: inline-block; background-color: #1e88e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirmar Viagem</a>
                        </p>
                        <p>Se você não foi avisado dessa viagem ou desconhece o criador, desconsidere o e-mail.</p>
                        <p>Atenciosamente,<br>Equipe Plann.er</p>
                    </div>
                    <div style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
                        <p>Plann.er Inc.</p>
                        <p>Rua Exemplo, 123 - Fortaleza, CE, 71878-851</p>
                    </div>
                </div>
            `.trim(),
                attachments: [{
                    filename: 'logo.png',
                    content: Buffer.from(logoBase64, 'base64'),
                    cid: 'logo'
                }]
            });
        }

        console.log(nodemailer.getTestMessageUrl(message))
        return { tripId: trip.id }
    })

}
