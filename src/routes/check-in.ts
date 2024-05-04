import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function checkIn(app: FastifyInstance){
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/:eventId/check-in', {
      schema:{
        summary: 'Check-in an attendee',
        tags: ['check-ins'],
        description: "Dados do Evento",
        params: z.object({
          attendeeId: z.coerce.number().int(),
          eventId:z.string()
        }),
        response:{
          201: z.null()
        }
      }
    } , async (request, reply) => {
        const { attendeeId, eventId } = request.params

        const attendeeCheckIn = await prisma.checkIn.findUnique({
          where:{
            attendeeId,
            eventId
          }
        })

        if (attendeeCheckIn !== null){
          throw new BadRequest('Attendee already checked in')
        }

        await prisma.checkIn.create({
          data:{
            attendeeId,
            eventId
          }
        })

        return reply.status(201).send()
    })
}