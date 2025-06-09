# pake node base image
FROM node:22

# set workdir
WORKDIR /app

# copy package files
COPY package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY . .

# copy env file (i know this i bad practice, but idk how to do it better without breaking things up ok so sybau)
COPY .env .env

# expose port
EXPOSE 3001

# start app
CMD ["npm", "run", "dev"]