/*
  Warnings:

  - You are about to drop the `validaciones_cedulas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."validaciones_cedulas" DROP CONSTRAINT "validaciones_cedulas_validadoPor_fkey";

-- DropTable
DROP TABLE "public"."validaciones_cedulas";
