-- Script de inicialización para la base de datos del microservicio de pagos

-- Crear la base de datos para el microservicio de pagos
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fixit_payment_db') THEN
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE fixit_payment_db');
    END IF;
END
$$;

-- Crear usuario específico para el microservicio si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'payment_service') THEN
        CREATE ROLE payment_service WITH LOGIN PASSWORD 'payment_password123';
    END IF;
END
$$;

-- Otorgar permisos al usuario del microservicio
GRANT ALL PRIVILEGES ON DATABASE fixit_payment_db TO payment_service;