/*
  Warnings:

  - You are about to drop the column `rol` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."usuarios" DROP COLUMN "rol",
ADD COLUMN "roles" "public"."RolUsuario"[] DEFAULT ARRAY['CLIENTE']::"public"."RolUsuario"[];
