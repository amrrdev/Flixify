-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('User', 'Admin');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'User';
