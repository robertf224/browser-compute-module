ARG NODE_VERSION=18.18.0

FROM --platform=linux/amd64 node:${NODE_VERSION}

# Install Puppeteer dependencies
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV XDG_CONFIG_HOME=/tmp/.chromium
ENV XDG_CACHE_HOME=/tmp/.chromium
RUN apt-get update \
 && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends

WORKDIR /app
COPY package*.json .
RUN npm install
COPY src src
RUN npm run build
USER 5000
CMD ["node", "./dist/index.js"]
