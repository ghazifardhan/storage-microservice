import { Request, Response, Router } from 'express';
import { lutimesSync } from 'fs';
import { createConnection, getRepository } from 'typeorm';
import { Storage } from '../../models/storage/storage';
import { generalResponse } from '../../responses/general-responses';
import { httpResponse } from '../../responses/http-responses';
import { uploadMulter } from '../../server';
import ffmpeg from 'ffmpeg';
import fs from 'fs';

export class StorageController {
  
  private path = '/storage';
  private router = Router();

  constructor() {
    this.initializedRoutes();
  }

  private initializedRoutes() {
    this.router.post(this.path + '/single', uploadMulter.single("file"), this.singleFile);
    this.router.post(this.path + '/single-video', uploadMulter.single("file"), this.singleFileVideo);
    this.router.post(this.path + '/multiple', uploadMulter.fields([{ name: 'files' }]), this.multipleFile);
    this.router.post(this.path + '/get-files', (req, res) => this.getFiles(req, res));
  }

  private async getFiles (req: Request, res: Response) {
    const storageRepo = getRepository(Storage);
    const files = req.body.files;

    try {
      const data = await storageRepo.findByIds(files as string[]);
      return generalResponse({
        data: data,
        status: true,
        message: 'get files success',
        res: res,
        httpResponse: httpResponse.Success
      });
    } catch (e) {
      return generalResponse({
        error: e,
        status: false,
        message: 'get files failed',
        res: res,
        httpResponse: httpResponse.Success
      });
    }
  }

  private async singleFileVideo(req: Request, res: Response) {
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

      const vidToJpgPath = `storage`;
      const newVideoName = `formatted_${req.file.filename}`;
      const newVideoPath = `${vidToJpgPath}/${newVideoName}.mp4`;

      try {
        const aspectRatio = await new ffmpeg(req.file.path);
        // aspectRatio.setVideoSize('800x?', true, true);
        aspectRatio.setVideoAspectRatio("16:9");
        aspectRatio.setVideoFormat('mp4');
        await aspectRatio.save(newVideoPath);
        
        const videoThumbnail = await new ffmpeg(newVideoPath);
        await videoThumbnail.fnExtractFrameToJPG(vidToJpgPath, {
          start_time: 1,
          duration_time: 1,
          frame_rate: 1,
          number: 1,
          file_name: `formatted_${req.file.filename}.jpg`,
          keep_aspect_ratio: false,
          keep_pixel_aspect_ratio: false,
        });

        // if thumbnail created delete original video file
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.log(e);
      }

      // let t = new ffmpeg(req.file.path, function (err, video) {
      //   video.setVideoAspectRatio("16:9");
      //   video.fnExtractFrameToJPG(vidToJpgPath, {
      //     start_time: 1,
      //     duration_time: 1,
      //     frame_rate: 1,
      //     number: 1,
      //     file_name: `${req.file.filename}.jpg`,
      //     keep_aspect_ratio: false,
      //     keep_pixel_aspect_ratio: false,
      //   });
      // });

      // store thumbnail to database
      // let storageThumbnail = new Storage();
      // storageThumbnail.fieldName = `${req.file.filename}.jpg`;
      // storageThumbnail.filename = `${req.file.filename}.jpg`;
      // storageThumbnail.originalName = `${req.file.filename}.jpg`;
      // storageThumbnail.encoding = '7bit';
      // storageThumbnail.mimetype = 'image/jpeg';
      // storageThumbnail.destination = 'storage';
      // storageThumbnail.path = `${vidToJpgPath}/${req.file.filename}_1.jpg`;
      // storageThumbnail.size = 100;

      // let saveStorageThumbnail = await storageRepo.save(storageThumbnail);

      storage.thumbnail = `${newVideoPath}_1.jpg`;
      // storage.thumbnail = saveStorageThumbnail.id;

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
        console.log(e);
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
        console.log(e);
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

    try {
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
    } catch (e) {
      return generalResponse({
        data: e,
        status: false,
        message: 'file failed to create',
        res: res,
        httpResponse: httpResponse.Conflict
      });
    }
  }

}