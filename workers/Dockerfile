FROM ubuntu:latest

WORKDIR /app

# Install basic software support
RUN apt-get update && apt-get install --yes software-properties-common
RUN apt-get install -y build-essential libssl-dev libffi-dev

# Install npm and nodejs
RUN apt-get install nodejs -y
RUN apt-get install npm -y

# Install python
RUN apt-get install -y python3-pip
RUN apt-get install -y python3-dev

# Add the JDK 8 and accept licenses (mandatory)
RUN apt-get update && \
	apt-get install -y openjdk-8-jdk && \
	apt-get install -y ant && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* && \
	rm -rf /var/cache/oracle-jdk8-installer;

# Fix certificate issues
RUN apt-get update && \
	apt-get install -y ca-certificates-java && \
	apt-get clean && \
	update-ca-certificates -f && \
	rm -rf /var/lib/apt/lists/* && \
	rm -rf /var/cache/oracle-jdk8-installer;

COPY . .

RUN chmod 700  /
RUN chmod 755 -R app/temp/
RUN adduser --disabled-password --gecos "" strivia

RUN cd app && npm install
CMD cd app && npm run start
