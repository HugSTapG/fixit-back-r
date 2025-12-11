-- =====================================================
-- SCRIPT DE DATOS DE PRUEBA PARA FIXIT
-- =====================================================

-- 1. TIPOS DE SERVICIOS (para Technician DB)
INSERT INTO tipos_servicios (nombre_servicio, descripcion_servicio, activo, created_at, updated_at) VALUES
('Electricidad', 'Instalación y reparación de sistemas eléctricos', true, NOW(), NOW()),
('Plomería', 'Reparación de tuberías, llaves y sistemas de agua', true, NOW(), NOW()),
('Carpintería', 'Fabricación y reparación de muebles de madera', true, NOW(), NOW()),
('Pintura', 'Pintura interior y exterior de viviendas', true, NOW(), NOW()),
('Albañilería', 'Construcción y reparación de estructuras', true, NOW(), NOW()),
('Jardinería', 'Mantenimiento de jardines y áreas verdes', true, NOW(), NOW())
ON CONFLICT (id_tipo_servicio) DO NOTHING;

-- 2. PARROQUIAS (para Geo DB - Guayaquil)
INSERT INTO parroquias (codigo_parroquia, codigo_canton, nombre_parroquia, created_at, updated_at) VALUES
('090101', '0901', 'Tarqui', NOW(), NOW()),
('090102', '0901', 'Ximena', NOW(), NOW()),
('090103', '0901', 'Ayacucho', NOW(), NOW()),
('090104', '0901', 'Bolívar', NOW(), NOW()),
('090105', '0901', 'Carbo', NOW(), NOW())
ON CONFLICT (codigo_parroquia) DO NOTHING;

-- 3. CANTONES (para Geo DB)
INSERT INTO cantones (codigo_canton, codigo_provincia, nombre_canton, created_at, updated_at) VALUES
('0901', '09', 'Guayaquil', NOW(), NOW())
ON CONFLICT (codigo_canton) DO NOTHING;

-- 4. PROVINCIAS (para Geo DB)
INSERT INTO provincias (codigo_provincia, nombre_provincia, created_at, updated_at) VALUES
('09', 'Guayas', NOW(), NOW())
ON CONFLICT (codigo_provincia) DO NOTHING;

-- 5. CERTIFICACIONES (para Technician DB)
INSERT INTO certificaciones (nombre_certificacion, descripcion_certificacion, institucion_emisora, activo, created_at, updated_at) VALUES
('SENESCYT - Electricidad Básica', 'Certificación básica en instalaciones eléctricas residenciales', 'SENESCYT', true, NOW(), NOW()),
('SECAP - Plomería', 'Certificación en sistemas de agua potable y sanitaria', 'SECAP', true, NOW(), NOW()),
('Curso Carpintería Avanzada', 'Certificado de carpintería y ebanistería', 'Instituto Técnico', true, NOW(), NOW())
ON CONFLICT (id_certificacion) DO NOTHING;

-- NOTA: Para insertar estos datos, conecta a cada base de datos:
-- psql -h localhost -p 5433 -U fixit_user -d fixit_technician_db < seed-data.sql
-- psql -h localhost -p 5434 -U fixit_user -d fixit_geo_db < seed-data.sql
