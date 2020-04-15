# swish-auth
An opensource user management system with data privacy in mind

# Dependencies
* Redis - this is the memory store used for session management
* Mongodb - NoSQL persistent data storage

# Docker
Runing in docker
```
docker run -d --name s-auth -p 3000:3000 -e REDIS_HOST=redis-sess -e REDIS_PORT=6379 -e REDIS_DB=0 -e INGRESS_RATELIMIT_POINTS=8 -e INGRESS_RATELIMIT_DURATION=2 -e INGRESS_RATELIMIT_BLOCKDURATION=3 --link redis-sess adonisv79/swish-auth:latest
```
