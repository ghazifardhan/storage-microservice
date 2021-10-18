import { Md5 } from 'ts-md5/dist/md5';

interface IArgument {
  key: ArgumentType;
  value: string;
}

enum ArgumentType {
  KEY_NAME = '-keyName'
};

function createRandomMd5() {
  // get -keyName
  let argsRaw = process.argv.slice(2);
  let argsFilter: IArgument[] = [];
  argsRaw.forEach((item, index) => {
    let a = item.includes(`${ArgumentType.KEY_NAME}=`);
    if (a) {
      argsFilter.push({
        key: ArgumentType.KEY_NAME,
        value: item.replace(`${ArgumentType.KEY_NAME}=`, '')
      });
    }
  });
  
  // creating key
  argsFilter.forEach((item, index) => {
    switch (item.key) {
      case ArgumentType.KEY_NAME:
        let key = Md5.hashStr(Date.now() + item.value);
        return console.log(`key: ${item.value} created with hash: ${key}`);
      default:
        return '';
    }
  })

  return true;
}

createRandomMd5();