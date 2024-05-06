import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function getAllCheckIn(app: FastifyInstance){
  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/checkin-in' , {
    schema:{
      summary: 'Get all checkIn',
      tags: ['check-ins'],
      description: 'Lista de todos os check-ins',
      response:{
        200: z.array(z.object({
          attendeeId: z.number(),
          eventId: z.string()
        }))
      }
    }
  }, async (request, reply) => {

    const checkIn = await prisma.checkIn.findMany()


    return reply.send(checkIn)
  })
}