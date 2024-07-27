import { FastifyInstance } from "fastify"
import { ClientError } from "./erros/client-error"
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
    console.error(error); // Log do erro para diagnóstico

    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Invalid Inputs',
            error: error.flatten().fieldErrors
        })
    }
    
    if (error instanceof ClientError) {
        return reply.status(400).send({
            message: error.message
        })
    }

    return reply.status(500).send({ message: 'internal server error' })
}