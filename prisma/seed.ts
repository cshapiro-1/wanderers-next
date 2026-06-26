import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { activities, haikus, dayMeta } from "../src/data/activities";

async function main() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("🌸 Seeding trip data...");

  // Clear existing trip data
  await prisma.activityState.deleteMany();
  await prisma.aiSuggestion.deleteMany();
  await prisma.dayNote.deleteMany();
  await prisma.tripActivity.deleteMany();
  await prisma.tripDay.deleteMany();

  for (const [dayStr, meta] of Object.entries(dayMeta)) {
    const dayNumber = Number(dayStr);
    const dayActivities = activities[dayNumber] || [];
    const dayHaikus = (haikus as Record<number, string[]>)[dayNumber];
    const haiku = dayHaikus ? dayHaikus.join("\n---\n") : undefined;

    const day = await prisma.tripDay.create({
      data: {
        dayNumber,
        title: meta.title,
        region: getRegion(dayNumber),
        haiku: haiku ?? null,
        activities: {
          create: dayActivities.map((act, idx) => ({
            sortOrder: idx,
            title: act.title,
            time: act.time,
            type: act.type,
            description: act.desc,
            lat: act.lat,
            lng: act.lng,
            optional: act.optional ?? false,
            duration: act.duration ?? null,
          })),
        },
      },
    });

    console.log(`  ✓ Day ${dayNumber}: ${meta.title} (${dayActivities.length} activities)`);
  }

  console.log("✅ Seed complete");
  await prisma.$disconnect();
}

function getRegion(day: number): string {
  if (day <= 5) return "tokyo";
  if (day <= 7) return "hakone";
  if (day <= 12) return "osaka";
  return "kyoto";
}

main().catch((e) => { console.error(e); process.exit(1); });
