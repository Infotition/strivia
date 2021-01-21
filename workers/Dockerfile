FROM ubuntu:20.04

RUN apt-get update -y
RUN apt-get install nodejs -y
RUN apt-get install npm -y

RUN node -v
RUN npm -v

COPY . .

RUN chmod 700  /
RUN chmod 755 -R temp/
RUN adduser --disabled-password --gecos "" strivia

RUN cd app && npm install
CMD cd app &&  npm run circleTest
