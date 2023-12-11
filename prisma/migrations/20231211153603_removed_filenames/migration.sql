/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaggedFile" DROP CONSTRAINT "TaggedFile_fileFullName_fkey";

-- DropTable
DROP TABLE "File";
