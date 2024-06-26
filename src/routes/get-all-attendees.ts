import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { prisma } from "../lib/prisma"

export async function getAllAttendees(app: FastifyInstance){
  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/attendees' ,{
    schema:{
      summary: 'Get all event',
      tags: ['attendees'],
      description: 'Busca de todos os participantes', 
      response:{
        200: z.array(z.object({
          eventId: z.string().uuid(),
          name: z.string(),
          email: z.string(),
          age: z.number().nullable(),
          gender: z.string().nullable()
        }))
      }
    }
  }, async (request, reply) => {

    const cont = await prisma.attendee.count({

    })

    const attendees = await prisma.attendee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
        eventId: true,
      } 
    })

    // Mapeia os eventos para o formato de resposta
    const formattedAttendees = attendees.map(attendee => ({
      id: attendee.id,
      name: attendee.name,
      email: attendee.email,
      age: attendee.age,
      gender: attendee.gender,
      eventId: attendee.eventId,
    }));

    return reply.send(formattedAttendees); // Retorna a lista de eventos formatados
  })
}