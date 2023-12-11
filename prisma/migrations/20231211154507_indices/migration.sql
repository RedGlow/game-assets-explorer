-- CreateIndex
CREATE INDEX "TaggedFile_tagKey_idx" ON "TaggedFile"("tagKey");

-- CreateIndex
CREATE INDEX "TaggedFile_tagKey_tagValue_idx" ON "TaggedFile"("tagKey", "tagValue");

-- CreateIndex
CREATE INDEX "TaggedFile_fileFullName_eq" ON "TaggedFile"("fileFullName");

-- CreateIndex
CREATE INDEX "TaggedFile_fileFullName_trgm" ON "TaggedFile" USING GIST ("fileFullName" gist_trgm_ops);
