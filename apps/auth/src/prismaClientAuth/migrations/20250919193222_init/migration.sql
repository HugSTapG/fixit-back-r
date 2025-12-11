-- CreateEnum
CREATE TYPE "public"."RolUsuario" AS ENUM ('ADMIN', 'TECNICO', 'CLIENTE');

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "idUser" SERIAL NOT NULL,
    "cedula" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "passwordHash" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "fechaNacimiento" TIMESTAMP(3),
    "rol" "public"."RolUsuario" NOT NULL DEFAULT 'CLIENTE',
    "emailVerificado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "public"."sesiones_usuarios" (
    "idSesion" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaExpiracion" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "refreshExpiresAt" TIMESTAMP(3),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "sesiones_usuarios_pkey" PRIMARY KEY ("idSesion")
);

-- CreateTable
CREATE TABLE "public"."validaciones_cedulas" (
    "idValidacion" SERIAL NOT NULL,
    "cedula" TEXT NOT NULL,
    "esValida" BOOLEAN NOT NULL,
    "motivoRechazo" TEXT,
    "fechaValidacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validadoPor" INTEGER,

    CONSTRAINT "validaciones_cedulas_pkey" PRIMARY KEY ("idValidacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cedula_key" ON "public"."usuarios"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_usuarios_token_key" ON "public"."sesiones_usuarios"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_usuarios_accessToken_key" ON "public"."sesiones_usuarios"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_usuarios_refreshToken_key" ON "public"."sesiones_usuarios"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "validaciones_cedulas_cedula_key" ON "public"."validaciones_cedulas"("cedula");

-- AddForeignKey
ALTER TABLE "public"."sesiones_usuarios" ADD CONSTRAINT "sesiones_usuarios_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "public"."usuarios"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."validaciones_cedulas" ADD CONSTRAINT "validaciones_cedulas_validadoPor_fkey" FOREIGN KEY ("validadoPor") REFERENCES "public"."usuarios"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;
