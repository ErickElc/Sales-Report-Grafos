FROM node:20-alpine

# Install netcat for wait script
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Make scripts executable
RUN chmod +x scripts/*.sh 2>/dev/null || true

# Install mongosh for database checks
RUN apk add --no-cache mongodb-tools || true

EXPOSE 3000

CMD ["npm", "run", "dev"]

