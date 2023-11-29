-- CreateTable
CREATE TABLE "TaggedFile" (
    "fullFilename" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "TaggedFile_pkey" PRIMARY KEY ("fullFilename","tag")
);
