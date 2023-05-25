FROM node:alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
COPY . .
RUN npm install --omit=dev
RUN npx prisma generate
EXPOSE 3000
CMD npm start
