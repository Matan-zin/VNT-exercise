FROM node:lts-alpine3.14

RUN apk update \
    && apk upgrade

ENV PORT="5000"
ENV SERVICE_URL='0.0.0.0'

 
RUN mkdir -p /backend /backend/model/ /backend/route/ /backend/utils/

COPY package.json *.js conf.json /backend/
COPY model/ /backend/model/
COPY route/ /backend/route/
COPY utils/ /backend/utils/

WORKDIR /backend

RUN npm install

EXPOSE 5000

CMD [ "node", "./app.js" ]