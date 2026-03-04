# Docker Deployment Guide (Admin)

This repository contains Docker configuration for deploying the Hotbray Admin Next.js application.

## Quick Start

### Build image

```bash
docker build -t hotbray-admin:latest .
```

### Run container

```bash
docker run -d --name hotbray-admin -p 5173:3000 --restart unless-stopped hotbray-admin:latest
```

Access the application:

- Admin: https://hb1-b2b-dev-admin-a0ejezg4becaddh9.ukwest-01.azurewebsites.net

## Health check

```bash
curl -I https://hb1-b2b-dev-admin-a0ejezg4becaddh9.ukwest-01.azurewebsites.net
```

## File structure

```
.
|-- Dockerfile
|-- .dockerignore
|-- .env.docker
|-- README.docker.md
```
