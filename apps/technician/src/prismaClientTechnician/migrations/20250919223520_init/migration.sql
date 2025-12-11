-- CreateEnum
CREATE TYPE "public"."RolUsuario" AS ENUM ('ADMIN', 'TECNICO', 'CLIENTE');

-- CreateEnum
CREATE TYPE "public"."EstatusCertificacion" AS ENUM ('PENDIENTE', 'VERIFICADA', 'RECHAZADA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "public"."SubServicio" AS ENUM ('INSTALACION', 'REPARACION', 'MANTENIMIENTO', 'DESINSTALACION', 'REVISION', 'OTRO');

-- CreateEnum
CREATE TYPE "public"."PuntajeCalificacion" AS ENUM ('EXCELENTE', 'BUENO', 'REGULAR', 'MALO', 'TERRIBLE');

-- CreateTable
CREATE TABLE "public"."tecnicos" (
    "idTecnico" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "totalCalificaciones" INTEGER NOT NULL DEFAULT 0,
    "promedioCalificaciones" DECIMAL(3,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "tecnicos_pkey" PRIMARY KEY ("idTecnico")
);

-- CreateTable
CREATE TABLE "public"."certificaciones" (
    "idCertificacion" SERIAL NOT NULL,
    "nombreCertificacion" VARCHAR(100) NOT NULL,
    "entidadCertificacion" VARCHAR(100) NOT NULL,
    "descripcionCertificacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificaciones_pkey" PRIMARY KEY ("idCertificacion")
);

-- CreateTable
CREATE TABLE "public"."tecnicos_certificaciones" (
    "idTecCert" SERIAL NOT NULL,
    "idTecnico" INTEGER NOT NULL,
    "idCertificacion" INTEGER NOT NULL,
    "fechaObtencion" TIMESTAMP(3) NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "documento" JSONB,
    "estatusCertificacion" "public"."EstatusCertificacion" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tecnicos_certificaciones_pkey" PRIMARY KEY ("idTecCert")
);

-- CreateTable
CREATE TABLE "public"."tecnicos_parroquias" (
    "idTecnico" INTEGER NOT NULL,
    "codigoParroquia" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tecnicos_parroquias_pkey" PRIMARY KEY ("idTecnico","codigoParroquia")
);

-- CreateTable
CREATE TABLE "public"."tipos_servicios" (
    "idTipoServicio" SERIAL NOT NULL,
    "nombreServicio" VARCHAR(50) NOT NULL,
    "descripcionServicio" TEXT NOT NULL,
    "subServicio" "public"."SubServicio" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_servicios_pkey" PRIMARY KEY ("idTipoServicio")
);

-- CreateTable
CREATE TABLE "public"."tecnicos_servicios" (
    "idTecnico" INTEGER NOT NULL,
    "idTipoServicio" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tecnicos_servicios_pkey" PRIMARY KEY ("idTecnico","idTipoServicio")
);

-- CreateTable
CREATE TABLE "public"."solicitudes_tecnicos" (
    "idSolTec" SERIAL NOT NULL,
    "idSolicitud" INTEGER NOT NULL,
    "idTecnico" INTEGER NOT NULL,
    "costoAcordado" DECIMAL(10,2),
    "estadoAcuerdo" TEXT NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "tecnicos_idUser_key" ON "public"."tecnicos"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "tecnicos_certificaciones_idTecnico_idCertificacion_key" ON "public"."tecnicos_certificaciones"("idTecnico", "idCertificacion");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_tecnicos_idSolicitud_idTecnico_key" ON "public"."solicitudes_tecnicos"("idSolicitud", "idTecnico");

-- AddForeignKey
ALTER TABLE "public"."tecnicos_certificaciones" ADD CONSTRAINT "tecnicos_certificaciones_idTecnico_fkey" FOREIGN KEY ("idTecnico") REFERENCES "public"."tecnicos"("idTecnico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tecnicos_certificaciones" ADD CONSTRAINT "tecnicos_certificaciones_idCertificacion_fkey" FOREIGN KEY ("idCertificacion") REFERENCES "public"."certificaciones"("idCertificacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tecnicos_parroquias" ADD CONSTRAINT "tecnicos_parroquias_idTecnico_fkey" FOREIGN KEY ("idTecnico") REFERENCES "public"."tecnicos"("idTecnico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tecnicos_servicios" ADD CONSTRAINT "tecnicos_servicios_idTecnico_fkey" FOREIGN KEY ("idTecnico") REFERENCES "public"."tecnicos"("idTecnico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tecnicos_servicios" ADD CONSTRAINT "tecnicos_servicios_idTipoServicio_fkey" FOREIGN KEY ("idTipoServicio") REFERENCES "public"."tipos_servicios"("idTipoServicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solicitudes_tecnicos" ADD CONSTRAINT "solicitudes_tecnicos_idTecnico_fkey" FOREIGN KEY ("idTecnico") REFERENCES "public"."tecnicos"("idTecnico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."calificaciones" ADD CONSTRAINT "calificaciones_idTecnico_fkey" FOREIGN KEY ("idTecnico") REFERENCES "public"."tecnicos"("idTecnico") ON DELETE RESTRICT ON UPDATE CASCADE;
