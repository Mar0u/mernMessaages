FROM node:14
WORKDIR /client
COPY package*.json ./
RUN npm install css-minimizer-webpack-plugin --save
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
