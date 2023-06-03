/*
  Warnings:

  - The values [Starting,Deploying,Running] on the enum `DeploymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeploymentStatus_new" AS ENUM ('Disabled', 'Building', 'Failed', 'Success', 'Removed');
ALTER TABLE "Service" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Deployment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Service" ALTER COLUMN "status" TYPE "DeploymentStatus_new" USING ("status"::text::"DeploymentStatus_new");
ALTER TABLE "Deployment" ALTER COLUMN "status" TYPE "DeploymentStatus_new" USING ("status"::text::"DeploymentStatus_new");
ALTER TYPE "DeploymentStatus" RENAME TO "DeploymentStatus_old";
ALTER TYPE "DeploymentStatus_new" RENAME TO "DeploymentStatus";
DROP TYPE "DeploymentStatus_old";
ALTER TABLE "Service" ALTER COLUMN "status" SET DEFAULT 'Building';
ALTER TABLE "Deployment" ALTER COLUMN "status" SET DEFAULT 'Building';
COMMIT;

-- AlterTable
ALTER TABLE "Deployment" ALTER COLUMN "status" SET DEFAULT 'Building';

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "status" SET DEFAULT 'Building';
