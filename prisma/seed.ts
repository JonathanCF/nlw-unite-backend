import { prisma } from '../src/lib/prisma'

async function seed() {
  await prisma.event.create({
    data:{
      id: '18c12408-e6c4-4add-935b-5c07f2d42292',
      title: 'Unite Summit',
      slug: 'unit-summit',
      details: "Um evento p/ devs apaixonados(as) por códigos!!",
      maximumAttendees: 100,

    }
  })
}
  seed().then(() => {
    console.log('Database seeded!')
    prisma.$disconnect()
  })
