FROM node:16-alpine as builder 

WORKDIR /frontend

COPY . .

RUN npm ci 

RUN yarn run build


FROM nginx:alpine

COPY .nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /frontend/dist /usr/share/nginx/html

EXPOSE 3030

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]