FROM alpine AS base

RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    apk add --no-cache chromium nodejs npm

FROM base

WORKDIR /app

ADD . .

RUN npm install

RUN npm run build

EXPOSE 8081

CMD [ "npm", "run", "start" ]