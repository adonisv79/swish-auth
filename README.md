# swish-auth
An opensource user management system with data privacy in mind

# Dependencies
* Redis - this is the memory store used for session management
* Mongodb - NoSQL persistent data storage

# Docker
Running in docker
```
// make sure to have a runing redis container or service
docker run -d --name redis-sess -p 6379:6379 -e REDIS_PASSWORD=password redis:latest

// then also have the mongodb container or service running
docker run -d --name mongo-main -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest

docker run -d --name s-auth -p 3000:3000 --link redis-sess \
  -e REDIS_HOST=redis-sess -e REDIS_PORT=6379 -e REDIS_DB=0 -e REDIS_PASS=password \
  -e INGRESS_RATELIMIT_POINTS=8 -e INGRESS_RATELIMIT_DURATION=2 -e INGRESS_RATELIMIT_BLOCKDURATION=3 \
  adonisv79/swish-auth:latest
```
