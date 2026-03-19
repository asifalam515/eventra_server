-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MODERATOR';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photo" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
