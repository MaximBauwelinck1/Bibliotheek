-- CreateTable
CREATE TABLE "PasswordReset" (
    "gebruiker_id" UUID NOT NULL,
    "hashed_token" VARCHAR(255) NOT NULL,
    "aangemaakt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vervalt_binnen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("gebruiker_id")
);

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_gebruiker_id_fkey" FOREIGN KEY ("gebruiker_id") REFERENCES "Gebruiker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
