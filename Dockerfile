FROM node:16 as base

WORKDIR /app
COPY package.json \
  ./

RUN yarn --production
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune


COPY nest-cli.json \
  tsconfig.* \
#  .eslintrc.js \
#  .prettierrc \
  ./

COPY . .
RUN yarn

# RUN yarn lint
RUN yarn build

# lint and formatting configs are commented out
# uncomment if you want to add them into the build process

# use one of the smallest images possible
FROM node:16-alpine

# get package.json from base
COPY --from=base /app/package.json ./

# get the dist back
COPY --from=base /app/dist/ ./dist/

# get the node_modules from the intial cache
COPY --from=base /app/node_modules/ ./node_modules/

# expose application port
EXPOSE 3000

# start
CMD ["node", "dist/main.js"]
