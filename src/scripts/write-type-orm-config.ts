import { configService } from "../config/config.service";
// import fs from 'fs';
import fs = require("fs");

console.log("Hello ", process.env.API_NAME);

fs.writeFileSync(
  "ormconfig.json",
  JSON.stringify(configService.getTypeOrmConfig(), null, 2)
);
