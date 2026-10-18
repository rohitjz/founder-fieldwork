import test from "node:test";
import assert from "node:assert/strict";
import {lessons} from "../src/lessons.mjs";
import {learningGoals,chapters,lessonPhases,parseLearningRoute,lessonHref,nextUnfinishedLesson,resumePhase} from "../src/learning.mjs";
import {emptyProgress,parseProgress,makeNotebook} from "../src/model.mjs";
const ids=lessons.map(l=>l.id);
test("the course has one ordered route through all nine decisions",()=>{
  assert.deepEqual(chapters.flatMap(c=>c.ids),ids);
  assert.deepEqual(Object.keys(learningGoals),ids);
  assert.deepEqual(lessonPhases,["learn","check","apply"]);
  for(const goal of Object.values(learningGoals)){assert.ok(goal.label.length>8);assert.ok(goal.artifact.length>8);assert.ok(goal.recall.endsWith("?"));}
});
test("direct and legacy lesson links resolve to an explicit learning phase",()=>{
  assert.deepEqual(parseLearningRoute("",ids),{view:"course"});
  assert.deepEqual(parseLearningRoute("#course",ids),{view:"course"});
  assert.deepEqual(parseLearningRoute("#lesson=mvp",ids),{view:"lesson",id:"mvp",phase:"learn"});
  for(const phase of [...lessonPhases,"done"])assert.deepEqual(parseLearningRoute(lessonHref("problem",phase),ids),{view:"lesson",id:"problem",phase});
  for(const view of ["notebook","sources","lab"])assert.deepEqual(parseLearningRoute("#"+view,ids),{view});
  assert.deepEqual(parseLearningRoute("#resources",ids),{view:"sources"});
});
test("bad routes are not silently converted into the first lesson",()=>{
  for(const route of ["#lesson=unknown","#lesson=mvp&step=unknown","#anything"])assert.deepEqual(parseLearningRoute(route,ids),{view:"not-found"});
  assert.throws(()=>lessonHref("mvp","unknown"),RangeError);
});
test("continue recommends the next unfinished decision and its actual state",()=>{
  const state=emptyProgress();
  assert.equal(nextUnfinishedLesson(lessons,state).id,"problem");
  assert.equal(resumePhase("problem",state),"learn");
  state.recalls.problem="An explanation.";assert.equal(resumePhase("problem",state),"check");
  state.passed.push("problem");assert.equal(resumePhase("problem",state),"apply");
  state.completed.push("problem");assert.equal(nextUnfinishedLesson(lessons,state).id,"interviews");
  state.completed=[...ids];assert.equal(nextUnfinishedLesson(lessons,state).id,"problem");
});
test("existing version-one notes and completed lessons survive without recall fields",()=>{
  const original={version:1,notes:{problem:"My original project decision."},passed:["problem"],completed:["problem"],theme:"light"};
  const parsed=parseProgress(JSON.stringify(original),ids);
  assert.deepEqual(parsed.notes,original.notes);assert.deepEqual(parsed.completed,original.completed);
  assert.deepEqual(parsed.passed,original.passed);assert.equal(parsed.theme,"light");assert.equal(parsed.version,1);
  assert.deepEqual(parsed.recalls,{});
});
test("recall notes persist, export, and reject invalid saved values",()=>{
  const state=emptyProgress();state.recalls.problem="A workaround is observed behavior.";
  assert.deepEqual(parseProgress(JSON.stringify(state),ids),state);
  assert.match(makeNotebook(lessons,state),/A workaround is observed behavior/);
  for(const recalls of [null,[],1,{problem:1}])assert.throws(()=>parseProgress(JSON.stringify({...emptyProgress(),recalls}),ids),TypeError);
});
