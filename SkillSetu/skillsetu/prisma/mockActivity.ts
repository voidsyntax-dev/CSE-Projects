const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function mockActivity() {
  const user = await prisma.user.findUnique({ where: { email: "test@example.com" } });
  if (!user) {
    console.log("No test user found, skipping activity mocking.");
    return;
  }

  console.log(`Creating mock analytics for user ${user.id}...`);

  // Define some core tasks from the DB to mock attempts on
  const tasks = await prisma.task.findMany({ take: 10 });
  if (tasks.length === 0) return;

  // Let's create a 7-day streak with random gains
  const now = new Date();
  let totalMasteryMap: Record<string, number> = {};

  for (let i = 6; i >= 0; i--) {
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - i);
    timestamp.setHours(14, Math.floor(Math.random() * 60), 0, 0); // ~2pm practice sessions

    const attemptsToLog = Math.floor(Math.random() * 5) + 3; // 3 to 7 questions a day
    
    for (let j = 0; j < attemptsToLog; j++) {
      const task = tasks[Math.floor(Math.random() * tasks.length)];
      if (!task.subskillId) continue;
      
      const isCorrect = Math.random() > 0.3; // 70% correct
      const masteryGain = isCorrect ? (Math.random() * 10 + 2) : 0; // 2 to 12 gain if correct

      const stateKey = `${user.id}_${task.subskillId}`;
      if (!totalMasteryMap[stateKey]) totalMasteryMap[stateKey] = 0;
      totalMasteryMap[stateKey] += masteryGain;
      // Cap at 100
      if (totalMasteryMap[stateKey] > 100) { totalMasteryMap[stateKey] = 100; continue; }

      await prisma.taskAttempt.create({
        data: {
          userId: user.id,
          taskId: task.id,
          answer: isCorrect ? task.answer : "WrongAnswerMock",
          isCorrect,
          timestamp,
          timeTakenMs: Math.floor(Math.random() * 20000) + 5000,
          masteryGain
        }
      });
      
      // Update the userSkillState mock
      await prisma.userSkillState.upsert({
        where: {
          userId_subskillId: {
            userId: user.id,
            subskillId: task.subskillId
          }
        },
        create: {
          userId: user.id,
          subskillId: task.subskillId,
          score: totalMasteryMap[stateKey],
          lastPracticedAt: timestamp,
          attemptCount: 1,
          correctCount: isCorrect ? 1 : 0,
          streak: isCorrect ? 1 : 0
        },
        update: {
          score: totalMasteryMap[stateKey],
          lastPracticedAt: timestamp,
          attemptCount: { increment: 1 },
          correctCount: { increment: isCorrect ? 1 : 0 }
        }
      });
    }
  }

  // Set the user streak to 7
  await prisma.user.update({
    where: { id: user.id },
    data: {
      currentStreak: 7,
      longestStreak: 12,
      lastActiveDate: now
    }
  });

  console.log("🚀 Mock activity successfully seeded!");
}

mockActivity()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export {};
