FROM node:11-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

COPY . .

ENV NODE_ENV=production
EXPOSE 4000
CMD ["npm", "start"]