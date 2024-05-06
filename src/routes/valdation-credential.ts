import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { prisma } from "../lib/prisma"
import { BadRequest } from "./_errors/bad-request";

// Interface para o corpo da requisição
interface RequestBody {
  attendeeId: number;
  name: string;
}

export async function validationCredential(app: FastifyInstance){
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/credential/:attendeeId' ,{
      schema:{
        summary: 'Validate attendee credential',
        tags: ['attendees'],
        description: 'Validar credencial do participante',
        body: z.object({
          attendeeId: z.coerce.number().int(),
        }), 
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response:{
          200: z.object({
            attendeeId: z.number(),
            name: z.string()
          })
        }
      }
    }, async (request, reply) => {
      try {
        // Verifica se a propriedade 'id' está presente no corpo da requisição
        const { attendeeId } = request.params as RequestBody;

        // Busca o participante no banco de dados
        const credential = await prisma.attendee.findUnique({
          where: { id: attendeeId },
          select: { id: true, name: true }
        });

        // Se não encontrar o participante, emite um BadRequest
        if (!credential) {
          throw new BadRequest('Participante não cadastrado');
        }

        // Se encontrar, retorna id e name
        return reply.status(200).send({
          attendeeId: credential.id,
          name: credential.name
        });

      } catch (error) {
        // Em caso de erro, loga o erro
        console.error(error);
        // Emite um BadRequest com mensagem genérica
        throw new BadRequest('Erro ao validar credencial');
      }    
    })
}
