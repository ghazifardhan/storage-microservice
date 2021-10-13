import { createConnection, getRepository } from "typeorm"
import { Key } from "./src/models/key/key"

const addKey = () => {
  createConnection().then(async connection => {
    let keyRepo = connection.getRepository(Key);

    let key: Key = new Key();
    key.name = 'perbasi-storage';
    key.secret = 'f9926724b5087a150652d06e52f354a1' // perbasi-storage;
    
    try {
      const k = await keyRepo.save(key);
      console.log(`Key for ${k.name} created with secret ${k.secret}`);
    } catch (error) {
      return console.error("save failed", error);
    }
  });
}

addKey();