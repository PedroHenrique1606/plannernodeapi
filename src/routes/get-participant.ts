import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import { ClientError } from "../erros/client-error";

dayjs.extend(localizedFormat);
dayjs.locale('pt-br')

export async function getParticipant(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/participants/:participantId', {
        schema: {
            params: z.object({
                participantId: z.string().uuid()
            })
        }
    }, async (request) => {
        const { participantId } = request.params
        const participant = await prisma.participant.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                is_confirmed: true,
            },
            where: { id: participantId },
        })

        if (!participant) {
            throw new ClientError('participant not found')
        }

        return { participant }
    })
}