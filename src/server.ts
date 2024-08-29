import cors from "@fastify/cors";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { errorHandler } from "./error-handler";
import { confirmParticipants } from "./routes/confirm-participants";
import { confirmTrip } from "./routes/confirm-trips";
import { createActivity } from "./routes/create-activity";
import { createInvite } from "./routes/create-invite";
import { createLink } from "./routes/create-link";
import { createTrip } from "./routes/create-trips";
import { getActivity } from "./routes/get-activities";
import { getLinks } from "./routes/get-links";
import { getParticipant } from "./routes/get-participant";
import { getParticipants } from "./routes/get-participants";
import { getTripDetails } from "./routes/get-trip-details";
import { getAllTrips } from "./routes/get-trips";
import { updateTrip } from "./routes/update-trip";
import { env } from "./env";

const app = fastify()


app.register(cors, {
    origin: '*'
})
// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler)

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipants)
app.register(createActivity)
app.register(getActivity)
app.register(getAllTrips)
app.register(createLink)
app.register(getLinks)
app.register(getParticipants)
app.register(createInvite)
app.register(updateTrip)
app.register(getTripDetails)
app.register(getParticipant)

app.listen({
    host: '0.0.0.0',
    port: env.PORT ?? 3333,
}).then(() => {
    console.log(`Server is running on http://localhost:${env.PORT ?? 3333}`);
}).catch((err) => {
    app.log.error(err);
    process.exit(1);
});
