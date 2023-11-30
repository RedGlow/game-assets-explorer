-- CreateTable
CREATE TABLE "PresignedDownloadUrls" (
    "fullname" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "PresignedDownloadUrls_pkey" PRIMARY KEY ("fullname")
);
