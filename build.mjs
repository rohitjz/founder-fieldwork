import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { createParser } from "@openuidev/react-lang";
import { lessons, signals } from "./src/lessons.mjs";
import { buildCabinet } from "./src/cabinet.mjs";
import { createVisualLibrary, visualPrograms, courseRouteProgram } from "./src/visual-programs.mjs";

process.chdir(fileURLToPath(new URL(".", import.meta.url)));
const figure = buildCabinet({ audit: process.argv.includes("--audit") });
const visualLibrary=createVisualLibrary();
const parser=createParser(visualLibrary.toJSONSchema(),visualLibrary.root);
for(const [name,program] of Object.entries({...visualPrograms,route:courseRouteProgram(0)})) {
  const result=parser.parse(program);
  if(result.meta.errors.length||result.meta.unresolved.length)throw new Error(`Invalid OpenUI program ${name}: ${JSON.stringify(result.meta)}`);
}
const bundle=await build({
  entryPoints:["src/openui-visuals.jsx"],bundle:true,write:false,minify:true,
  format:"iife",globalName:"FieldworkVisuals",platform:"browser",target:"es2020",
  legalComments:"inline",metafile:true,define:{"process.env.NODE_ENV":'"production"'}
});
const visuals=bundle.outputFiles[0].text.replace(/<\/script/gi,"<\\/script");
const packages=[...new Set(Object.keys(bundle.metafile.inputs).filter(p=>p.startsWith("node_modules/")).map(p=>{
  const parts=p.split("/");return parts.slice(1,parts[1].startsWith("@")?3:2).join("/");
}))].sort();
const notices=["Third-party licenses for the bundled browser renderer.\n"];
for(const name of packages) {
  const dir=`node_modules/${name}`;
  const meta=JSON.parse(await readFile(`${dir}/package.json`,"utf8"));
  const license=["LICENSE","LICENSE.md","LICENSE.txt"].map(file=>`${dir}/${file}`).find(existsSync);
  if(!license)throw new Error(`Missing license notice for bundled package ${name}`);
  notices.push(`\n===== ${name} ${meta.version} =====\n${await readFile(license,"utf8")}`);
}
const noticeText=notices.join("\n");
const [template, css, model, app] = await Promise.all([
  readFile("src/template.html","utf8"), readFile("src/style.css","utf8"),
  readFile("src/model.mjs","utf8"), readFile("src/app.js","utf8")
]);
const safeJSON = value => JSON.stringify(value).replaceAll("<","\\u003c");
const script = `const lessons=${safeJSON(lessons)};\nconst signals=${safeJSON(signals)};\nconst cabinetMotion=${safeJSON(figure.motion)};\n${model.replaceAll("export ","")}\n${app}`;
const html = template.replace("/* APP_STYLES */",()=>css).replace("<!-- CABINET -->",()=>figure.svg).replace("/* OPENUI_RENDERER */",()=>visuals).replace("/* THIRD_PARTY_LICENSES */",()=>noticeText.replace(/<\/script/gi,"<\\/script")).replace("/* APP_SCRIPT */",()=>script);
await writeFile("index.html",html);
await writeFile("THIRD_PARTY_NOTICES.txt",noticeText);
console.log(`Built index.html: ${Buffer.byteLength(html).toLocaleString()} bytes, ${lessons.length} validated OpenUI playbooks, ${figure.count} true-shape cabinet parts.`);
