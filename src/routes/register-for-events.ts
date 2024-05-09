import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";


export async function registerForEvent(app: FastifyInstance){
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees', {
      schema:{
        summary: 'Register an attendee',
        tags: ['attendees'],
        description: "Cadastrar participante no Evento",
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
          age: z.number().nullable(),
          gender: z.string().nullable()
        }),
        params: z.object({
          eventId: z.string().uuid()
        }),
        response:{
          201: z.object({
            attendeeId: z.number(),
            name: z.string(),
            age: z.number().nullable(),
            gender: z.string().nullable()
          })
        }
      }
    }, async (request, reply) => {
      const { eventId } = request.params
      const { name, email, age, gender } = request.body // Incluindo a senha no corpo da requisição

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where:{
          email_eventId: {
            email,
            eventId
          }
        }
      })

      if (attendeeFromEmail !== null) {
        throw new BadRequest ('This e-mail is already registered for this event.')
      }

      const [event, amountOfAttendeesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where:{
            id: eventId
          }
        }),

        prisma.attendee.count({
          where:{
            eventId
          }
        })
      ])

      if(event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees) {
        throw new BadRequest('The maximum number of attendees for this event has been reached.')
      } 

      const attendeeData = {
        name,
        email,
        eventId,
        age,
        gender
      }

      // Força o TypeScript a tratar attendeeData como o tipo esperado
      const attendee = await prisma.attendee.create({
        data: attendeeData as AttendeeCreateInput
      })

      return reply.status(201).send({
        attendeeId: attendee.id,
        name: attendee.name,
        age: attendee.age !== null ? attendee.age : null,
        gender: attendee.gender !== null ? attendee.gender : null
      });
    })
}

// Declare um tipo personalizado para a criação de participantes
type AttendeeCreateInput = {
  name: string;
  email: string;
  eventId: string;
  age: number;
  gender: string
}
