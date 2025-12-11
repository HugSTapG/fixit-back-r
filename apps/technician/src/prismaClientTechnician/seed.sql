-- =====================================================
-- SEED DATA: TIPOS DE SERVICIOS (Fixit Technician DB)
-- Non-destructive seed - uses ON CONFLICT to avoid errors
-- =====================================================

-- MVP Service Categories with valid SubServicio enum values
INSERT INTO tipos_servicios ("nombreServicio", "descripcionServicio", "subServicio", "createdAt", "updatedAt")
VALUES
  ('Electricidad', 'Instalación y reparación de sistemas eléctricos residenciales', 'INSTALACION', NOW(), NOW()),
  ('Plomería', 'Reparación de tuberías, llaves y sistemas de agua sanitaria', 'REPARACION', NOW(), NOW()),
  ('Pintura', 'Pintura interior y exterior de viviendas y comercios', 'MANTENIMIENTO', NOW(), NOW()),
  ('Carpintería', 'Fabricación y reparación de muebles de madera', 'REVISION', NOW(), NOW()),
  ('Electrodomésticos', 'Reparación de electrodomésticos y equipos menores', 'REPARACION', NOW(), NOW()),
  ('Aire Acondicionado', 'Instalación y mantenimiento de sistemas de climatización', 'MANTENIMIENTO', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Verify insertion
SELECT 'Seed complete! Total service types:' as message, COUNT(*) as total FROM tipos_servicios;
