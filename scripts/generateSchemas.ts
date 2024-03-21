import { TypeScriptToTypeBox } from "@sinclair/typebox-codegen";

const types = await Bun.file("./types.ts").text();
const schemas = TypeScriptToTypeBox.Generate(types);
console.log(schemas);
