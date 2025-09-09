import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "../lib/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const spec = swaggerJsdoc(swaggerOptions);
  const outDir = path.resolve(__dirname, "../public");
  const outFile = path.join(outDir, "openapi.json");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outFile, JSON.stringify(spec, null, 2), "utf8");
  console.log(`OpenAPI schema written to ${outFile}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


