import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createParser } from "@openuidev/react-lang";
import { createVisualLibrary, visualPrograms, lessonVisualProgram, courseRouteProgram } from "../src/visual-programs.mjs";
import { lessons } from "../src/lessons.mjs";

const library=createVisualLibrary();
const parse=program=>createParser(library.toJSONSchema(),library.root).parse(program);
test("every lesson has a valid OpenUI playbook with an explicit note action",()=>{
  assert.deepEqual(Object.keys(visualPrograms).sort(),lessons.map(l=>l.id).sort());
  for(const l of lessons) {
    const result=parse(lessonVisualProgram(l.id));
    assert.deepEqual(result.meta.errors,[],l.id);
    assert.deepEqual(result.meta.unresolved,[],l.id);
    assert.deepEqual(result.meta.orphaned,[],l.id);
    assert.equal(result.root.typeName,"VisualRoot");
    assert.equal(result.root.props.children.length,2);
    assert.equal(result.root.props.children[1].typeName,"PracticeAction");
    assert.ok(result.root.props.children[1].props.prompt.length>50);
    assert.deepEqual(result.queryStatements,[]);
    assert.deepEqual(result.mutationStatements,[]);
  }
});
test("the visual vocabulary uses distinct models for the decisions",()=>{
  const kinds=new Set(Object.values(visualPrograms).map(p=>parse(p).root.props.children[0].typeName));
  assert.deepEqual([...kinds].sort(),["CompareScene","FlowScene","OfferScene","ReturnScene","ScopeScene"]);
  assert.throws(()=>lessonVisualProgram("__proto__"),RangeError);
  assert.throws(()=>lessonVisualProgram("unknown"),RangeError);
});
test("the course route accepts only an actual section",()=>{
  for(let stage=0;stage<3;stage++) {
    const result=parse(courseRouteProgram(stage));
    assert.deepEqual(result.meta.errors,[]);
    assert.equal(result.root.props.children[0].props.stage,stage);
  }
  for(const stage of [-1,3,0.5,"1",NaN])assert.throws(()=>courseRouteProgram(stage),RangeError);
});
test("invalid OpenUI components and missing renderer functions are surfaced",()=>{
  const result=parse('root = VisualRoot("Title","Hint",[bad])\nbad = UnknownComponent("bad")');
  assert.ok(result.meta.errors.some(e=>e.code==="unknown-component"));
  assert.throws(()=>createVisualLibrary({}),/Missing renderer/);
});
test("the offline artifact includes the real production renderer and its license notices",async()=>{
  const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
  const notices=await readFile(new URL("../THIRD_PARTY_NOTICES.txt",import.meta.url),"utf8");
  assert.match(html,/FieldworkVisuals/);
  assert.match(html,/data-openui-rendered/);
  assert.match(html,/id="third-party-licenses"/);
  assert.match(notices,/@openuidev\/react-lang/);
  assert.match(notices,/react-dom/);
  assert.doesNotMatch(html,/\/\* OPENUI_RENDERER \*\/|\/\* THIRD_PARTY_LICENSES \*\//);
});
