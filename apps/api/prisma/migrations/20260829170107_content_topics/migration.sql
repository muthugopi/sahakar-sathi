-- CreateEnum
CREATE TYPE "ContentSection" AS ENUM ('COOPERATIVE_LAW', 'PACS', 'FINANCIAL_LITERACY', 'PMFBY');

-- CreateTable
CREATE TABLE "ContentTopic" (
    "id" TEXT NOT NULL,
    "section" "ContentSection" NOT NULL,
    "slug" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "simpleExplanation" TEXT NOT NULL,
    "detailedExplanation" TEXT,
    "example" TEXT,
    "authority" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "language" "Language" NOT NULL DEFAULT 'en',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentTopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentTopic_slug_key" ON "ContentTopic"("slug");

-- CreateIndex
CREATE INDEX "ContentTopic_section_order_idx" ON "ContentTopic"("section", "order");
