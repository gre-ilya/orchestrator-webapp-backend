-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "ip" DROP NOT NULL,
ALTER COLUMN "port" DROP NOT NULL,
ALTER COLUMN "variables" DROP NOT NULL;