-- CreateEnum
CREATE TYPE "public"."tipo_notificacion" AS ENUM ('SOLICITUD_NUEVA', 'SOLICITUD_ACEPTADA', 'SOLICITUD_COMPLETADA', 'CALIFICACION_RECIBIDA', 'RECORDATORIO');

-- CreateTable
CREATE TABLE "public"."notificaciones" (
    "idNotificacion" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "mensaje" VARCHAR(255) NOT NULL,
    "estadoLectura" BOOLEAN NOT NULL DEFAULT false,
    "tipoNotificacion" "public"."tipo_notificacion" NOT NULL,
    "fechaEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("idNotificacion")
);

-- CreateTable
CREATE TABLE "public"."tokens_notificaciones" (
    "idTokenNotificacion" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "tokenDispositivo" VARCHAR(255) NOT NULL,
    "plataforma" VARCHAR(50) NOT NULL,
    "estadoDispositivo" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_notificaciones_pkey" PRIMARY KEY ("idTokenNotificacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_notificaciones_idUser_tokenDispositivo_key" ON "public"."tokens_notificaciones"("idUser", "tokenDispositivo");
