FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm rebuild bcrypt --build-from-source
RUN npm install
COPY . .
ENV NODE_ENV=production
EXPOSE 8080
CMD [ "npm", "start" ]
