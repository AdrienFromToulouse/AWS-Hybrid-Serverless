FROM ubuntu:14.04

MAINTAINER Adrien

ENV ENVIRONMENT developer
ENV AWS_PROFILE perso

####
# Install Node.js
RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - && \
    apt-get install --yes nodejs

####
# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update -y && \
    apt-get install yarn -y

####
# Define working directory
RUN mkdir -p /usr/local/src/serverless
WORKDIR /usr/local/src/serverless

COPY ./binaries /usr/local/src/serverless/binaries
RUN ls -la
COPY ./build/ /usr/local/src/serverless/
RUN ls -la

####
# Run Worker
CMD AWS_PROFILE=$AWS_PROFILE ENVIRONMENT=$ENVIRONEMNT node ./lib/worker.js
