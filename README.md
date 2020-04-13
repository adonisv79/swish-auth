# swish-auth
An opensource user management system with data privacy in mind

# Dependencies
* Redis - this is the memory store used for session management
* Mongodb - NoSQL persistent data storage

# Docker
Runing in docker
```
docker run -it --name s-auth -p 3001:3000 -e REDIS_HOST=127.0.0.1 -e REDIS_PORT=6379 -e REDIS_DB=0 -e REDIS_PASS=password adonisv79/swish-auth:latest
```