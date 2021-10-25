1. git clone
2. go to root folder
3. yarn install | npm install
4. copy ormconfig_example.json to ormconfig.json
5. update your credential in ormconfig.json to connect to mysql such as hostname, password, and username
6. copy .env.example to .env
7. update your credential in .env to connect to mysql such as hostname, password, and username
8. run this command yarn create:db
9. go to package.json and change line in
"create:key": "ts-node -r dotenv/config add_key.ts -keyName=perbasi-storage",

change -keyName=perbasi-storage to -keyName=yourapps
10. run this command yarn create:key
11. done, save the secret to the safest place

After that

1. run: yarn build
2. install pm2 as global: npm install --global pm2
3. pm2 start storage-service.config.js