export const lessonPhases=["learn","check","apply"];
export const learningGoals={
  problem:{label:"Find a real problem",artifact:"A specific problem statement",recall:"How would you distinguish a real customer problem from an idea that merely sounds useful?"},
  interviews:{label:"Ask better questions",artifact:"Questions that uncover actual behavior",recall:"Why does asking about the last time tell you more than asking whether someone would use your app?"},
  learning:{label:"Test the blocking assumption",artifact:"A test for your riskiest assumption",recall:"A customer wants the outcome but cannot share the inputs. What have you learned, and what is still uncertain?"},
  mvp:{label:"Build a useful first version",artifact:"A small, complete pilot scope",recall:"What must stay in a minimum useful product, even after you cut its technical scope?"},
  manual:{label:"Deliver it by hand first",artifact:"A manual delivery plan",recall:"What can a manual pilot teach you, and what does a happy pilot customer still not prove?"},
  launch:{label:"Reach your first customers",artifact:"A clear offer for a reachable audience",recall:"If a launch gets no replies, what should you investigate before concluding there is no demand?"},
  pricing:{label:"Make a paid offer",artifact:"An offer with clear scope and a billing unit",recall:"How is a customer accepting a scoped paid pilot different from saying a price sounds fair?"},
  retention:{label:"Check whether people return",artifact:"A definition of meaningful repeat use",recall:"When should you look for repeat use in a monthly workflow, and who belongs in that comparison?"},
  focus:{label:"Choose next week's test",artifact:"A one-week experiment and decision rule",recall:"How would you choose one useful experiment from a long list of things you could build?"}
};
export const chapters=[
  {title:"Find a real problem",question:"Who needs this, and what is hard for them?",ids:["problem","interviews","learning"]},
  {title:"Test a useful offer",question:"Can you deliver an outcome someone will use?",ids:["mvp","manual","launch"]},
  {title:"Earn repeat use",question:"Will people pay, return, and justify more work?",ids:["pricing","retention","focus"]}
];
export function parseLearningRoute(hash,ids) {
  const value=hash.replace(/^#/,"");
  if(!value||value==="course")return {view:"course"};
  if(["notebook","sources","lab"].includes(value))return {view:value};
  if(value==="resources")return {view:"sources"};
  const params=new URLSearchParams(value);
  const id=params.get("lesson"),phase=params.get("step")||"learn";
  if(ids.includes(id)&&[...lessonPhases,"done"].includes(phase))return {view:"lesson",id,phase};
  return {view:"not-found"};
}
export function lessonHref(id,phase="learn") {
  if(![...lessonPhases,"done"].includes(phase))throw new RangeError("Unknown lesson phase.");
  return `#lesson=${encodeURIComponent(id)}${phase==="learn"?"":`&step=${phase}`}`;
}
export function nextUnfinishedLesson(lessons,state) {
  return lessons.find(l=>!state.completed.includes(l.id))||lessons[0];
}
export function resumePhase(id,state) {
  return state.passed.includes(id)?"apply":state.recalls?.[id]?.trim()?"check":"learn";
}
