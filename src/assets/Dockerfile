FROM node:latest

# Install your app
WORKDIR /server
COPY package*.json ./
RUN ["npm", "install"]
COPY . .
EXPOSE 9000

RUN ["npm", "install", "nodemon"]

# Run the app
CMD ["npm", "run", "dev"]