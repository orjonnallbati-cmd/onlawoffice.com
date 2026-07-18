-- CreateEnum
CREATE TYPE "LegalBasis" AS ENUM ('CONSENT', 'CONTRACT', 'LEGAL_OBLIGATION', 'VITAL_INTEREST', 'PUBLIC_INTEREST', 'LEGITIMATE_INTEREST');

-- CreateEnum
CREATE TYPE "RopaStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BreachSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "BreachStatus" AS ENUM ('DETECTED', 'INVESTIGATING', 'CONTAINED', 'NOTIFIED', 'CLOSED');

-- CreateEnum
CREATE TYPE "DsarType" AS ENUM ('ACCESS', 'RECTIFICATION', 'ERASURE', 'RESTRICTION', 'PORTABILITY', 'OBJECTION');

-- CreateEnum
CREATE TYPE "DsarStatus" AS ENUM ('RECEIVED', 'IN_PROGRESS', 'EXTENDED', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DpiaRisk" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "DpiaStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'REVIEW_NEEDED');

-- CreateTable
CREATE TABLE "ropa_entries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT,
    "purpose" TEXT NOT NULL,
    "legalBasis" "LegalBasis" NOT NULL DEFAULT 'CONTRACT',
    "dataCategories" TEXT,
    "dataSubjects" TEXT,
    "recipients" TEXT,
    "transfers" TEXT,
    "retention" TEXT,
    "securityMeasures" TEXT,
    "status" "RopaStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT,

    CONSTRAINT "ropa_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_breaches" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "occurredAt" TIMESTAMP(3),
    "discoveredAt" TIMESTAMP(3) NOT NULL,
    "notifiedAuthorityAt" TIMESTAMP(3),
    "notifiedSubjectsAt" TIMESTAMP(3),
    "severity" "BreachSeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "BreachStatus" NOT NULL DEFAULT 'DETECTED',
    "affectedSubjects" INTEGER,
    "dataCategories" TEXT,
    "measures" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT,

    CONSTRAINT "data_breaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dsar_requests" (
    "id" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "subjectEmail" TEXT,
    "type" "DsarType" NOT NULL DEFAULT 'ACCESS',
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" "DsarStatus" NOT NULL DEFAULT 'RECEIVED',
    "description" TEXT,
    "response" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT,

    CONSTRAINT "dsar_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dpias" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "processName" TEXT,
    "description" TEXT,
    "riskLevel" "DpiaRisk" NOT NULL DEFAULT 'MEDIUM',
    "status" "DpiaStatus" NOT NULL DEFAULT 'DRAFT',
    "mitigations" TEXT,
    "consultedAuthority" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "reviewDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT,

    CONSTRAINT "dpias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ropa_entries_userId_status_idx" ON "ropa_entries"("userId", "status");

-- CreateIndex
CREATE INDEX "data_breaches_userId_status_idx" ON "data_breaches"("userId", "status");

-- CreateIndex
CREATE INDEX "dsar_requests_userId_status_idx" ON "dsar_requests"("userId", "status");

-- CreateIndex
CREATE INDEX "dpias_userId_status_idx" ON "dpias"("userId", "status");

-- AddForeignKey
ALTER TABLE "ropa_entries" ADD CONSTRAINT "ropa_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ropa_entries" ADD CONSTRAINT "ropa_entries_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_breaches" ADD CONSTRAINT "data_breaches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_breaches" ADD CONSTRAINT "data_breaches_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dsar_requests" ADD CONSTRAINT "dsar_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dsar_requests" ADD CONSTRAINT "dsar_requests_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dpias" ADD CONSTRAINT "dpias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dpias" ADD CONSTRAINT "dpias_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

