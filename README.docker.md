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

- Admin: http://localhost:5173

## Health check

```bash
curl -I http://localhost:5173
```

## File structure

```
.
|-- Dockerfile
|-- .dockerignore
|-- .env.docker
|-- README.docker.md
```
