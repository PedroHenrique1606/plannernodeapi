import cors from "@fastify/cors";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmParticipants } from "./routes/confirm-participants";
import { confirmTrip } from "./routes/confirm-trips";
import { createTrip } from "./routes/create-trips";
import { createActivity } from "./routes/create-activity";
import { getActivity } from "./routes/get-activities";
import { getAllTrips } from "./routes/get-trips";
import { createLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";

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
app.register(createActivity)
app.register(getActivity)
app.register(getAllTrips)
app.register(createLink)
app.register(getLinks)

app.listen({port: 3333}).then(() => {
    console.log('server running!')
})