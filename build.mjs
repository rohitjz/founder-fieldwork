import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { lessons, signals } from "./src/lessons.mjs";
import { buildCabinet } from "./src/cabinet.mjs";

process.chdir(fileURLToPath(new URL(".", import.meta.url)));
const figure = buildCabinet({ audit: process.argv.includes("--audit") });
const [template, css, model, app] = await Promise.all([
  readFile("src/template.html","utf8"), readFile("src/style.css","utf8"),
  readFile("src/model.mjs","utf8"), readFile("src/app.js","utf8")
]);
const safeJSON = value => JSON.stringify(value).replaceAll("<","\\u003c");
const script = `const lessons=${safeJSON(lessons)};\nconst signals=${safeJSON(signals)};\nconst cabinetMotion=${safeJSON(figure.motion)};\n${model.replaceAll("export ","")}\n${app}`;
const html = template.replace("/* APP_STYLES */",()=>css).replace("<!-- CABINET -->",()=>figure.svg).replace("/* APP_SCRIPT */",()=>script);
await writeFile("index.html",html);
console.log(`Built index.html: ${Buffer.byteLength(html).toLocaleString()} bytes, ${lessons.length} lessons, ${figure.count} true-shape cabinet parts.`);
