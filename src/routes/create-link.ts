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

export async function createLink(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/links', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            }),
            body: z.object({
                title: z.string().min(4),
                url: z.string().url(),
            })
        }
    }, async (request) => {
        const { tripId } = request.params
        const { title, url } = request.body
        const trip = await prisma.trip.findUnique({
            where: { id: tripId }
        })

        if (!trip) {
            throw new ClientError('trip not found')
        }

        const link = await prisma.link.create({
            data: {
                title,
                url,
                trip_id: tripId,
            }
        })
        return { linkId: link.id }
    })
}