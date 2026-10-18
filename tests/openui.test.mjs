import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createParser} from "@openuidev/react-lang";
import {createVisualLibrary,visualPrograms,hasLessonVisual,lessonVisualProgram} from "../src/visual-programs.mjs";
const library=createVisualLibrary();
const parse=program=>createParser(library.toJSONSchema(),library.root).parse(program);
test("only the two interaction-dependent examples mount an OpenUI model",()=>{
  assert.deepEqual(Object.keys(visualPrograms).sort(),["interviews","mvp"]);
  assert.equal(hasLessonVisual("problem"),false);
  for(const id of Object.keys(visualPrograms)){
    const result=parse(lessonVisualProgram(id));
    assert.deepEqual(result.meta.errors,[]);
    assert.deepEqual(result.meta.unresolved,[]);
    assert.deepEqual(result.meta.orphaned,[]);
    assert.equal(result.root.typeName,"VisualRoot");
    assert.equal(result.root.props.children.length,1);
    assert.deepEqual(result.queryStatements,[]);
    assert.deepEqual(result.mutationStatements,[]);
  }
});
test("the visual library no longer creates notes or a competing course route",()=>{
  assert.deepEqual(Object.keys(library.components).sort(),["CompareScene","ScopeScene","VisualRoot"]);
  assert.throws(()=>lessonVisualProgram("problem"),RangeError);
  assert.throws(()=>lessonVisualProgram("__proto__"),RangeError);
  assert.throws(()=>createVisualLibrary({}),/Missing renderer/);
});
test("an invalid component is reported rather than silently presented as valid",()=>{
  const result=parse('root = VisualRoot("Hint", [bad])\nbad = UnknownComponent("bad")');
  assert.ok(result.meta.errors.some(e=>e.code==="unknown-component"));
});
test("the self-contained artifact retains the real renderer and its licenses",async()=>{
  const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
  const notices=await readFile(new URL("../THIRD_PARTY_NOTICES.txt",import.meta.url),"utf8");
  assert.match(html,/FieldworkVisuals/);assert.match(html,/data-openui-rendered/);
  assert.match(html,/id="third-party-licenses"/);assert.match(notices,/@openuidev\/react-lang/);
  assert.doesNotMatch(html,/\/\* OPENUI_RENDERER \*\//);
  assert.doesNotMatch(html,/append_field_note|visual-note-action/);
});
