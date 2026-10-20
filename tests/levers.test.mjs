import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {exampleInputs,calculateEconomics,economicsFields} from "../src/economics.mjs";
import {leversLessons,leversGoals,leversChapters} from "../src/levers.mjs";
import {founderCourse,leversCourse} from "../src/course-config.mjs";
import {emptyProgress,makeNotebook,parseProgress} from "../src/model.mjs";
import {parseLearningRoute} from "../src/learning.mjs";

test("the new guide contains six complete original lessons in one coherent route",()=>{
  const ids=leversLessons.map(l=>l.id);
  assert.equal(ids.length,6);assert.equal(new Set(ids).size,6);
  assert.deepEqual(leversChapters.flatMap(c=>c.ids),ids);
  assert.deepEqual(Object.keys(leversGoals),ids);
  for(const l of leversLessons) {
    for(const field of ["idea","case","task","prompt","example","trap","takeaway","origin","resource"])assert.ok(l[field].length>10,`${l.id}: ${field}`);
    assert.equal(l.paragraphs.length,2);assert.equal(l.steps.length,3);
    assert.equal(l.quiz.options.length,3);assert.equal(l.quiz.explanations.length,3);
    assert.ok(l.quiz.correct>=0&&l.quiz.correct<3);
    assert.equal(new URL(l.url).protocol,"https:");
    assert.match(l.origin,/not identified/);
    assert.deepEqual(parseLearningRoute(`#lesson=${l.id}&step=apply`,ids),{view:"lesson",id:l.id,phase:"apply"});
  }
});
test("source boundaries do not pretend to reproduce the unavailable guide or verify earnings",()=>{
  assert.match(leversCourse.reelUrl,/DerBPXstdkj/);
  assert.match(leversCourse.sourceParagraphs.join(" "),/did not obtain/);
  assert.match(leversCourse.sourceParagraphs.join(" "),/not a reconstruction/);
  assert.match(leversCourse.sourceParagraphs.join(" "),/not define whether that means revenue or profit/);
  assert.match(leversCourse.sourceParagraphs.join(" "),/illustrative assumptions/);
});
test("the baseline exactly reproduces the worked example",()=>{
  assert.deepEqual(calculateEconomics(exampleInputs),{
    orders:20,revenue:1000,variableCost:300,contributionPerOrder:35,
    contribution:700,periodCost:600,surplus:100,breakEvenOrders:18
  });
});
test("changing a rate multiplies modeled orders, not a forecast of achievable demand",()=>{
  const result=calculateEconomics({...exampleInputs,rate:3});
  assert.equal(result.orders,30);assert.equal(result.revenue,1500);assert.equal(result.variableCost,450);
  assert.equal(result.surplus,450);
  assert.equal(calculateEconomics({...exampleInputs,rate:1.25}).orders,12.5);
});
test("negative and zero contribution never produce a fake break-even quantity",()=>{
  const negative=calculateEconomics({...exampleInputs,price:40,variable:45});
  assert.equal(negative.contributionPerOrder,-5);assert.equal(negative.breakEvenOrders,null);
  assert.ok(calculateEconomics({...exampleInputs,price:40,variable:45,visits:2000}).surplus<negative.surplus);
  assert.equal(calculateEconomics({...exampleInputs,price:15,variable:15}).breakEvenOrders,null);
});
test("zero visits and zero order rate retain real acquisition/fixed costs",()=>{
  for(const override of [{visits:0},{rate:0}]) {
    const r=calculateEconomics({...exampleInputs,...override});
    assert.equal(r.orders,0);assert.equal(r.revenue,0);assert.equal(r.surplus,-600);
  }
  assert.equal(calculateEconomics({...exampleInputs,rate:100}).orders,1000);
});
test("break-even uses whole orders and cent arithmetic instead of floating-point rounding accidents",()=>{
  const r=calculateEconomics({...exampleInputs,price:.3,variable:.2,acquisition:0,fixed:600});
  assert.equal(r.contributionPerOrder,.1);assert.equal(r.breakEvenOrders,6000);
  const fractional=calculateEconomics({...exampleInputs,acquisition:0,fixed:601});
  assert.equal(fractional.breakEvenOrders,18);
});
test("all inputs are finite, bounded, typed, and monetary inputs have currency precision",()=>{
  for(const field of economicsFields)for(const value of [NaN,Infinity,-Infinity,-1,field.max+1,"2",null,undefined])assert.throws(()=>calculateEconomics({...exampleInputs,[field.id]:value}),RangeError,`${field.id}: ${value}`);
  assert.throws(()=>calculateEconomics({...exampleInputs,visits:1.5}),RangeError);
  assert.throws(()=>calculateEconomics({...exampleInputs,price:.001}),RangeError);
});
test("labeled costs reconcile across a range of valid scenarios",()=>{
  for(const visits of [0,17,1000,10000000])for(const rate of [0,2.5,100])for(const variable of [0,15,75]) {
    const r=calculateEconomics({...exampleInputs,visits,rate,variable});
    assert.ok(Object.values(r).every(v=>v===null||Number.isFinite(v)));
    assert.equal(r.revenue-r.variableCost-r.periodCost,r.surplus);
    assert.equal(r.contribution,r.revenue-r.variableCost);
  }
});
test("each course keeps its own notes, export identity, and source attribution",()=>{
  assert.notEqual(founderCourse.storageKey,leversCourse.storageKey);
  assert.equal(founderCourse.storageKey,"founder-fieldwork-v1");
  const state=emptyProgress();state.notes.claim="Check what the sales claim includes.";
  const restored=parseProgress(JSON.stringify(state),leversLessons.map(l=>l.id));
  assert.equal(restored.notes.claim,state.notes.claim);
  const exported=makeNotebook(leversLessons,state,leversCourse);
  assert.match(exported,/^# Business Levers/);
  assert.match(exported,/@thelazyceo/);assert.doesNotMatch(exported,/@davecto/);
  assert.equal((exported.match(/^## /gm)||[]).length,6);
});
test("the new standalone artifact is small, offline, and has no unrelated renderer bundle",async()=>{
  const html=await readFile(new URL("../business-levers/index.html",import.meta.url),"utf8");
  assert.ok(Buffer.byteLength(html)<110000);
  assert.match(html,/business-levers-v1/);assert.match(html,/DerBPXstdkj/);
  assert.doesNotMatch(html,/<script[^>]+src=|<link[^>]+rel=["']stylesheet|@import\s/i);
  assert.doesNotMatch(html,/react\.production|id="cabinet-parts"/);
  assert.match(html,/calculateEconomics/);assert.match(html,/not a profit forecast/);
  assert.doesNotMatch(html,/APP_STYLES|APP_SCRIPT|OPTIONAL_LAB_LINK|<!-- CABINET -->/);
});
