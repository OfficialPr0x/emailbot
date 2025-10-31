-- CreateTable
CREATE TABLE "ContentPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "hashtags" TEXT,
    "scheduledFor" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "mediaUrl" TEXT,
    "performance" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentPost_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PersonaProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "bio" TEXT,
    "hashtags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PersonaProfile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccountMetrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "followers" INTEGER NOT NULL,
    "following" INTEGER NOT NULL,
    "posts" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "shadowbanRisk" REAL NOT NULL DEFAULT 0.0,
    "engagementRate" REAL NOT NULL DEFAULT 0.0,
    CONSTRAINT "AccountMetrics_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AutomationTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "schedule" TEXT,
    "status" TEXT NOT NULL DEFAULT 'paused',
    "lastRun" DATETIME,
    "nextRun" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AutomationTask_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountMetrics_accountId_date_key" ON "AccountMetrics"("accountId", "date");
