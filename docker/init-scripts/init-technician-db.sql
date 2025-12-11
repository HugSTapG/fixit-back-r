-- Initialization script for Technician Service database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for technician service
CREATE TYPE rol_usuario AS ENUM ('ADMIN', 'TECNICO', 'CLIENTE');
CREATE TYPE estatus_certificacion AS ENUM ('PENDIENTE', 'VERIFICADA', 'RECHAZADA', 'VENCIDA');
CREATE TYPE sub_servicio AS ENUM ('INSTALACION', 'REPARACION', 'MANTENIMIENTO', 'DESINSTALACION', 'REVISION', 'OTRO');
CREATE TYPE puntaje_calificacion AS ENUM ('EXCELENTE', 'BUENO', 'REGULAR', 'MALO', 'TERRIBLE');

-- Technician service specific tables will be created by Prisma migrations
-- This script just ensures the database is ready with required extensions

SELECT 'Technician Service database initialized' as status;
