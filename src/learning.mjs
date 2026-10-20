export const lessonPhases=["learn","check","apply"];
export {learningGoals,chapters} from "./curriculum.mjs";
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
