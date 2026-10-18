import { createLibrary, defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export function createVisualLibrary(renderers) {
  const definitions=[
    ["CompareScene",z.object({before:z.string(),after:z.string(),beforeResult:z.string(),afterResult:z.string()}),"Compare a prediction with an account of past behavior."],
    ["ScopeScene",z.object({core:z.array(z.string()).length(3),extras:z.array(z.string()).length(4)}),"Compare a complete small pilot with a larger feature backlog."]
  ];
  const components=definitions.map(([name,props,description])=>{
    if(renderers&&typeof renderers[name]!=="function")throw new TypeError(`Missing renderer: ${name}`);
    return defineComponent({name,props,description,component:renderers?renderers[name]:null});
  });
  if(renderers&&typeof renderers.VisualRoot!=="function")throw new TypeError("Missing renderer: VisualRoot");
  const root=defineComponent({
    name:"VisualRoot",description:"A focused illustration inside a worked example.",
    props:z.object({hint:z.string(),children:z.array(z.union(components.map(c=>c.ref)))}),
    component:renderers?renderers.VisualRoot:null
  });
  return createLibrary({id:"founder-fieldwork-examples",root:"VisualRoot",components:[root,...components]});
}
export const visualPrograms={
  interviews:'root = VisualRoot("Compare what each question can actually tell you.", [example])\nexample = CompareScene("Would you use my receipt-chasing app?", "Walk me through your last monthly close.", "A prediction about your product. The person can say yes without describing a real need.", "A specific event you can investigate: the steps, the workaround, and what happened afterward.")',
  mvp:'root = VisualRoot("Switch the scope. The useful handoff stays the same.", [example])\nexample = ScopeScene(["Permitted checklist", "Reviewed summary", "Customer review"], ["Bank sync", "AI chat", "Forecasts", "Auto-send"])'
};
export function hasLessonVisual(id) {return Object.hasOwn(visualPrograms,id);}
export function lessonVisualProgram(id) {
  if(!hasLessonVisual(id))throw new RangeError(`No interactive example for lesson: ${id}`);
  return visualPrograms[id];
}
