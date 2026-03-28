import { prisma } from "./src/lib/prisma";
async function main() {
    const eventId = "ea1d8004-e8a6-4ccb-83a7-e9f31ccfbcd3";
    const userId = "2f65b120-ede3-4a41-8931-70ed44781aa9";
    const user = await prisma.user.findUnique({ where: { id: userId } });
    console.log("User exists:", !!user, user?.role);
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    console.log("Event exists:", !!event, event?.creatorId);
    const participant = await prisma.participant.findUnique({
        where: { userId_eventId: { userId, eventId } }
    });
    console.log("Participant exists:", !!participant, participant);
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=check-participant.js.map