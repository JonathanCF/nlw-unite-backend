import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { prisma } from "../lib/prisma"

export async function getAllEvent(app: FastifyInstance){
  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/events' ,{
    schema:{
      summary: 'Get all event',
      tags: ['events'],
      description: 'Busca de todos os evento ativos', 
      response:{
        200: z.array(z.object({
          id: z.string().uuid(),
          title: z.string().nullable(),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().nullable(),
          ativo: z.boolean()
        }))
      }
    }
  }, async (request, reply) => {

    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        details: true,
        maximumAttendees: true,
        ativo: true
      },
      where: {
        ativo: true
      }
    })

    // Mapeia os eventos para o formato de resposta
    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      details: event.details ?? null, // Trata null caso seja nulo
      maximumAttendees: event.maximumAttendees ?? null, // Trata null caso seja nulo
      ativo: event.ativo
    }));

    return reply.send(formattedEvents); // Retorna a lista de eventos formatados
  })
}