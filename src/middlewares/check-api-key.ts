import { createConnection, getRepository } from "typeorm";
import { Key } from "../models/key/key";
import express, { Request, Response, NextFunction } from 'express';
import { generalResponse } from "../responses/general-responses";
import { httpResponse } from "../responses/http-responses";

export const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = <string>req.headers["storage-api-key"];
  try {
    let key = await getRepository(Key).findOneOrFail({ secret: apiKey });
    if (key) {
      next();
    } else {
      return generalResponse({
        data: null,
        message: `api key invalid`,
        status: false,
        httpResponse: httpResponse.Success,
        res: res
      });
    }
  } catch (e) {
    return generalResponse({
      data: null,
      message: `api key invalid`,
      status: false,
      httpResponse: httpResponse.Success,
      res: res
    });
  }
}