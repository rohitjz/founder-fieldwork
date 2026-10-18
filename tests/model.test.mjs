import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { lessons, signals } from "../src/lessons.mjs";
import { categories, evaluateSignal, emptyProgress, parseProgress, canComplete, makeNotebook } from "../src/model.mjs";
import { buildCabinet } from "../src/cabinet.mjs";

const ids=lessons.map(l=>l.id);
test("nine complete lessons have distinct primary sources and explained answer choices",()=>{
  assert.equal(lessons.length,9);
  assert.equal(new Set(ids).size,9);
  assert.equal(new Set(lessons.map(l=>l.url)).size,9);
  assert.equal(new Set(lessons.map(l=>l.group)).size,3);
  for(const l of lessons) {
    for(const key of ["title","author","resource","url","origin","idea","case","task","prompt","example","trap","takeaway"]) assert.ok(l[key]?.length,key);
    assert.equal(l.steps.length,3);
    assert.equal(l.paragraphs.length,2);
    assert.equal(l.quiz.options.length,3);
    assert.equal(l.quiz.explanations.length,3);
    assert.ok(l.quiz.correct>=0&&l.quiz.correct<3);
    assert.equal(new URL(l.url).protocol,"https:");
    assert.doesNotMatch(JSON.stringify(l),/[—–]/);
  }
});
test("every evidence statement has a classification, limit, and next action",()=>{
  assert.equal(signals.length,6);
  for(const s of signals) {
    for(const c of categories) assert.equal(evaluateSignal(s,c).correct,c===s.category);
    assert.ok(s.why.length>50);
    assert.ok(s.next.length>20);
  }
  assert.throws(()=>evaluateSignal(signals[0],"validated"),RangeError);
});
test("completion needs a correct answer and a non-empty note",()=>{
  const s=emptyProgress(),id=ids[0];
  assert.equal(canComplete(s,id),false);
  s.passed.push(id);assert.equal(canComplete(s,id),false);
  s.notes[id]="  ";assert.equal(canComplete(s,id),false);
  s.notes[id]="Investigate an actual workaround.";assert.equal(canComplete(s,id),true);
});
test("saved notes round trip and Unicode remains intact",()=>{
  const s=emptyProgress();s.notes[ids[1]]="A note: café, ग्राहक.";s.passed.push(ids[1]);s.completed.push(ids[1]);s.theme="light";
  assert.deepEqual(parseProgress(JSON.stringify(s),ids),s);
});
test("invalid storage raises an explicit error rather than silently losing data",()=>{
  for(const raw of ["{", "null", "[]", '{"version":2}',JSON.stringify({...emptyProgress(),notes:[]}),JSON.stringify({...emptyProgress(),theme:"blue"}),JSON.stringify({...emptyProgress(),notes:{[ids[0]]:4}})]) assert.throws(()=>parseProgress(raw,ids));
});
test("unknown or duplicate progress cannot inflate course completion",()=>{
  const s=emptyProgress();s.notes[ids[0]]="A real note.";s.notes.unknown="Ignore this";
  s.passed=[ids[0],ids[0],"unknown"];s.completed=[ids[0],ids[0],ids[1],"unknown"];
  const result=parseProgress(JSON.stringify(s),ids);
  assert.deepEqual(result.completed,[ids[0]]);
  assert.deepEqual(result.passed,[ids[0]]);
  assert.equal(result.notes.unknown,undefined);
});
test("notebook export covers every lesson and includes the provenance limit",()=>{
  const s=emptyProgress();s.notes[ids[0]]="<script>not executable in Markdown</script>";
  const md=makeNotebook(lessons,s);
  assert.ok(md.includes(s.notes[ids[0]]));
  assert.equal((md.match(/^## /gm)||[]).length,9);
  assert.match(md,/not publicly visible/);
  for(const l of lessons) assert.ok(md.includes(l.url));
});
test("Anatomy figure records detailed true-shape parts and correct motion",()=>{
  const cabinet=buildCabinet();
  assert.ok(cabinet.count>=40&&cabinet.count<=80);
  assert.equal((cabinet.svg.match(/data-part=/g)||[]).length,cabinet.count);
  assert.match(cabinet.svg,/physical analogy/i);
  assert.equal(cabinet.motion.length,2);
  assert.ok(cabinet.motion.every(Number.isFinite));
});
test("shipping artifact is self-contained and includes the requested materials",async()=>{
  const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
  assert.doesNotMatch(html,/<script[^>]+src=|<link[^>]+rel=["']stylesheet|@import\s/i);
  assert.doesNotMatch(html,/APP_STYLES|APP_SCRIPT|<!-- CABINET -->/);
  for(const token of ["liquid-distort","liquid-distort-sm","feDisplacementMap","--cp-dome","prefers-reduced-motion","@media print","not a reconstruction","fictional running example"]) assert.ok(html.includes(token),token);
  assert.equal((html.match(/id="cabinet-parts"/g)||[]).length,1);
});
