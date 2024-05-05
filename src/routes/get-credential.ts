import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { BadRequest } from "./_errors/bad-request";

export async function getCredential(app: FastifyInstance){
  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/credential', {
    schema: {
      summary: 'Validation credential',
      tags: ['attendees'],
      description: 'Validar credencial do participante',
      body: z.object({
        id: z.number()
      })
    }
  }, async(request,reply) => {
    const { id } = request.body

    const credential = await prisma.attendee.findFirst({
      where: {
        id
      }
    })
      if(!credential) {
        throw new BadRequest('Participante não cadastrado!')
      }


    return reply.status(200).send()
  })
}