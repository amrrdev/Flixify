-- DropForeignKey
ALTER TABLE "ResetPasswords" DROP CONSTRAINT "ResetPasswords_userId_fkey";

-- AddForeignKey
ALTER TABLE "ResetPasswords" ADD CONSTRAINT "ResetPasswords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
