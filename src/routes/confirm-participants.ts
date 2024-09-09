import "dayjs/locale/pt-br";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import { ClientError } from "../erros/client-error";
import { env } from "../env";

export async function confirmParticipants(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().patch('/participants/:participantId/confirm', {
        schema: {
            params: z.object({
                participantId: z.string().uuid(),
            }),
            body: z.object({
                email: z.string().email(),
                name: z.string().min(1),
            }),
        }
    }, async (request, reply) => {
        const { participantId } = request.params;
        const { email, name } = request.body;

        // Procura o participante pelo participantId
        const participant = await prisma.participant.findUnique({
            where: {
                id: participantId,
            }
        });
        if (!participant) {
            throw new ClientError('Participant not found.');
        }

        // Verifica se o participante existe

        // Verifica se o email fornecido corresponde ao email do participante
        if (participant.email !== email) {
            throw new ClientError('Email does not match.');
        }

        // Verifica se o participante já confirmou a presença
        // if (participant.is_confirmed) {
        //     return reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`);
        // }

        // Atualiza o nome e confirma a presença
        await prisma.participant.update({
            where: { id: participantId },
            data: {
                is_confirmed: true,
                name: name,
            }
        });

        return reply.status(204).send()
        // reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`);
    });
}