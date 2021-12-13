FROM node:16.11.0
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm i
COPY . .
CMD [ "npm", "start" ]
