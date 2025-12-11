-- =====================================================
-- SEED DATA: GEO SERVICE - GUAYAQUIL ONLY
-- Basado en división administrativa oficial del INEC
-- Relaciones: Provincia → Cantón → Parroquias (16 urbanas)
-- =====================================================

-- 1. PROVINCIA: Guayas (código oficial 09)
INSERT INTO "provincias" ("codigoProvincia", "nombreProvincia", "createdAt", "updatedAt")
VALUES ('09', 'Guayas', NOW(), NOW())
ON CONFLICT ("codigoProvincia") DO NOTHING;

-- 2. CANTÓN: Guayaquil (código oficial 0901)
INSERT INTO "cantones" ("codigoCanton", "codigoProvincia", "nombreCanton", "createdAt", "updatedAt")
VALUES ('0901', '09', 'Guayaquil', NOW(), NOW())
ON CONFLICT ("codigoCanton") DO NOTHING;

-- 3. PARROQUIAS URBANAS OFICIALES DE GUAYAQUIL (16 del INEC)
-- Orden alfabético, códigos según INEC
INSERT INTO "parroquias" ("codigoParroquia", "codigoCanton", "nombreParroquia", "createdAt", "updatedAt")
VALUES
  ('090103', '0901', 'Ayacucho', NOW(), NOW()),
  ('090104', '0901', 'Bolívar', NOW(), NOW()),
  ('090105', '0901', 'Carbo', NOW(), NOW()),
  ('090106', '0901', 'García Moreno', NOW(), NOW()),
  ('090114', '0901', 'Nueve de Octubre', NOW(), NOW()),
  ('090108', '0901', 'Olmedo', NOW(), NOW()),
  ('090109', '0901', 'Pascuales', NOW(), NOW()),
  ('090110', '0901', 'Roca', NOW(), NOW()),
  ('090111', '0901', 'Rocafuerte', NOW(), NOW()),
  ('090116', '0901', 'San Alejo', NOW(), NOW()),
  ('090115', '0901', 'Santa Ana', NOW(), NOW()),
  ('090112', '0901', 'Sucre', NOW(), NOW()),
  ('090102', '0901', 'Tarqui', NOW(), NOW()),
  ('090113', '0901', 'Urdaneta', NOW(), NOW()),
  ('090101', '0901', 'Ximena', NOW(), NOW()),
  ('090107', '0901', 'Letamendi', NOW(), NOW())
ON CONFLICT ("codigoParroquia") DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

SELECT 'Seed execution completed. Guayaquil data summary:' as message;

SELECT 'Total records by table:' as info;
SELECT 
  'Provincias' as tabla, COUNT(*) as total FROM "provincias"
UNION ALL
SELECT 'Cantones', COUNT(*) FROM "cantones"
UNION ALL
SELECT 'Parroquias', COUNT(*) FROM "parroquias";

-- Show all parroquias ordered by nombre
SELECT 'Parroquias of Guayaquil (alphabetical):' as info;
SELECT 
  p."codigoParroquia",
  p."nombreParroquia",
  c."nombreCanton",
  pr."nombreProvincia"
FROM "parroquias" p
JOIN "cantones" c ON p."codigoCanton" = c."codigoCanton"
JOIN "provincias" pr ON c."codigoProvincia" = pr."codigoProvincia"
ORDER BY p."nombreParroquia" ASC;
