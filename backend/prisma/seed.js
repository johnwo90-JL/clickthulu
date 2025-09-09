import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function upsertPrototypes() {
  // Ensure the Upgrade backing records exist first (FK from typeId -> upgrades.id)
  const clickUpgrade =
    (await prisma.upgrade.findUnique({ where: { shortName: "crd_click" } })) ||
    (await prisma.upgrade.create({
      data: {
        name: "Powerful Click",
        shortName: "crd_powerclick",
        description: `Basic "click"-card prototype`,
      },
    }));

  const acolyteUpgrade =
    (await prisma.upgrade.findUnique({
      where: { shortName: "wsp_acolyte" },
    })) ||
    (await prisma.upgrade.create({
      data: {
        name: "Acolyte",
        shortName: "wsp_acolyte",
        description: "Basic worshipper prototype",
      },
    }));

  // Ensure CardType and WorshipperType reference the upgrade ids
  const cardType = await prisma.cardType.upsert({
    where: { typeId: clickUpgrade.shortName },
    update: {},
    create: { typeId: clickUpgrade.shortName },
  });

  const worshipperType = await prisma.worshipperType.upsert({
    where: { typeId: acolyteUpgrade.shortName },
    update: {},
    create: { typeId: acolyteUpgrade.shortName },
  });

  return { cardType, worshipperType };
}

async function upsertEffectsAndJoins({ cardType, worshipperType }) {
  // Create a few generic effects
  const effectSeeds = [
    {
      id: "eff_click_power",
      values: {
        clickPower: { op: "add", value: [1, 2, 3, 5, 8, 12, 17, 29, 42] },
      },
    },
    {
      id: "eff_devotion_ps",
      values: { devotionPerSecond: { op: "add", value: [1, 2, 3, 4, 5] } },
    },
  ];

  const createdEffects = [];
  for (const seed of effectSeeds) {
    const effect =
      (await prisma.upgradeEffect.findUnique({ where: { id: seed.id } })) ||
      (await prisma.upgradeEffect.create({
        data: {
          id: seed.id,
          values: seed.values,
          isActive: true,
        },
      }));
    createdEffects.push(effect);
  }

  // Link effects to card and worshipper prototypes with sensible defaults
  let cardLinks = 0;
  let worshipperLinks = 0;
  for (const [index, effect] of createdEffects.entries()) {
    await prisma.cardEffect.upsert({
      where: {
        cardTypeId_effectId: { cardTypeId: cardType.id, effectId: effect.id },
      },
      update: {},
      create: {
        cardTypeId: cardType.id,
        effectId: effect.id,
        order: index,
        minLevel: 1,
        isPassive: true,
      },
    });
    cardLinks += 1;

    await prisma.worshipperEffect.upsert({
      where: {
        worshipperTypeId_effectId: {
          worshipperTypeId: worshipperType.id,
          effectId: effect.id,
        },
      },
      update: {},
      create: {
        worshipperTypeId: worshipperType.id,
        effectId: effect.id,
        order: index,
        minLevel: 1,
        isPassive: true,
      },
    });
    worshipperLinks += 1;
  }

  return { effectsCount: createdEffects.length, cardLinks, worshipperLinks };
}

async function upsertAchievements() {
  const seeds = [
    {
      name: "First Click",
      description: "Click for the first time",
      target: { clicks: 1 },
      rewards: { xp: 10 },
    },
    {
      name: "Hundred Clicks",
      description: "Click 100 times",
      target: { clicks: 100 },
      rewards: { xp: 100 },
    },
    {
      name: "Thousand Clicks",
      description: "Click 1,000 times",
      target: { clicks: 1000 },
      rewards: { xp: 500 },
    },
    {
      name: "Million Clicks",
      description: "Click 1,000,000 times - True devotion!",
      target: { clicks: 1000000 },
      rewards: { xp: 10000 },
    },
    {
      name: "First Devotion",
      description: "Gain your first devotion",
      target: { devotion: 1 },
      rewards: { xp: 5 },
    },
    {
      name: "Devotion Hoarder",
      description: "Accumulate 10,000 devotion",
      target: { devotion: 10000 },
      rewards: { xp: 1000 },
    },
    {
      name: "Devotion Millionaire",
      description: "Accumulate 1,000,000 devotion",
      target: { devotion: 1000000 },
      rewards: { xp: 50000 },
    },
    {
      name: "First Worshipper",
      description: "Gain your first worshipper",
      target: { worshippers: 1 },
      rewards: { xp: 100 },
    },
    {
      name: "Cult Leader",
      description: "Gain 100 worshippers",
      target: { worshippers: 100 },
      rewards: { xp: 5000 },
    },
    {
      name: "Ancient One",
      description: "Reach prestige level 1",
      target: { prestigeLevel: 1 },
      rewards: { xp: 10000 },
    },
  ];

  for (const a of seeds) {
    await prisma.achievementDefinition.upsert({
      where: { name: a.name },
      update: {
        description: a.description,
        target: a.target,
        rewards: a.rewards,
        isActive: true,
      },
      create: {
        name: a.name,
        description: a.description,
        target: a.target,
        rewards: a.rewards,
        isActive: true,
      },
    });
  }

  return seeds.length;
}

// Upgrades definition/effects are not present in the current schema.
// Intentionally omitted to align with the Prisma models.

async function upsertUsersAndStats({ cardType, worshipperType }) {
  const defaultPassword = process.env.SEED_USER_PASSWORD || "password123";
  const defaultPasswordHash = await bcrypt.hash(defaultPassword, 10);

  const demoUsers = [
    {
      email: "demo@clickthulu.com",
      username: "demo_player",
      passwordHash: defaultPasswordHash,
      stats: {
        clickPower: 2,
        totalClicks: 150,
        devotionPerSecond: 1,
        totalDevotion: 250,
        currentLevel: 2,
        xp: 120,
        nextLevelXp: 200,
        xpPerSecond: 0,
        xpPerClick: 1,
        prestige: 0,
        prestigeLevel: 1,
      },
      upgrades: [{ name: "Click Multiplier", level: 2 }],
    },
    {
      email: "veteran@clickthulu.com",
      username: "veteran_cultist",
      passwordHash: defaultPasswordHash,
      stats: {
        clickPower: 5,
        totalClicks: 5000,
        devotionPerSecond: 10,
        totalDevotion: 15000,
        currentLevel: 8,
        xp: 2400,
        nextLevelXp: 3200,
        xpPerSecond: 0,
        xpPerClick: 1,
        prestige: 1,
        prestigeLevel: 2,
      },
      upgrades: [
        { name: "Click Multiplier", level: 3 },
        { name: "Auto Clicker", level: 3 },
        { name: "Devotion Multiplier", level: 4 },
      ],
    },
    {
      email: "master@clickthulu.com",
      username: "cosmic_master",
      passwordHash: defaultPasswordHash,
      stats: {
        clickPower: 12,
        totalClicks: 50000,
        devotionPerSecond: 50,
        totalDevotion: 500000,
        currentLevel: 25,
        xp: 48000,
        nextLevelXp: 62500,
        xpPerSecond: 0,
        xpPerClick: 1,
        prestige: 5,
        prestigeLevel: 3,
      },
      upgrades: "ALL",
    },
  ];

  for (const userSeed of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: userSeed.email },
      update: {
        username: userSeed.username,
        passwordHash: userSeed.passwordHash,
      },
      create: {
        email: userSeed.email,
        username: userSeed.username,
        passwordHash: userSeed.passwordHash,
      },
    });

    // Ensure one GameStats per user
    const existingStats = await prisma.gameStats.findFirst({
      where: { userId: user.id },
    });
    if (existingStats) {
      await prisma.gameStats.update({
        where: { id: existingStats.id },
        data: {
          ...userSeed.stats,
          userId: user.id,
          lastCalculatedAt: new Date(),
          lastLoggedInAt: new Date(),
        },
      });
    } else {
      await prisma.gameStats.create({
        data: {
          ...userSeed.stats,
          userId: user.id,
          lastCalculatedAt: new Date(),
          lastLoggedInAt: new Date(),
          lastLoggedOutAt: new Date(),
          lastClickAt: new Date(),
        },
      });
    }

    // Give a basic card to each user
    const existingCard = await prisma.card.findFirst({
      where: { userId: user.id, cardId: cardType.id },
    });
    if (!existingCard) {
      await prisma.card.create({
        data: { userId: user.id, cardId: cardType.id, count: 1, level: 1 },
      });
    }

    const existingWsp = await prisma.worshipper.findFirst({
      where: { userId: user.id, worshipperId: worshipperType.id },
    });
    if (!existingWsp) {
      await prisma.worshipper.create({
        data: {
          userId: user.id,
          worshipperId: worshipperType.id,
          count: 1,
          level: 1,
        },
      });
    }
  }

  return demoUsers.length;
}

async function main() {
  console.log("🌱 Seeding database...");

  const achievementsCount = await upsertAchievements();
  const prototypes = await upsertPrototypes();
  const { effectsCount, cardLinks, worshipperLinks } =
    await upsertEffectsAndJoins(prototypes);
  const usersCount = await upsertUsersAndStats(prototypes);

  console.log("✅ Database seeded successfully!");
  console.log(`Upserted ${achievementsCount} achievements`);
  console.log(
    `Upserted ${effectsCount} effects, ${cardLinks} card links, ${worshipperLinks} worshipper links`
  );
  console.log(`Upserted ${usersCount} demo users with stats`);
}

main()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
