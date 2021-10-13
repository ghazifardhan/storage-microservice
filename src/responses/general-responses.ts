import { Request, Response, NextFunction } from "express";
import { JsonOutput } from "../responses/json-output";

interface generalReponseParam {
  data?: any, 
  message?: string,
  error?: any;
  status: boolean,
  validations?: any,
  httpResponse: number,
  res: Response,
}

export const generalResponse = (param: generalReponseParam) => {
    const json = new JsonOutput();
    json.data = param.data;
    json.message = param.message;
    json.status = param.status;
    json.validations = param.validations;
    json.error = param.error;
    return param.res.status(param.httpResponse).json(json);
}