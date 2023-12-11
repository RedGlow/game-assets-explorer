-- CreateTable
CREATE TABLE "File" (
    "fullName" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("fullName")
);

-- AddForeignKey
ALTER TABLE "TaggedFile" ADD CONSTRAINT "TaggedFile_fileFullName_fkey" FOREIGN KEY ("fileFullName") REFERENCES "File"("fullName") ON DELETE RESTRICT ON UPDATE CASCADE;
