FROM node:10-alpine
LABEL description="swish authentication project"
LABEL author="Adonis Lee Villamor (adonisv79@gmail.com)"

# SET ENVIRONMENTS
ENV NODE_ENV=production
ENV SERVER_LOG_LEVEL=info
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379
ENV REDIS_DB_SESSION=0
ENV REDIS_DB_RATELIMIT=1
ENV REDIS_PASS=
ENV USER_SESSION_MAX_TTL=21600
ENV USER_SESSION_IDLE_TTL=1800
ENV MONGODB_CONN=mongodb://localhost:27017/test
ENV INGRESS_RATELIMIT_POINTS=10
ENV INGRESS_RATELIMIT_DURATION=1
ENV INGRESS_RATELIMIT_CONSUMPTION=1
ENV INGRESS_RATELIMIT_BLOCKDURATION=5

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm cache clean --force
RUN npm ci --only=production

# copy only TS compiled outputs folder
COPY dist/src/ ./

# EXPRESS PORT
EXPOSE 3000

# Execute node on index.js
CMD [ "node", "index.js" ]