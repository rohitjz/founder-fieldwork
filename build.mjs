import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { createParser } from "@openuidev/react-lang";
import { lessons, signals } from "./src/lessons.mjs";
import { buildCabinet } from "./src/cabinet.mjs";
import { createVisualLibrary, visualPrograms } from "./src/visual-programs.mjs";
import { learningGoals, chapters } from "./src/curriculum.mjs";
import { founderCourse, leversCourse } from "./src/course-config.mjs";
import { leversLessons, leversGoals, leversChapters } from "./src/levers.mjs";

process.chdir(fileURLToPath(new URL(".", import.meta.url)));
const figure = buildCabinet({ audit: process.argv.includes("--audit") });
const visualLibrary=createVisualLibrary();
const parser=createParser(visualLibrary.toJSONSchema(),visualLibrary.root);
for(const [name,program] of Object.entries(visualPrograms)) {
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
const [template, css, model, learning, app, economics, calculator] = await Promise.all([
  readFile("src/template.html","utf8"), readFile("src/style.css","utf8"),
  readFile("src/model.mjs","utf8"),readFile("src/learning.mjs","utf8"),readFile("src/app.js","utf8"),
  readFile("src/economics.mjs","utf8"),readFile("src/calculator.js","utf8")
]);
const safeJSON = value => JSON.stringify(value).replaceAll("<","\\u003c");
const learningHelpers=learning.replace(/^export \{learningGoals,chapters\} from "\.\/curriculum\.mjs";\n/m,"").replaceAll("export ","");
const targets=[
  {path:"index.html",course:founderCourse,lessons,learningGoals,chapters},
  {path:"business-levers/index.html",course:leversCourse,lessons:leversLessons,learningGoals:leversGoals,chapters:leversChapters}
];
for(const target of targets) {
  const c=target.course;
  const script=`const course=${safeJSON(c)};\nconst lessons=${safeJSON(target.lessons)};\nconst learningGoals=${safeJSON(target.learningGoals)};\nconst chapters=${safeJSON(target.chapters)};\nconst signals=${safeJSON(c.lab?signals:[])};\nconst cabinetMotion=${safeJSON(c.lab?figure.motion:[])};\nconst visualLessonIds=${safeJSON(c.id==="founder"?Object.keys(visualPrograms):[])};\n${model.replaceAll("export ","")}\n${learningHelpers}\n${c.calculator?economics.replaceAll("export ","")+"\n"+calculator:""}\n${app}`;
  const html=template.replace("/* APP_STYLES */",()=>css)
    .replace("<!-- CABINET -->",()=>c.lab?figure.svg:"")
    .replace("<!-- OPTIONAL_LAB_LINK -->",()=>c.lab?'<a href="#lab">Evidence practice</a>':"")
    .replace("/* OPENUI_RENDERER */",()=>c.id==="founder"?visuals:"")
    .replace("/* THIRD_PARTY_LICENSES */",()=>c.id==="founder"?noticeText.replace(/<\/script/gi,"<\\/script"):"")
    .replace("/* APP_SCRIPT */",()=>script)
    .replace("<title>Founder Fieldwork | Learn the work after the prototype</title>",()=>`<title>${c.title} | ${c.heading}</title>`);
  if(target.path.includes("/"))await mkdir("business-levers",{recursive:true});
  await writeFile(target.path,html);
  console.log(`Built ${target.path}: ${Buffer.byteLength(html).toLocaleString()} bytes, ${target.lessons.length} guided lessons.`);
}
await writeFile("THIRD_PARTY_NOTICES.txt",noticeText);
console.log(`Validated ${Object.keys(visualPrograms).length} interactive examples and ${figure.count} optional cabinet parts.`);
