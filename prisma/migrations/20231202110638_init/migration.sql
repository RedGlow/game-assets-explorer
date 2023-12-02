-- CreateTable
CREATE TABLE "TaggedFile" (
    "tagKey" TEXT NOT NULL,
    "tagValue" TEXT NOT NULL,
    "fileFullName" TEXT NOT NULL,

    CONSTRAINT "TaggedFile_pkey" PRIMARY KEY ("tagKey","tagValue","fileFullName")
);

-- CreateTable
CREATE TABLE "PresignedDownloadUrls" (
    "fullname" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "PresignedDownloadUrls_pkey" PRIMARY KEY ("fullname")
);
