-- Enforce one feedback row per user per message (anonymous rows unaffected: NULLs are distinct)
CREATE UNIQUE INDEX "Feedback_userId_messageId_key" ON "Feedback"("userId", "messageId");
