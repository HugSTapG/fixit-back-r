#!/bin/bash
set -e

echo "Initializing PostGIS extensions for Geo Service..."

# Enable PostGIS extensions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
EOSQL

echo "PostGIS extensions enabled successfully"

# Configure geometry column and spatial functions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Function to calculate distance between points in meters
    CREATE OR REPLACE FUNCTION calculate_distance(
        point1 geometry,
        point2 geometry
    ) RETURNS float AS \$\$
    BEGIN
        RETURN ST_Distance_Sphere(point1, point2);
    END;
    \$\$ LANGUAGE plpgsql;

    -- Function to find nearby ubicaciones
    CREATE OR REPLACE FUNCTION find_nearby_ubicaciones(
        longitude float,
        latitude float,
        max_distance_meters float
    ) RETURNS TABLE (
        id_ubicacion integer,
        nombre_ubicacion text,
        descripcion_ubicacion text,
        codigo_parroquia text,
        distance_meters float,
        longitude_coord float,
        latitude_coord float
    ) AS \$\$
    BEGIN
        RETURN QUERY
        SELECT
            u."idUbicacion"::integer,
            u."nombreUbicacion"::text,
            u."descripcionUbicacion"::text,
            u."codigoParroquia"::text,
            calculate_distance(u.ubicacion, ST_SetSRID(ST_MakePoint(longitude, latitude), 4326))::float AS distance_meters,
            ST_X(u.ubicacion)::float AS longitude_coord,
            ST_Y(u.ubicacion)::float AS latitude_coord
        FROM "ubicaciones" u
        WHERE u.ubicacion IS NOT NULL
        AND ST_DWithin(
            u.ubicacion,
            ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
            max_distance_meters / 111000.0
        )
        ORDER BY distance_meters;
    END;
    \$\$ LANGUAGE plpgsql;

    -- Function to create spatial indexes when tables exist
    CREATE OR REPLACE FUNCTION create_spatial_indexes() RETURNS void AS \$\$
    BEGIN
        IF EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'ubicaciones'
        ) THEN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_indexes
                WHERE indexname = 'idx_ubicaciones_ubicacion'
            ) THEN
                CREATE INDEX idx_ubicaciones_ubicacion ON "ubicaciones" USING GIST (ubicacion);
                RAISE NOTICE 'Spatial index created for ubicaciones table';
            END IF;
        END IF;
    END;
    \$\$ LANGUAGE plpgsql;
EOSQL

echo "PostGIS initialization completed successfully for Geo Service"
