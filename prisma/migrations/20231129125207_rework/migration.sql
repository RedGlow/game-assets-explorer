/*
  Warnings:

  - The primary key for the `TaggedFile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fullFilename` on the `TaggedFile` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `TaggedFile` table. All the data in the column will be lost.
  - Added the required column `fileFullName` to the `TaggedFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagKey` to the `TaggedFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagValue` to the `TaggedFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaggedFile" DROP CONSTRAINT "TaggedFile_pkey",
DROP COLUMN "fullFilename",
DROP COLUMN "tag",
ADD COLUMN     "fileFullName" TEXT NOT NULL,
ADD COLUMN     "tagKey" TEXT NOT NULL,
ADD COLUMN     "tagValue" TEXT NOT NULL,
ADD CONSTRAINT "TaggedFile_pkey" PRIMARY KEY ("tagKey", "tagValue", "fileFullName");
