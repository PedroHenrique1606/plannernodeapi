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

export async function updateTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put('/trips/:tripId', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            }),
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
            })
        }
    }, async (request) => {
        const { destination, ends_at, starts_at } = request.body
        const {tripId} = request.params

        const trip = await prisma.trip.findUnique({
            where: { id: tripId }
        })

        if (!trip) {
            throw new ClientError('trip not found')
        }

        if (dayjs(starts_at).isBefore(new Date())) {
            throw new ClientError('Invalid trip start date')
        }

        if (dayjs(ends_at).isBefore(starts_at)) {
            throw new ClientError('Invalid trip end date')
        }

        await prisma.trip.update({
            where: {id: tripId},
            data: {
                destination,
                starts_at,
                ends_at
            }
        })

        return { tripID: trip.id }
    })
}