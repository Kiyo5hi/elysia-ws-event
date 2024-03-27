import { TypeScriptToTypeBox } from "@sinclair/typebox-codegen";

if (Bun.argv.length < 3) {
    console.error("Usage: bun run scripts/generateSchemas.ts <path/to/types.ts>");
    process.exit(1);
}

const types = await Bun.file(Bun.argv.at(-1) as string).text();
const schemas = TypeScriptToTypeBox.Generate(types);
console.log(schemas);
