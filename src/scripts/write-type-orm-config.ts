import { configService } from '../config/config.service';
// import fs from 'fs';
import fs = require('fs');
fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configService.getTypeOrmConfig(), null, 2),
);
