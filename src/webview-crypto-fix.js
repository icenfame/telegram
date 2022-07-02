const fs = require("fs");
const path = require("path");

const path1 = path.resolve(
  __dirname,
  "../node_modules/webview-crypto/src/MainWorker.ts"
);
const path2 = path.resolve(
  __dirname,
  "../node_modules/webview-crypto/src/asyncSerialize.ts"
);

const file1 = fs.readFileSync(path1, "utf-8").split(/\r?\n/);
const file2 = fs.readFileSync(path2, "utf-8").split(/\r?\n/);

file1[0] = `import {serializeError} from "serialize-error"`;
file2[0] = `import find from "lodash/find";`;

fs.writeFileSync(path1, file1.join("\n"));
fs.writeFileSync(path2, file2.join("\n"));
