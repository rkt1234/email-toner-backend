/*
  Warnings:

  - Changed the type of `rewrittenEmail` on the `Email` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Email" DROP COLUMN "rewrittenEmail",
ADD COLUMN     "rewrittenEmail" JSONB NOT NULL;
