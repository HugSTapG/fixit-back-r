-- CreateEnum
CREATE TYPE "public"."metodo_pago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'OTRO');

-- CreateEnum
CREATE TYPE "public"."estado_pago" AS ENUM ('PENDIENTE', 'PAGADO', 'FALLIDO');

-- CreateTable
CREATE TABLE "public"."transacciones" (
    "idTransaccion" SERIAL NOT NULL,
    "idSolicitud" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodoPago" "public"."metodo_pago" NOT NULL,
    "estadoPago" "public"."estado_pago" NOT NULL DEFAULT 'PENDIENTE',
    "fechaPago" TIMESTAMP(3),
    "referencia" VARCHAR(100),
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transacciones_pkey" PRIMARY KEY ("idTransaccion")
);
