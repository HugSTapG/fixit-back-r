-- CreateEnum
CREATE TYPE "public"."EstadoSolicitud" AS ENUM ('PENDIENTE', 'ACEPTADA', 'CANCELADA', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "public"."EstadoAceptacion" AS ENUM ('PROPUESTO', 'ACEPTADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "public"."PuntajeCalificacion" AS ENUM ('EXCELENTE', 'BUENO', 'REGULAR', 'MALO', 'TERRIBLE');

-- CreateEnum
CREATE TYPE "public"."MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'OTRO');

-- CreateEnum
CREATE TYPE "public"."EstadoPago" AS ENUM ('PENDIENTE', 'PAGADO', 'FALLIDO');

-- CreateTable
CREATE TABLE "public"."solicitudes" (
    "idSolicitud" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idTipoServicio" INTEGER NOT NULL,
    "codigoParroquia" TEXT NOT NULL,
    "tituloProblema" VARCHAR(100) NOT NULL,
    "descripcionProblema" TEXT NOT NULL,
    "costoEstimado" DECIMAL(10,2),
    "costoPromocion" DECIMAL(10,2),
    "promocion" BOOLEAN NOT NULL DEFAULT false,
    "estadoSolicitud" "public"."EstadoSolicitud" NOT NULL,
    "fechaProgramada" TIMESTAMP(3),
    "fechaPublicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaInicio" TIMESTAMP(3),
    "fechaFinalizacion" TIMESTAMP(3),
    "duracionEstimadaMin" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("idSolicitud")
);

-- CreateTable
CREATE TABLE "public"."solicitudes_tecnicos" (
    "idSolTec" SERIAL NOT NULL,
    "idSolicitud" INTEGER NOT NULL,
    "idTecnico" INTEGER NOT NULL,
    "costoAcordado" DECIMAL(10,2),
    "estadoAcuerdo" "public"."EstadoAceptacion" NOT NULL,
    "fechaPropuesta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaConfirmada" TIMESTAMP(3),
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_tecnicos_pkey" PRIMARY KEY ("idSolTec")
);

-- CreateTable
CREATE TABLE "public"."calificaciones" (
    "idCalificacion" SERIAL NOT NULL,
    "idSolicitud" INTEGER NOT NULL,
    "idTecnico" INTEGER NOT NULL,
    "puntaje" "public"."PuntajeCalificacion" NOT NULL,
    "comentario" TEXT,
    "fechaCalificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calificaciones_pkey" PRIMARY KEY ("idCalificacion")
);

-- CreateTable
CREATE TABLE "public"."transacciones" (
    "idTransaccion" SERIAL NOT NULL,
    "idSolicitud" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodoPago" "public"."MetodoPago" NOT NULL,
    "estadoPago" "public"."EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "fechaPago" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transacciones_pkey" PRIMARY KEY ("idTransaccion")
);

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_tecnicos_idSolicitud_idTecnico_key" ON "public"."solicitudes_tecnicos"("idSolicitud", "idTecnico");

-- AddForeignKey
ALTER TABLE "public"."solicitudes_tecnicos" ADD CONSTRAINT "solicitudes_tecnicos_idSolicitud_fkey" FOREIGN KEY ("idSolicitud") REFERENCES "public"."solicitudes"("idSolicitud") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."calificaciones" ADD CONSTRAINT "calificaciones_idSolicitud_fkey" FOREIGN KEY ("idSolicitud") REFERENCES "public"."solicitudes"("idSolicitud") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transacciones" ADD CONSTRAINT "transacciones_idSolicitud_fkey" FOREIGN KEY ("idSolicitud") REFERENCES "public"."solicitudes"("idSolicitud") ON DELETE RESTRICT ON UPDATE CASCADE;
