import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function getAllTrips(app: FastifyInstance) {
    app.get('/trips', async (request, reply) => {
        const trips = await prisma.trip.findMany({
            include: {
                participants: true
            }
        });

        return trips;
    });
}
