FROM node:alpine

WORKDIR /var/opt/contact-list

COPY package.json .
COPY src/ ./src/
RUN npm install

VOLUME ["/var/opt/contact-list/src"]

EXPOSE 3000

ENTRYPOINT [ "npm" ]
CMD [ "start" ]