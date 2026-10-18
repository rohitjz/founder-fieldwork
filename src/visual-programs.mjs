import { createLibrary, defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

const threeStrings = z.array(z.string()).length(3);
const definitions = [
  ["FlowScene", z.object({ kind: z.enum(["friction","assumptions","manual","launch","focus"]), labels: threeStrings, descriptions: threeStrings }), "An inspectable sequence. Each step explains a different part of a founder decision."],
  ["CompareScene", z.object({ before: z.string(), after: z.string(), beforeResult: z.string(), afterResult: z.string() }), "Compare a leading interview question with a question about actual behavior."],
  ["ScopeScene", z.object({ core: threeStrings, extras: z.array(z.string()).length(4) }), "Toggle between a complete narrow workflow and an oversized feature backlog."],
  ["OfferScene", z.object({ units: z.array(z.string()).length(2), descriptions: z.array(z.string()).length(2) }), "Compare billing units without inventing a price or implying customer acceptance."],
  ["ReturnScene", z.object({ labels: threeStrings }), "Compare daily activity with a return opportunity at the customer's workflow cadence."],
  ["PracticeAction", z.object({ prompt: z.string() }), "An explicit action that appends a practice prompt to the existing local field note."],
  ["CourseRoute", z.object({ stage: z.number().int().min(0).max(2) }), "The three course sections. Links open their first lessons."]
];

export function createVisualLibrary(renderers) {
  const components = definitions.map(([name,props,description]) => {
    if (renderers && typeof renderers[name] !== "function") throw new TypeError(`Missing renderer: ${name}`);
    return defineComponent({name,props,description,component:renderers ? renderers[name] : null});
  });
  const root = defineComponent({
    name:"VisualRoot",
    description:"A branded lesson illustration with an explanatory heading and typed content.",
    props:z.object({title:z.string(),hint:z.string(),children:z.array(z.union(components.map(c=>c.ref)))}),
    component:renderers ? renderers.VisualRoot : null
  });
  if(renderers&&typeof renderers.VisualRoot!=="function")throw new TypeError("Missing renderer: VisualRoot");
  return createLibrary({id:"founder-fieldwork-visuals",root:"VisualRoot",components:[root,...components]});
}

const q=JSON.stringify;
const program=(title,hint,scene,prompt)=>`root = VisualRoot(${q(title)}, ${q(hint)}, [scene, practice])\nscene = ${scene}\npractice = PracticeAction(${q(prompt)})`;
const flow=(kind,labels,descriptions)=>`FlowScene(${q(kind)}, ${q(labels)}, ${q(descriptions)})`;

export const visualPrograms = {
  problem:program("Follow the friction.","Inspect each step. A category becomes useful when you can observe a specific job.",
    flow("friction",["Broad category","Reachable person","Real workaround"],[
      "Small businesses is a category. It does not tell you who needs help or when.",
      "Independent bookkeepers are a narrower group you can find and speak with.",
      "A reminder spreadsheet used during the last close exposes a workflow you can investigate."
    ]),"I will find a reachable person, inspect their last workaround, and separate observed facts from guesses."),
  interviews:program("Change the question. Change what you learn.","Compare a prediction about your idea with an account of something that happened.",
    `CompareScene(${q("Would you use my receipt-chasing app?")}, ${q("Walk me through your last monthly close.")}, ${q("You get a prediction shaped by the pitch. A friendly yes is easy to give.")}, ${q("You can ask about the sequence, the workaround, and what happened when a client did not respond.")})`,
    "I will ask about the last time the problem happened, the workaround, and its consequence before describing my product."),
  learning:program("Find the blocking assumption.","Wanting an outcome and being able to use your service are different questions.",
    flow("assumptions",["Useful outcome","Permitted inputs","Workable delivery"],[
      "A bookkeeper may want a missing-item summary. Confirm the problem with a recent example.",
      "They may not be able to share client inbox access. Investigate a safe input before building an integration.",
      "Even with permitted inputs, you still need to deliver an accurate result within the agreed scope."
    ]),"The assumption that could block my next step is ____. I will look for evidence that could contradict it."),
  mvp:program("Cut the scope. Keep the useful handoff.","Switch the view to see which work belongs in the first complete pilot.",
    `ScopeScene(${q(["Permitted checklist","Reviewed summary","Customer review"])}, ${q(["Bank sync","AI chat","Forecasts","Auto-send"])})`,
    "My first pilot will accept ____, produce ____, and leave out ____. The customer will review the output before using it."),
  manual:program("Watch the handoff before automating it.","A manual pilot can expose the repeated steps and the exceptions.",
    flow("manual",["Customer input","Founder review","Useful handoff"],[
      "Agree on the permitted checklist, scope, and data handling before accepting the work.",
      "Prepare the summary manually. Record the steps, time, and exceptions instead of hiding the work.",
      "Watch what the customer uses. Automate repeated useful work after you understand it."
    ]),"I will deliver ____ manually, record the actual steps and cost, and ask which part of the result the customer used."),
  launch:program("Give the launch somewhere to go.","A launch is easier to interpret when the audience, promise, and next action are clear.",
    flow("launch",["Relevant audience","Specific offer","Observable action"],[
      "Choose a channel where bookkeepers gather. Ask permission and follow its rules.",
      "Describe a reviewed missing-item summary and its limits, rather than a general AI finance app.",
      "Record a request, a completed pilot, and a decline separately. Each tells you something different."
    ]),"I will reach ____ through ____, describe a scoped outcome, and observe ____ as the next action."),
  pricing:program("Choose a unit the customer can inspect.","This is an illustrative offer, not a recommended price.",
    `OfferScene(${q(["AI tokens","A client close"])}, ${q(["A unit of computation. The customer still has to translate it into a useful result.","A workflow the bookkeeper recognizes. Scope, price, and delivery costs still need testing."])})`,
    "My offer charges for ____. I will state the scope and limits, measure delivery cost, and ask for an informed next step."),
  retention:program("Measure return when the need returns.","A monthly job should not be judged by daily logins alone.",
    `ReturnScene(${q(["Close A","Between closes","Close B"])})`,
    "The next natural opportunity to use my product is ____. I will check who had that opportunity, who returned, and why."),
  focus:program("Spend the week on a decision.","Choose the work that can resolve a consequential uncertainty.",
    flow("focus",["Name the risk","Run a small test","Review the result"],[
      "If repeated usefulness is uncertain, another dashboard may leave the main risk untouched.",
      "Contact eligible pilot users about the next close. Make the test specific enough to inspect.",
      "Use a prewritten continue, change, or stop rule. Leave time to decide what the evidence means."
    ]),"By ____, I will test ____ with ____. The result would make me continue if ____, change if ____, or stop if ____. I will postpone ____.")
};

export function lessonVisualProgram(id) {
  if(!Object.hasOwn(visualPrograms,id))throw new RangeError(`Unknown lesson visual: ${id}`);
  return visualPrograms[id];
}
export function courseRouteProgram(stage) {
  if(!Number.isInteger(stage)||stage<0||stage>2)throw new RangeError("Unknown course section.");
  return `root = VisualRoot("", "", [route])\nroute = CourseRoute(${stage})`;
}
