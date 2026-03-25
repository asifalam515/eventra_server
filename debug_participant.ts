import { PrismaClient } from './src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  const eventId = "d687a4e5-130a-4fd8-ab53-a95a701b2148";
  const participants = await prisma.participant.findMany({
    where: { eventId }
  });
  console.log("All Participants for the given event:");
  console.dir(participants, { depth: null });
}
main().catch(console.error).finally(() => prisma.$disconnect());
