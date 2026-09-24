CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'DEVELOPER'
);

CREATE TABLE IF NOT EXISTS microservices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    "endpointUrl" VARCHAR(255),
    environment VARCHAR(20),
    status VARCHAR(20),
    version VARCHAR(50),
    "ownerEmail" VARCHAR(255),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
