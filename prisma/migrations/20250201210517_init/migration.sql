/*
  Warnings:

  - The values [ONE,TWO,THREE,FOUR,FIVE] on the enum `VideoRating` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'NotSubscribed';

-- AlterEnum
BEGIN;
CREATE TYPE "VideoRating_new" AS ENUM ('NOT_RATED', 'One', 'Tow', 'Three', 'Four', 'Five');
ALTER TABLE "Video" ALTER COLUMN "video_rate" DROP DEFAULT;
ALTER TABLE "Video" ALTER COLUMN "video_rate" TYPE "VideoRating_new" USING ("video_rate"::text::"VideoRating_new");
ALTER TYPE "VideoRating" RENAME TO "VideoRating_old";
ALTER TYPE "VideoRating_new" RENAME TO "VideoRating";
DROP TYPE "VideoRating_old";
ALTER TABLE "Video" ALTER COLUMN "video_rate" SET DEFAULT 'NOT_RATED';
COMMIT;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "status" SET DEFAULT 'NotSubscribed';
