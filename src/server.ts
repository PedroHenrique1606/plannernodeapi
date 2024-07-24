import cors from "@fastify/cors";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmParticipants } from "./routes/confirm-participants";
import { confirmTrip } from "./routes/confirm-trips";
import { createTrip } from "./routes/create-trips";

const app = fastify()

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors,{
    origin: '*'
})
app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipants)

app.listen({port: 3333}).then(() => {
    console.log('server running!')
})