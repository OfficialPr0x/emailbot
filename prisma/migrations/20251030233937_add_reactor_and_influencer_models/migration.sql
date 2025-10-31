-- CreateTable
CREATE TABLE "ContentRelease" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "prompt" TEXT,
    "style" TEXT,
    "mediaUrls" TEXT NOT NULL,
    "metadata" JSONB,
    "linkedPostId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentRelease_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Influencer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT,
    "followersCount" INTEGER NOT NULL,
    "engagementRate" REAL NOT NULL,
    "niche" TEXT NOT NULL,
    "region" TEXT,
    "authenticityScore" REAL NOT NULL DEFAULT 0.0,
    "contactEmail" TEXT,
    "contactDM" TEXT,
    "notes" TEXT,
    "tags" TEXT,
    "discoveredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Influencer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Collaboration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "influencerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'prospect',
    "type" TEXT,
    "outreachMessage" TEXT,
    "responseNotes" TEXT,
    "agreementTerms" JSONB,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "performance" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Collaboration_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Collaboration_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
