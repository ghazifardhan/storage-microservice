import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { createConnection, getRepository } from 'typeorm';
import { checkApiKey } from './middlewares/check-api-key';
import multer from 'multer';
import { StorageController } from './controllers/storage/storage';
import path from 'path';
import appRoot from 'app-root-path';
import { Storage } from './models/storage/storage';
import { generalResponse } from './responses/general-responses';
import { httpResponse } from './responses/http-responses';
import { env } from './config/env';

// init express
export const app = express();

// init middleware
app.use(morgan('combined'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// multer file upload
const fileUploadEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname.replace(/\s+/g, '-').toLowerCase());
  }
});

export const uploadMulter = multer({ storage: fileUploadEngine });

// init controllers
export const initialiazedController = (controllers: any[]) => {

  // show file publicly
  app.use(`${env().API_STORAGE_PATH}`, express.static(path.join(appRoot.path, '/storage')));

  app.get(`${env().API_DOWNLOADS_PATH}:id`, (req: express.Request, res: express.Response) => {
    let storageRepo = getRepository(Storage);
    storageRepo.findOneOrFail({ id: req.params.id })
      .then(file => {
        return res.download(path.join(appRoot.path, `/${file.path}`));
      })
      .catch(error => {
        return generalResponse({
          data: null,
          status: false,
          message: 'file not found',
          res: res,
          httpResponse: httpResponse.NotFound
        })
      })
  });

  app.get(`${env().API_ASSETS_PATH}:id`, (req: express.Request, res: express.Response) => {
    let storageRepo = getRepository(Storage);
    storageRepo.findOneOrFail({ id: req.params.id })
      .then(file => {
        return res.sendFile(path.join(appRoot.path, `/${file.path}`));
      })
      .catch(error => {
        return generalResponse({
          data: null,
          status: false,
          message: 'file not found',
          res: res,
          httpResponse: httpResponse.NotFound
        })
      })
  });

  app.use(checkApiKey);
  controllers.forEach((controller) => {
    app.use(env().API_VERSION_PATH, controller.router);
  })
  app.get('/', (req: express.Request, res: express.Response) => {
    return res.status(200).send({
      config: env()
    });
  });
}

export const runServer = (port: number) => {
  createConnection().then(connection => {
    app.listen(port, () => {
      // init controller
      initialiazedController([
        new StorageController()
      ]);

      console.log(`Connection: ${connection.name}`);
      console.log(`App listening on the port ${port}`);
    });
  })
  .catch(err => {
    console.log("error.", err)
  })
}