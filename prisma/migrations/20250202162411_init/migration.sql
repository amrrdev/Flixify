-- CreateTable
CREATE TABLE "ResetPasswords" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ResetPasswords_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResetPasswords" ADD CONSTRAINT "ResetPasswords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
