FROM node:24-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5174

CMD ["yarn", "dev", "--host"]
