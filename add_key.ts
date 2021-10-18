import { exit } from "process";
import { createConnection, getRepository } from "typeorm"
import { Key } from "./src/models/key/key"
import dotenv from 'dotenv';
import { Environtment } from "./src/interfaces/env";
import { Md5 } from 'ts-md5/dist/md5';

// argument interface
interface IArgument{
  key: ArgumentType | null;
  label: string | null;
  value: string | null;
}

// argument type
enum ArgumentType {
  KEY_NAME = '-keyName'
};

// load env
const envUnparsed = dotenv.config();
export const env = (): Environtment => {
  return {
    API_NAME: envUnparsed.parsed!.API_NAME,
    API_VERSION: envUnparsed.parsed!.API_VERSION,
    API_VERSION_PATH: envUnparsed.parsed!.API_VERSION_PATH,
    DB_HOST: envUnparsed.parsed!.DB_HOST,
    DB_NAME: envUnparsed.parsed!.DB_NAME,
    DB_USER: envUnparsed.parsed!.DB_USER,
    DB_PASS: envUnparsed.parsed!.DB_PASS
  }
}

function getKeyHash(): IArgument {
  // get -keyName
  let argsRaw = process.argv.slice(2);
  let argsFilter: IArgument;
  let keyName = argsRaw.filter(item => item.includes(`${ArgumentType.KEY_NAME}=`));

  if (keyName) {
    let key = keyName[0].replace(`${ArgumentType.KEY_NAME}=`, '');
    let keyhash = Md5.hashStr(Date.now() + key);
    argsFilter = {
      key: ArgumentType.KEY_NAME,
      label: key,
      value: keyhash
    };

    return argsFilter;
  } else {
    return {
      key: null,
      label: null,
      value: null
    };
  }
}

async function addKey(){
  let connection = await createConnection();
  let keyRepo = connection.getRepository(Key);
  let getKey = getKeyHash();
  if (getKey.key !== null) {
    let key: Key = new Key();
    key.name = getKey.label!;
    key.secret = getKey.value!;
    
    try {
      const k = await keyRepo.save(key);
      console.log(k);
    } catch (error) {
      console.error("save failed", error);
    }
  } else {
    console.error("save failed");
  }

  // close connection
  connection.close();
  
  return true;
}

addKey();