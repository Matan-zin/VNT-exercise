FROM node:lts-alpine3.14 as build

RUN apk update

WORKDIR /frontend

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --prodection

COPY . .

RUN npm run build



FROM nginx:stable-alpine as prod

COPY --from=build /frontend/build/ /usr/share/nginx/html/

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]