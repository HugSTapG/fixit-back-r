-- Initialization script for Auth Service database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for auth service
CREATE TYPE rol_usuario AS ENUM ('ADMIN', 'TECNICO', 'CLIENTE');

-- Sessions and user management will be handled by Prisma migrations
-- This script just ensures the database is ready

SELECT 'Auth Service database initialized' as status;