import { Request, Response, Router } from "express";
import { lutimesSync } from "fs";
import { createConnection, getRepository } from "typeorm";
import { Storage } from "../../models/storage/storage";
import { generalResponse } from "../../responses/general-responses";
import { httpResponse } from "../../responses/http-responses";
import { uploadMulter } from "../../server";
import ffmpeg from "ffmpeg";
import fluentFfmpeg from "fluent-ffmpeg";
import fs from "fs";
import pathToFfmpeg from "ffmpeg-static";

export class StorageController {
  private path = "/storage";
  private router = Router();

  constructor() {
    this.initializedRoutes();
  }

  private initializedRoutes() {
    this.router.post(
      this.path + "/single",
      uploadMulter.single("file"),
      this.singleFile
    );
    this.router.post(
      this.path + "/single-video-v1",
      uploadMulter.single("file"),
      this.singleFileVideo
    );
    this.router.post(
      this.path + "/single-video",
      uploadMulter.single("file"),
      this.singleFileVideoV2
    );
    this.router.post(
      this.path + "/multiple",
      uploadMulter.fields([{ name: "files" }]),
      this.multipleFile
    );
    this.router.post(this.path + "/get-files", (req, res) =>
      this.getFiles(req, res)
    );
  }

  private async getFiles(req: Request, res: Response) {
    const storageRepo = getRepository(Storage);
    const files = req.body.files;

    try {
      const data = await storageRepo.findByIds(files as string[]);
      return generalResponse({
        data: data,
        status: true,
        message: "get files success",
        res: res,
        httpResponse: httpResponse.Success,
      });
    } catch (e) {
      return generalResponse({
        error: e,
        status: false,
        message: "get files failed",
        res: res,
        httpResponse: httpResponse.Success,
      });
    }
  }

  generateThumbnail(path: string, thumbnailPath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      resolve("asdasd");
      // const test = fluentFfmpeg({ source: path });
      // test
      //   .setFfmpegPath(pathToFfmpeg)
      //   .output(`${thumbnailPath}.png`)
      //   .on("error", (err) => {
      //     return reject(new Error(err));
      //     // console.log("An error occurred: " + err.message);
      //     // conversionError = true;
      //     // console.log("asdasd kesisini", conversionError);
      //   })
      //   .on("end", (err) => {
      //     resolve(`${thumbnailPath}.png`);
      //     // console.log("Processing finished !");
      //   })
      //   .run();
    });
  }

  private async singleFileVideoV2(req: Request, res: Response) {
    const generateThumbnail = (
      path: string,
      thumbnailName: string
    ): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        console.log("asdasd_jalanin ini ketiga", pathToFfmpeg);
        const test = fluentFfmpeg({
          source: path,
        });
        test
          // setup ffmpeg path
          .setFfmpegPath(pathToFfmpeg)
          // setup event handlers
          .on("filenames", function (filenames) {
            console.log("screenshots are " + filenames.join(", "));
          })
          .on("end", function () {
            console.log("screenshots were saved");
            resolve(`${thumbnailName}.png`);
          })
          .on("error", function (err, stdout, stderr) {
            console.log("An error occurred: " + err.message, err, stderr);
            reject(err.message);
          })
          // take 2 screenshots at predefined timemarks and size
          .takeScreenshots(
            {
              count: 1,
              timemarks: ["00:00:01.000"],
              filename: `${thumbnailName}.png`,
            },
            "storage/"
          );
      });
    };

    try {
      console.log("asdasd_jalanin ini pertama", pathToFfmpeg);
      if (req.file.size === 0) {
        return generalResponse({
          data: null,
          status: false,
          message: "file failed to create",
          res: res,
          httpResponse: httpResponse.Success,
        });
      }

      const vidToJpgPath = `storage`;
      const thumbnailName = `thumbnail_${req.file.filename}`;
      const thumbnailPath = `${vidToJpgPath}/${thumbnailName}`;

      // const test = testaja();
      console.log("asdasd_jalanin ini kedua", fs.existsSync(req.file.path));
      if (fs.existsSync(req.file.path)) {
        const test = await generateThumbnail(req.file.path, thumbnailName);
        console.log("asdasd_jalanin ini keempat", test);
      }

      // const test = fluentFfmpeg({ source: req.file.path });
      // test
      //   .setFfmpegPath(pathToFfmpeg)
      //   .screenshots({
      //     timestamps: [0.0],
      //     filename: thumbnailName,
      //     folder: vidToJpgPath,
      //   })
      //   .output(`${thumbnailPath}.png`)
      //   .on("error", (err) => {
      //     console.log("An error occurred: " + err.message);
      //   })
      //   .on("end", (err) => {
      //     console.log("Processing finished !");
      //   })
      //   .run();

      // console.log("asdasd", conversionError);
      // if (conversionError) {
      //   return generalResponse({
      //     data: null,
      //     status: false,
      //     message: "file failed to create",
      //     res: res,
      //     httpResponse: httpResponse.Conflict,
      //   });
      // }

      let storageRepo = getRepository(Storage);

      if (req.file !== undefined) {
        let storage = new Storage();
        storage.fieldName = req.file.fieldname;
        storage.filename = req.file.filename;
        storage.originalName = req.file.originalname;
        storage.encoding = req.file.encoding;
        storage.mimetype = req.file.mimetype;
        storage.destination = req.file.destination;
        storage.size = req.file.size;
        storage.thumbnail = `${thumbnailPath}.png`;
        storage.path = req.file.path;

        try {
          let save = await storageRepo.save(storage);
          return generalResponse({
            data: save,
            status: true,
            message: "file created",
            res: res,
            httpResponse: httpResponse.Success,
          });
        } catch (e) {
          console.log(e);
          return generalResponse({
            data: null,
            status: false,
            message: "file failed to create",
            res: res,
            httpResponse: httpResponse.Success,
          });
        }
      } else {
        return generalResponse({
          data: null,
          status: false,
          message: "file failed to create",
          res: res,
          httpResponse: httpResponse.Success,
        });
      }
    } catch (e) {
      return generalResponse({
        data: null,
        status: false,
        message: "file failed to create: " + e,
        res: res,
        httpResponse: httpResponse.Success,
      });
    }
  }

  private async singleFileVideo(req: Request, res: Response) {
    let storageRepo = getRepository(Storage);

    if (req.file !== undefined) {
      let storage = new Storage();
      storage.fieldName = req.file.fieldname;
      // storage.filename = req.file.filename;
      storage.originalName = req.file.originalname;
      storage.encoding = req.file.encoding;
      storage.mimetype = req.file.mimetype;
      storage.destination = req.file.destination;
      storage.size = req.file.size;

      const vidToJpgPath = `storage`;
      const newVideoName = `formatted_${req.file.filename}`;
      const newVideoPath = `${vidToJpgPath}/${newVideoName}.mp4`;

      try {
        const aspectRatio = await new ffmpeg(req.file.path);
        // aspectRatio.setVideoSize('800x?', true, true);
        aspectRatio.setVideoAspectRatio("16:9");
        aspectRatio.setVideoFormat("mp4");
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
      storage.path = newVideoPath;
      storage.filename = `${newVideoName}.mp4`;
      // storage.thumbnail = saveStorageThumbnail.id;

      try {
        let save = await storageRepo.save(storage);
        return generalResponse({
          data: save,
          status: true,
          message: "file created",
          res: res,
          httpResponse: httpResponse.Success,
        });
      } catch (e) {
        console.log(e);
        return generalResponse({
          data: null,
          status: false,
          message: "file failed to create",
          res: res,
          httpResponse: httpResponse.Conflict,
        });
      }
    } else {
      return generalResponse({
        data: null,
        status: false,
        message: "file failed to create",
        res: res,
        httpResponse: httpResponse.Conflict,
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
          message: "file created",
          res: res,
          httpResponse: httpResponse.Success,
        });
      } catch (e) {
        console.log(e);
        return generalResponse({
          data: null,
          status: false,
          message: "file failed to create",
          res: res,
          httpResponse: httpResponse.Conflict,
        });
      }
    } else {
      return generalResponse({
        data: null,
        status: false,
        message: "file failed to create",
        res: res,
        httpResponse: httpResponse.Conflict,
      });
    }
  }

  private async multipleFile(req: Request, res: Response) {
    let storageRepo = getRepository(Storage);

    try {
      if (req.files !== undefined) {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
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
              message: "files created",
              res: res,
              httpResponse: httpResponse.Success,
            });
          } else {
            return generalResponse({
              data: null,
              status: false,
              message: "file failed to create",
              res: res,
              httpResponse: httpResponse.Conflict,
            });
          }
        } else {
          return generalResponse({
            data: null,
            status: false,
            message: "file failed to create",
            res: res,
            httpResponse: httpResponse.Conflict,
          });
        }
      }

      return generalResponse({
        data: null,
        status: false,
        message: "file failed to create",
        res: res,
        httpResponse: httpResponse.Conflict,
      });
    } catch (e) {
      return generalResponse({
        data: e,
        status: false,
        message: "file failed to create",
        res: res,
        httpResponse: httpResponse.Conflict,
      });
    }
  }
}
