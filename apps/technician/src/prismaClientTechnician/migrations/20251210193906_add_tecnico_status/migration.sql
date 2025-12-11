-- CreateEnum
CREATE TYPE "public"."TecnicoStatus" AS ENUM ('REGISTRADO', 'VERIFICACION_PENDIENTE', 'VERIFICADO', 'BLOQUEADO');

-- AlterTable
ALTER TABLE "public"."tecnicos" ADD COLUMN     "status" "public"."TecnicoStatus" NOT NULL DEFAULT 'REGISTRADO';
