-- Initialization script for Request Service database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for request service
CREATE TYPE estado_solicitud AS ENUM ('PENDIENTE', 'ACEPTADA', 'CANCELADA', 'COMPLETADA');
CREATE TYPE estado_aceptacion AS ENUM ('PROPUESTO', 'ACEPTADO', 'RECHAZADO');
CREATE TYPE metodo_pago AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'OTRO');
CREATE TYPE estado_pago AS ENUM ('PENDIENTE', 'PAGADO', 'FALLIDO');

-- Request service specific tables will be created by Prisma migrations
-- This script just ensures the database is ready with required extensions and enums

SELECT 'Request Service database initialized' as status;