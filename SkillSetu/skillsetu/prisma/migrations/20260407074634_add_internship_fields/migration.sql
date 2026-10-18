-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "targetCareerId" TEXT,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" DATETIME,
    "weeklyGoal" INTEGER NOT NULL DEFAULT 3,
    CONSTRAINT "User_targetCareerId_fkey" FOREIGN KEY ("targetCareerId") REFERENCES "JobProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JobProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "avgSalary" TEXT NOT NULL,
    "learningTime" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SkillNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "JobProfileSkill" (
    "jobProfileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    PRIMARY KEY ("jobProfileId", "skillId"),
    CONSTRAINT "JobProfileSkill_jobProfileId_fkey" FOREIGN KEY ("jobProfileId") REFERENCES "JobProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobProfileSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "SkillNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkillDependency" (
    "skillId" TEXT NOT NULL,
    "dependsOnId" TEXT NOT NULL,

    PRIMARY KEY ("skillId", "dependsOnId"),
    CONSTRAINT "SkillDependency_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "SkillNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SkillDependency_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "SkillNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubskillNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "SubskillNode_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "SkillNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subskillId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "rating" REAL,
    CONSTRAINT "Resource_subskillId_fkey" FOREIGN KEY ("subskillId") REFERENCES "SubskillNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserResourceProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "liked" BOOLEAN,
    "lastViewed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserResourceProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserResourceProgress_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillId" TEXT NOT NULL,
    "subskillId" TEXT,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    CONSTRAINT "Task_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "SkillNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_subskillId_fkey" FOREIGN KEY ("subskillId") REFERENCES "SubskillNode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSkillState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subskillId" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "lastPracticedAt" DATETIME NOT NULL,
    "attemptCount" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "streak" INTEGER NOT NULL,
    CONSTRAINT "UserSkillState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserSkillState_subskillId_fkey" FOREIGN KEY ("subskillId") REFERENCES "SubskillNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeTakenMs" INTEGER,
    "masteryGain" REAL,
    CONSTRAINT "TaskAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TaskAttempt_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "questionsAnswered" INTEGER NOT NULL DEFAULT 0,
    "masteryGained" REAL NOT NULL DEFAULT 0,
    "goalMet" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "DailyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Badge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Proof" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "skillId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" TEXT,
    "fileUrl" TEXT,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Proof_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Proof_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "SkillNode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Internship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "stipend" TEXT,
    "duration" TEXT,
    "applicationDeadline" DATETIME,
    "detailUrl" TEXT,
    "postedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_InternshipToSkillNode" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_InternshipToSkillNode_A_fkey" FOREIGN KEY ("A") REFERENCES "Internship" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_InternshipToSkillNode_B_fkey" FOREIGN KEY ("B") REFERENCES "SkillNode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserResourceProgress_userId_resourceId_key" ON "UserResourceProgress"("userId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSkillState_userId_subskillId_key" ON "UserSkillState"("userId", "subskillId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyActivity_userId_date_key" ON "DailyActivity"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "_InternshipToSkillNode_AB_unique" ON "_InternshipToSkillNode"("A", "B");

-- CreateIndex
CREATE INDEX "_InternshipToSkillNode_B_index" ON "_InternshipToSkillNode"("B");
