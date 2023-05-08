-- AlterEnum
ALTER TYPE "DeploymentStatus" ADD VALUE 'Inactive';
COMMIT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "status" "DeploymentStatus" NOT NULL DEFAULT 'Inactive';
