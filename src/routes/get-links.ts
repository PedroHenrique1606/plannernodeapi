import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import { access } from "fs";

dayjs.extend(localizedFormat);
dayjs.locale('pt-br')

export async function getLinks(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/links', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            })
        }
    }, async (request) => {
        const { tripId } = request.params
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: { links: true }
        })

        if (!trip) {
            throw new Error('trip not found')
        }


        return { links: trip.links }
    })
}