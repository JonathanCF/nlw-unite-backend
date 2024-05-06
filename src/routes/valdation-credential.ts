  import { FastifyInstance } from "fastify";
  import { ZodTypeProvider } from "fastify-type-provider-zod";
  import { z } from 'zod'
  import { prisma } from "../lib/prisma"
  import { BadRequest } from "./_errors/bad-request";

  interface RequestBody {
    id: number;
    name: string
  }

  export async function validationCredential(app: FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/credential' ,{
      schema:{
        summary: 'Get all event',
        tags: ['attendees'],
        description: 'Validar credencial do participante', 
        response:{
          200: z.object({
            id: z.number(),
            name: z.string()
          })
        }
      }
    }, async (request, reply) => {
      try {
      const { id } = request.body as RequestBody

      const credential = await prisma.attendee.findUnique({
        where:{
          id
        },
        select:{
          id: true,
          name: true
        }
      })

      if(!credential){
        throw new BadRequest('Participante não cadastrado')
      }

      return reply.status(200).send({
        id: credential.id,
        name: credential.name

      });

      } catch (error) {
        console.log(error)
      }    
    })
  }
