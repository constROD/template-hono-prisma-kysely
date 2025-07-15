-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "reset_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reset_blocked_until" TIMESTAMPTZ(6),
ADD COLUMN     "reset_code" VARCHAR(6),
ADD COLUMN     "reset_code_expires" TIMESTAMPTZ(6);
