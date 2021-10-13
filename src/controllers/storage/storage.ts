import { Request, Response, Router } from 'express';
import { lutimesSync } from 'fs';
import { getRepository } from 'typeorm';
import { Storage } from '../../models/storage/storage';
import { generalResponse } from '../../responses/general-responses';
import { httpResponse } from '../../responses/http-responses';
import { uploadMulter } from '../../server';

export class StorageController {
  
  private path = '/storage';
  private router = Router();

  constructor() {
    this.initializedRoutes();
  }

  private initializedRoutes() {
    this.router.post(this.path + '/single', uploadMulter.single("file"), this.singleFile);
    this.router.post(this.path + '/multiple', uploadMulter.fields([{ name: 'files' }]), this.multipleFile);
  }

  private async singleFile(req: Request, res: Response) {
    let storageRepo = getRepository(Storage);

    if (req.file !== undefined) {
      let storage = new Storage();
      storage.fieldName = req.file.fieldname;
      storage.filename = req.file.filename;
      storage.originalName = req.file.originalname;
      storage.encoding = req.file.encoding;
      storage.mimetype = req.file.mimetype;
      storage.destination = req.file.destination;
      storage.path = req.file.path;
      storage.size = req.file.size;

      try {
        let save = await storageRepo.save(storage);
        return generalResponse({
          data: save,
          status: true,
          message: 'file created',
          res: res,
          httpResponse: httpResponse.Success
        });
      } catch (e) {
        return generalResponse({
          data: null,
          status: false,
          message: 'file failed to create',
          res: res,
          httpResponse: httpResponse.Conflict
        });
      }
    } else {
      return generalResponse({
        data: null,
        status: false,
        message: 'file failed to create',
        res: res,
        httpResponse: httpResponse.Conflict
      });
    }
  }

  private async multipleFile(req: Request, res: Response) {
    let storageRepo = getRepository(Storage);

    if (req.files !== undefined) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.files !== undefined) {
        if (files.files.length > 0) {
          let storages: Storage[] = [];
          for (let i = 0; i < files.files.length; i++) {
            let storage = new Storage();
            storage.fieldName = files.files[i].fieldname;
            storage.filename = files.files[i].filename;
            storage.originalName = files.files[i].originalname;
            storage.encoding = files.files[i].encoding;
            storage.mimetype = files.files[i].mimetype;
            storage.destination = files.files[i].destination;
            storage.path = files.files[i].path;
            storage.size = files.files[i].size;
            let save = await storageRepo.save(storage);
            storages.push(save);
          }

          return generalResponse({
            data: storages,
            status: true,
            message: 'files created',
            res: res,
            httpResponse: httpResponse.Success
          });
        } else {
          return generalResponse({
            data: null,
            status: false,
            message: 'file failed to create',
            res: res,
            httpResponse: httpResponse.Conflict
          });
        }
      } else {
        return generalResponse({
          data: null,
          status: false,
          message: 'file failed to create',
          res: res,
          httpResponse: httpResponse.Conflict
        });
      }
    }
    
    return generalResponse({
      data: null,
      status: false,
      message: 'file failed to create',
      res: res,
      httpResponse: httpResponse.Conflict
    });
  }

}