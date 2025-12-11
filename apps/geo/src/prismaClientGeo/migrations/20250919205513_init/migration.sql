-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateTable
CREATE TABLE "public"."provincias" (
    "codigoProvincia" TEXT NOT NULL,
    "nombreProvincia" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provincias_pkey" PRIMARY KEY ("codigoProvincia")
);

-- CreateTable
CREATE TABLE "public"."cantones" (
    "codigoCanton" TEXT NOT NULL,
    "codigoProvincia" TEXT NOT NULL,
    "nombreCanton" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cantones_pkey" PRIMARY KEY ("codigoCanton")
);

-- CreateTable
CREATE TABLE "public"."parroquias" (
    "codigoParroquia" TEXT NOT NULL,
    "codigoCanton" TEXT NOT NULL,
    "nombreParroquia" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parroquias_pkey" PRIMARY KEY ("codigoParroquia")
);

-- CreateTable
CREATE TABLE "public"."ubicaciones" (
    "idUbicacion" SERIAL NOT NULL,
    "codigoParroquia" TEXT NOT NULL,
    "nombreUbicacion" TEXT NOT NULL,
    "descripcionUbicacion" TEXT NOT NULL,
    "ubicacion" geometry(Point, 4326),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ubicaciones_pkey" PRIMARY KEY ("idUbicacion")
);

-- AddForeignKey
ALTER TABLE "public"."cantones" ADD CONSTRAINT "cantones_codigoProvincia_fkey" FOREIGN KEY ("codigoProvincia") REFERENCES "public"."provincias"("codigoProvincia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parroquias" ADD CONSTRAINT "parroquias_codigoCanton_fkey" FOREIGN KEY ("codigoCanton") REFERENCES "public"."cantones"("codigoCanton") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ubicaciones" ADD CONSTRAINT "ubicaciones_codigoParroquia_fkey" FOREIGN KEY ("codigoParroquia") REFERENCES "public"."parroquias"("codigoParroquia") ON DELETE RESTRICT ON UPDATE CASCADE;
