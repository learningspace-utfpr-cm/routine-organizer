/*
  Warnings:

  - You are about to drop the column `feedback_sound_type` on the `atividades` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `atividades` table. All the data in the column will be lost.
  - You are about to drop the column `rotinaId` on the `atividades` table. All the data in the column will be lost.
  - Added the required column `creator_id` to the `atividades` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "atividades" DROP CONSTRAINT "atividades_rotinaId_fkey";

-- AlterTable
ALTER TABLE "atividades" DROP COLUMN "feedback_sound_type",
DROP COLUMN "order",
DROP COLUMN "rotinaId",
ADD COLUMN     "creator_id" TEXT NOT NULL;

-- DropEnum
DROP TYPE "feedback_sound_types";

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
