const $=selector=>document.querySelector(selector);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const storageKey="founder-fieldwork-v1";
const ids=lessons.map(l=>l.id);
let state=emptyProgress(),storageAvailable=true,storageCorrupt=false,saveTimer;
let activeRoute={view:"course"},labIndex=0,labCorrect=0,labChecked=false;
function storageError(message){$("#storage-error").textContent=message;$("#storage-error").hidden=false;}
try {
  const raw=localStorage.getItem(storageKey);
  if(raw!==null)state=parseProgress(raw,ids);
} catch(error) {
  if(error instanceof SyntaxError||error instanceof TypeError) {
    storageCorrupt=true;
    storageError("Saved notes could not be read. They have not been overwritten. Open Notebook to export the original saved data before resetting.");
  } else {
    storageAvailable=false;
    storageError("Browser storage is unavailable. Notes work in this tab, but will not survive a reload. Export them from Notebook before leaving.");
  }
  console.error("Fieldwork storage could not be loaded:",error);
}
const requestedTheme=new URLSearchParams(location.search).get("scoutTheme");
if(["light","dark"].includes(requestedTheme))state.theme=requestedTheme;
function save() {
  clearTimeout(saveTimer);
  if(!storageAvailable||storageCorrupt)return false;
  try{localStorage.setItem(storageKey,JSON.stringify(state));return true;}
  catch(error){storageAvailable=false;storageError("Your latest changes could not be saved. Export your notes from Notebook before leaving.");console.error("Fieldwork notes could not be saved:",error);return false;}
}
function announce(text){$("#announcement").textContent=text;}
function updateTheme() {
  document.documentElement.dataset.theme=state.theme;
  $("#theme-toggle").setAttribute("aria-label",`Switch to ${state.theme==="dark"?"light":"dark"} theme`);
}
updateTheme();
$("#theme-toggle").addEventListener("click",()=>{state.theme=state.theme==="dark"?"light":"dark";updateTheme();save();});
$(".skip-link").addEventListener("click",event=>{event.preventDefault();$("#main-content").focus();$("#main-content").scrollIntoView({block:"start",behavior:"instant"});});
function saveStatus(saved) {
  for(const el of document.querySelectorAll(".save-state"))el.textContent=saved?"Saved in this browser":"Not saved to storage. Export before leaving.";
}
function wireEditors() {
  for(const editor of document.querySelectorAll("textarea[data-note],textarea[data-recall]"))editor.addEventListener("input",()=>{
    const id=editor.dataset.note||editor.dataset.recall;
    if(editor.dataset.note) {
      state.notes[id]=editor.value;
      if(!editor.value.trim())state.completed=state.completed.filter(item=>item!==id);
      const entry=editor.closest(".notebook-entry");
      if(entry)entry.querySelector(".entry-status").textContent=state.completed.includes(id)?"Complete":editor.value.trim()?"Draft":"No note yet";
      updateFinishButton();
    } else state.recalls[id]=editor.value;
    const status=editor.parentElement.querySelector(".save-state");
    if(status)status.textContent=storageAvailable&&!storageCorrupt?"Saving...":"Not saved to storage. Export before leaving.";
    clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveStatus(save()),300);
  });
}
function pageTitle(title){document.title=`${title} | Founder Fieldwork`;}
function byId(id){return lessons.find(l=>l.id===id);}
function lessonSource(l){return `<p class="lesson-source">Based on <a href="${esc(l.url)}" rel="noopener noreferrer">${esc(l.resource)}</a> by ${esc(l.author)}. <a href="#sources">Source notes</a>.</p>`;}
function renderCourse() {
  const next=nextUnfinishedLesson(lessons,state),hasWork=Object.values(state.notes).some(n=>n.trim())||Object.values(state.recalls).some(n=>n.trim())||state.passed.length>0;
  const allDone=state.completed.length===lessons.length;
  const start=lessonHref(next.id,allDone?"learn":resumePhase(next.id,state));
  pageTitle("The founder course");
  $("#view-content").innerHTML=`<section class="page course-page" aria-labelledby="course-title">
    <div class="course-intro"><p class="eyebrow">A practical founder course</p><h1 id="course-title" tabindex="-1">Learn the work after the prototype.</h1>
    <p class="course-lead">Find a real problem. Test a small offer. Learn whether people return.</p>
    <a id="start-course" class="primary" href="${start}">${allDone?"Review lesson 1":hasWork?`Continue: ${esc(learningGoals[next.id].label)}`:"Start lesson 1"}</a>
    <p class="course-guidance">Use one app or business idea throughout. Each lesson ends with one decision for your project.</p>
    ${hasWork?`<p class="course-progress">${state.completed.length} of ${lessons.length} practices complete. ${allDone?'<a href="#notebook">Review your next steps</a>.':""}</p>`:""}</div>
    <div class="course-outline">${chapters.map((chapter,index)=>`<section class="chapter" aria-labelledby="chapter-${index}"><div class="chapter-heading"><span class="chapter-number" aria-hidden="true">${index+1}</span><div><h2 id="chapter-${index}">${esc(chapter.title)}</h2><p>${esc(chapter.question)}</p></div></div>
      <ol class="lesson-menu" start="${index*3+1}">${chapter.ids.map(id=>`<li><a href="${lessonHref(id)}"><span>${esc(learningGoals[id].label)}</span><span class="lesson-menu-end">${state.completed.includes(id)?'<span class="completion-label">Complete</span>':'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M4 8H12M8 4L12 8L8 12"/></svg>'}</span></a></li>`).join("")}</ol></section>`).join("")}</div>
    <p class="course-boundary">An independently curated companion to @davecto's reel. <a href="#sources">Read the source boundary and original readings.</a></p></section>`;
}
function lessonHeader(l,phase) {
  const goal=learningGoals[l.id],index=lessons.indexOf(l);
  return `<header class="lesson-header"><a class="back-link" href="#course">All lessons</a><p class="lesson-location">Lesson ${index+1} of ${lessons.length}</p><h1 id="lesson-title" tabindex="-1">${esc(goal.label)}</h1><p class="lesson-outcome">You will leave with: ${esc(goal.artifact.toLowerCase())}.</p></header>
    <nav class="phase-nav" aria-label="Lesson steps">${lessonPhases.map((step,i)=>`<a href="${lessonHref(l.id,step)}"${step===phase?' aria-current="step"':""}><span aria-hidden="true">${i+1}</span>${["Learn","Check","Apply"][i]}</a>`).join("")}</nav>`;
}
function visualError(error) {
  console.error("OpenUI example could not render:",error);
  const warning=$("#visual-warning");
  if(warning){warning.hidden=false;warning.textContent="The interactive example could not render. The written example is still available.";}
}
function renderLearn(l) {
  const interactive=visualLessonIds.includes(l.id);
  return `<section class="lesson-phase" data-phase="learn" aria-label="Learn the idea"><p class="lesson-idea">${esc(l.idea)}</p>
    <p class="core-explanation">${esc(l.paragraphs[0])}</p>
    <section class="worked-example" aria-labelledby="example-title"><h2 id="example-title">An example</h2>${l.id==="problem"?'<p class="case-context">Our fictional product helps independent bookkeepers collect missing receipts so they can finish a client&#39;s monthly accounts.</p>':""}<p>${esc(l.case)}</p>
    ${interactive?`<div id="lesson-visual" data-lesson-visual="${l.id}" data-visual-state="loading"></div><p id="visual-warning" class="visual-error" role="alert" hidden></p>`:
    `<dl class="example-contrast"><div><dt>${esc(l.distinction[0])}</dt><dd>${esc(l.distinction[1])}</dd></div><div><dt>${esc(l.distinction[2])}</dt><dd>${esc(l.distinction[3])}</dd></div></dl>`}</section>
    <p class="lesson-caution"><strong>Keep this distinction.</strong> ${esc(l.trap)}</p>
    <details class="deeper"><summary>Go a little deeper</summary><p>${esc(l.paragraphs[1])}</p></details>
    <div class="phase-forward"><a class="primary" href="${lessonHref(l.id,"check")}">Check your understanding</a></div>${lessonSource(l)}</section>`;
}
function renderCheck(l) {
  const passed=state.passed.includes(l.id);
  return `<section class="lesson-phase" data-phase="check" aria-labelledby="check-heading"><h2 id="check-heading">Explain it before you look.</h2><p>Try to answer from memory. Then compare your reasoning with the choices.</p>
    <div class="editor"><label for="recall-note">${esc(learningGoals[l.id].recall)}</label><textarea id="recall-note" data-recall="${l.id}" placeholder="A sentence or two in your own words.">${esc(state.recalls[l.id]||"")}</textarea><span class="save-state">${storageAvailable&&!storageCorrupt?"Optional recall note. Saved locally as you write.":"Not saved to storage. Export before leaving."}</span></div>
    <details id="answer-choices" class="choices"><summary>Reveal the answer choices</summary>
    <form id="lesson-quiz"><fieldset><legend>${esc(l.quiz.question)}</legend>${l.quiz.options.map((option,i)=>`<label class="answer"><input type="radio" name="answer" value="${i}" required><span>${esc(option)}</span></label>`).join("")}</fieldset>
    <button id="check-answer" class="${passed?"secondary":"primary"}" type="submit">Check answer</button><div id="quiz-feedback" class="feedback" role="status" hidden></div></form></details>
    <div id="check-next"${passed?"":" hidden"}><p class="check-passed">${passed?"You have completed this check. Apply the idea to your own project next.":""}</p><a class="primary" href="${lessonHref(l.id,"apply")}">Apply it to your project</a></div>
    <a class="quiet-back" href="${lessonHref(l.id)}">Read the explanation again</a></section>`;
}
function renderApply(l) {
  const done=state.completed.includes(l.id);
  return `<section class="lesson-phase" data-phase="apply" aria-labelledby="apply-heading"><h2 id="apply-heading">${esc(l.task)}</h2><p>This is the decision you will take back to your own project.</p>
    <div class="editor"><label for="lesson-note">${esc(l.prompt)}</label><textarea id="lesson-note" data-note="${l.id}" placeholder="Write the decision or next step for your project.">${esc(state.notes[l.id]||"")}</textarea><span class="save-state">${storageAvailable&&!storageCorrupt?"Saved in this browser as you write.":"Not saved to storage. Export before leaving."}</span></div>
    <div class="phase-forward"><button id="finish-lesson" class="primary" type="button" aria-describedby="finish-hint"${!canComplete(state,l.id)?" disabled":""}>${done?"Review your takeaway":"Finish this lesson"}</button><p id="finish-hint" class="small"></p></div>
    <details class="guidance"><summary>Need a starting point?</summary><ol>${l.steps.map(step=>`<li>${esc(step)}</li>`).join("")}</ol><h3>A fictional example</h3><p>${esc(l.example)}</p><p>Use your own situation. The example is guidance, not a note to copy.</p></details></section>`;
}
function renderDone(l) {
  const index=lessons.indexOf(l);
  if(!state.completed.includes(l.id))return `<section class="reader"><a class="back-link" href="#course">All lessons</a><h1 tabindex="-1">Finish the practice first.</h1><p>The summary is available after you complete the check and write a project note.</p><a class="primary" href="${lessonHref(l.id,"apply")}">Return to Apply</a></section>`;
  return `<section class="reader lesson-done"><a class="back-link" href="#course">All lessons</a><p class="eyebrow">Lesson ${index+1} complete</p><h1 id="done-title" tabindex="-1">${esc(l.takeaway)}</h1><h2>Your next step</h2><p class="saved-decision">${esc(state.notes[l.id])}</p><p class="small">This records your practice, not proof that the business works.</p><div class="phase-forward"><a class="primary" href="${index<lessons.length-1?lessonHref(lessons[index+1].id):"#notebook"}">${index<lessons.length-1?`Next: ${esc(learningGoals[lessons[index+1].id].label)}`:"Open your notebook"}</a></div><a class="quiet-back" href="${lessonHref(l.id,"apply")}">Edit your decision</a></section>`;
}
function updateFinishButton() {
  const button=$("#finish-lesson");
  if(!button||activeRoute.view!=="lesson")return;
  const id=activeRoute.id;
  button.disabled=!canComplete(state,id);
  $("#finish-hint").innerHTML=!state.passed.includes(id)?`Complete the <a href="${lessonHref(id,"check")}">Check step</a> first.`:!state.notes[id]?.trim()?"Write a decision for your project before finishing.":"Your note remains editable in Notebook.";
}
function renderLesson(l,phase) {
  pageTitle(learningGoals[l.id].label);
  if(phase==="done"){$("#view-content").innerHTML=renderDone(l);return;}
  $("#view-content").innerHTML=`<article class="reader" data-lesson="${l.id}">${lessonHeader(l,phase)}${phase==="learn"?renderLearn(l):phase==="check"?renderCheck(l):renderApply(l)}</article>`;
  if(phase==="learn"&&visualLessonIds.includes(l.id))FieldworkVisuals.mountLessonVisual($("#lesson-visual"),l.id,{onError:visualError});
  if(phase==="check")$("#lesson-quiz").addEventListener("submit",event=>{
    event.preventDefault();
    const answer=new FormData(event.currentTarget).get("answer");
    if(answer===null)return;
    const index=Number(answer),correct=index===l.quiz.correct;
    const feedback=$("#quiz-feedback");feedback.hidden=false;feedback.dataset.result=correct?"correct":"incorrect";
    feedback.textContent=`${correct?"Yes.":"Look at the evidence again."} ${l.quiz.explanations[index]}`;
    if(correct) {
      if(!state.passed.includes(l.id))state.passed.push(l.id);
      save();
      for(const input of document.querySelectorAll('#lesson-quiz input'))input.disabled=true;
      $("#check-answer").hidden=true;$("#check-next").hidden=false;
      $("#check-next .check-passed").textContent="Now make the decision for your own project.";
    }
  });
  if(phase==="apply") {
    updateFinishButton();
    $("#finish-lesson").addEventListener("click",()=>{
      if(!canComplete(state,l.id))return;
      if(!state.completed.includes(l.id))state.completed.push(l.id);
      save();location.hash=lessonHref(l.id,"done");
    });
  }
  wireEditors();
}
function download(name,text,type="text/markdown;charset=utf-8") {
  const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement("a");
  a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function preparePrint() {
  $("#print-course").innerHTML=`<h1>Founder Fieldwork</h1><p>Original teaching material, independently curated from sources named in @davecto's reel and added companion readings. The full nine-resource list was not publicly visible.</p><p>The receipt-chasing product is a fictional running example. Course completion is not business validation.</p>`+
  lessons.map(l=>`<article><h2>${esc(learningGoals[l.id].label)}</h2><p>${esc(l.author)}: <a href="${esc(l.url)}">${esc(l.resource)}</a></p><p>${esc(l.origin)}.</p><h3>Learn</h3><p>${esc(l.idea)}</p>${l.paragraphs.map(p=>`<p>${esc(p)}</p>`).join("")}<p>${esc(l.case)}</p><p>${esc(l.trap)}</p><h3>Check</h3><p>${esc(learningGoals[l.id].recall)}</p><p>${esc(state.recalls[l.id]||"(No recall note yet.)")}</p><p>${esc(l.quiz.question)}</p><ol>${l.quiz.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p>Answer: ${l.quiz.correct+1}. ${esc(l.quiz.explanations[l.quiz.correct])}</p><h3>Apply</h3><p>${esc(l.task)}</p><ol>${l.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol><p>${esc(l.prompt)}</p><p>${esc(state.notes[l.id]||"(No project note yet.)")}</p></article>`).join("");
}
function renderNotebook() {
  pageTitle("Your notebook");
  $("#view-content").innerHTML=`<section class="page notebook-page"><a class="back-link" href="#course">Back to the course</a><h1 id="notebook-title" tabindex="-1">Your founder notebook.</h1><p class="page-lead">Review the decisions you will take back to your project. Open a lesson below to edit its note.</p>
    <div class="notebook-tools"><button class="primary" id="export-notes" type="button">Export my notes</button><button class="text-button" id="print-guide" type="button">Print the full guide</button></div>
    <p class="small">These notes stay in this browser. Export before moving devices or clearing site data. Avoid private customer details.</p>
    <div class="notebook-entries">${lessons.map((l,i)=>`<details class="notebook-entry"><summary><span>${i+1}. ${esc(learningGoals[l.id].label)}</span><span class="entry-status">${state.completed.includes(l.id)?"Complete":state.notes[l.id]?.trim()?"Draft":"No note yet"}</span></summary><div class="editor"><label for="note-${l.id}">${esc(l.prompt)}</label><textarea id="note-${l.id}" data-note="${l.id}">${esc(state.notes[l.id]||"")}</textarea><span class="save-state">${storageAvailable&&!storageCorrupt?"Saved locally as you write.":"Not saved to storage. Export before leaving."}</span></div>${state.recalls[l.id]?.trim()?`<details class="recall-review"><summary>Your recall note</summary><p>${esc(state.recalls[l.id])}</p></details>`:""}<a class="entry-lesson" href="${lessonHref(l.id,"apply")}">Return to this practice</a></details>`).join("")}</div>
    <details class="storage-tools"><summary>Storage and reset</summary><p class="small">Reset removes only this course's notes and progress from this browser. Downloaded copies are unchanged.</p>${storageCorrupt?'<button class="secondary" id="export-original" type="button">Export original saved data</button>':""}<button class="secondary" id="reset-request" type="button" aria-expanded="false">Reset this course</button><div id="reset-confirm" hidden><p>Export first if you need a copy.</p><button class="secondary" id="reset-cancel" type="button">Keep my notes</button><button class="secondary" id="reset-yes" type="button">Delete my course notes</button></div></details></section>`;
  if(storageCorrupt)$(".storage-tools").open=true;
  $("#export-notes").addEventListener("click",()=>{save();download("founder-fieldwork-notes.md",makeNotebook(lessons,state));announce("Notes exported.");});
  $("#print-guide").addEventListener("click",()=>{preparePrint();window.print();});
  if(storageCorrupt)$("#export-original").addEventListener("click",()=>{
    try{const raw=localStorage.getItem(storageKey);if(raw===null)throw new Error("The original record is no longer present.");download("founder-fieldwork-original.txt",raw,"text/plain;charset=utf-8");}
    catch(error){storageError("The original data could not be exported. Your current in-tab notes can still be exported separately.");console.error("Original note export failed:",error);}
  });
  $("#reset-request").addEventListener("click",()=>{$("#reset-confirm").hidden=false;$("#reset-request").setAttribute("aria-expanded","true");$("#reset-cancel").focus();});
  $("#reset-cancel").addEventListener("click",()=>{$("#reset-confirm").hidden=true;$("#reset-request").setAttribute("aria-expanded","false");$("#reset-request").focus();});
  $("#reset-yes").addEventListener("click",()=>{
    clearTimeout(saveTimer);
    try{localStorage.removeItem(storageKey);}catch(error){storageError("Reset failed because browser storage is blocked. The notes in this tab have not been cleared.");console.error("Reset failed:",error);return;}
    const theme=state.theme;state=emptyProgress();state.theme=theme;storageAvailable=true;storageCorrupt=false;
    $("#storage-error").hidden=true;save();renderNotebook();$("#notebook-title").focus({preventScroll:true});announce("Course notes and progress reset.");
  });
  for(const entry of document.querySelectorAll(".notebook-entry"))entry.addEventListener("toggle",()=>{if(entry.open)for(const other of document.querySelectorAll(".notebook-entry"))if(other!==entry)other.open=false;});
  wireEditors();
}
function renderSources() {
  pageTitle("Reading list");
  $("#view-content").innerHTML=`<section class="reader sources-page"><a class="back-link" href="#course">Back to the course</a><h1 tabindex="-1">Read the originals.</h1><p class="page-lead">The lessons and exercises are original teaching material. These sources carry the authors' fuller arguments.</p>
    <section class="source-boundary"><h2>What came from the reel?</h2><p>The public <a href="https://www.instagram.com/reels/DeW-3XAxxpG/" rel="noopener noreferrer">reel by @davecto</a> names Paul Graham, Y Combinator, and <em>The Mom Test</em>. It offers the complete nine-resource list through a comment-triggered message.</p><p>That full list was not visible in the inspected public material. This course is an independently curated companion, not a reconstruction of the creator's list. It selects readings from the named sources and adds Stripe, Rahul Vohra's Superhuman case study, and Sam Altman's playbook.</p><p>The receipt-chasing business is fictional. Exercises are practice, not evidence that a real business will succeed.</p></section>
    <ol class="reading-list">${lessons.map(l=>`<li><a href="${esc(l.url)}" rel="noopener noreferrer">${esc(l.resource)}</a><span>${esc(l.author)}</span><p>${esc(l.origin)}.</p></li>`).join("")}</ol><p class="small">Public titles and source pages checked on 18 October 2026. Advice is context-dependent.</p><a class="secondary" href="#lab">Try optional evidence practice</a></section>`;
}
function renderLab() {
  pageTitle("Evidence practice");
  const final=labIndex>=signals.length;
  $(".evidence-figure").hidden=final;
  $("#lab-questions").innerHTML=`<p class="eyebrow">Optional practice</p><h1 id="lab-title" tabindex="-1">What does this signal prove?</h1><p class="page-lead">An opinion, an observed behavior, and a commitment answer different questions. Sort the statement, then inspect the limit.</p>
    ${final?`<p class="lab-statement">You classified ${labCorrect} of ${signals.length} correctly on the first try.</p><p>This is practice with evidence categories, not a startup score.</p><button id="restart-lab" class="primary" type="button">Try again</button>`:
    `<p class="small">Statement ${labIndex+1} of ${signals.length}</p><p class="lab-statement">${esc(signals[labIndex].text)}</p><form id="lab-form"><fieldset><legend>Which category fits?</legend>${categories.map(c=>`<label class="answer"><input type="radio" name="category" value="${c}" required><span>${c[0].toUpperCase()+c.slice(1)}</span></label>`).join("")}</fieldset><button id="check-signal" class="primary" type="submit">Check my classification</button><div id="lab-feedback" class="feedback" role="status" hidden></div><button id="next-signal" class="primary" type="button" hidden>${labIndex===signals.length-1?"Review the practice":"Next statement"}</button></form><p class="small">Opinion: a reaction or prediction. Behavior: something that happened. Commitment: a specific investment of time, effort, or money.</p>`}`;
  if(final){$("#restart-lab").addEventListener("click",()=>{labIndex=0;labCorrect=0;renderLab();setDrawer(null);});return;}
  labChecked=false;
  $("#lab-form").addEventListener("submit",event=>{
    event.preventDefault();if(labChecked)return;
    const result=evaluateSignal(signals[labIndex],new FormData(event.currentTarget).get("category"));
    if(result.correct)labCorrect++;labChecked=true;
    const feedback=$("#lab-feedback");feedback.hidden=false;feedback.dataset.result=result.correct?"correct":"incorrect";
    feedback.innerHTML=`<p><strong>${result.correct?"That fits.":`This is ${esc(result.category)}.`}</strong> ${esc(result.explanation)}</p><p>Next: ${esc(result.next)}</p>`;
    setDrawer(result.category,result.explanation);
    $("#check-signal").hidden=true;for(const input of document.querySelectorAll("#lab-form input"))input.disabled=true;
    $("#next-signal").hidden=false;
  });
  $("#next-signal").addEventListener("click",()=>{labIndex++;renderLab();setDrawer(null);$("#lab-title").focus({preventScroll:true});});
}
function renderRoute({focus=false}={}) {
  save();FieldworkVisuals.unmountLessonVisual();
  activeRoute=parseLearningRoute(location.hash,ids);
  const lab=activeRoute.view==="lab";$("#view-content").hidden=lab;$("#lab-section").hidden=!lab;
  if(activeRoute.view==="course")renderCourse();
  else if(activeRoute.view==="lesson")renderLesson(byId(activeRoute.id),activeRoute.phase);
  else if(activeRoute.view==="notebook")renderNotebook();
  else if(activeRoute.view==="sources")renderSources();
  else if(lab)renderLab();
  else {pageTitle("Page not found");$("#view-content").innerHTML='<section class="reader"><h1 tabindex="-1">That lesson was not found.</h1><p>The link may be incomplete or out of date.</p><a class="primary" href="#course">Open the course</a></section>';}
  for(const link of document.querySelectorAll("[data-nav]")) {
    const current=link.dataset.nav==="course"?["course","lesson"].includes(activeRoute.view):activeRoute.view==="notebook";
    if(current)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current");
  }
  if(focus){window.scrollTo({top:0,behavior:"instant"});const heading=$(lab?"#lab-title":"#view-content h1");if(heading)heading.focus({preventScroll:true});}
}
window.addEventListener("hashchange",()=>renderRoute({focus:true}));
window.addEventListener("pagehide",save);window.addEventListener("beforeprint",preparePrint);

const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)");
const parts=[...document.querySelectorAll("#cabinet-parts>[data-part]")];
const opening=Object.fromEntries(categories.map(c=>[c,0]));
let selectedDrawer=null,visible=false,frame=0,last=0;
function paintCabinet() {
  for(const part of parts){const share=opening[part.dataset.drawer]||0;part.setAttribute("transform",`translate(${cabinetMotion[0]*share} ${cabinetMotion[1]*share})`);part.classList.toggle("selected",part.dataset.drawer===selectedDrawer);}
  const sorted=[...parts].sort((a,b)=>(Number(a.dataset.key)+Number(a.dataset.lift)*(opening[a.dataset.drawer]||0))-(Number(b.dataset.key)+Number(b.dataset.lift)*(opening[b.dataset.drawer]||0)));
  for(const part of sorted)$("#cabinet-parts").append(part);
}
function tick(now) {
  const dt=last?Math.min((now-last)/1000,1/30):1/60;last=now;let moving=false;
  for(const category of categories){const target=category===selectedDrawer?1:0;opening[category]=reduceMotion.matches?target:opening[category]+(target-opening[category])*(1-Math.exp(-dt/.16));if(Math.abs(target-opening[category])<.001)opening[category]=target;else moving=true;}
  paintCabinet();frame=visible&&moving?requestAnimationFrame(tick):0;
}
function wakeCabinet(){if(reduceMotion.matches){for(const c of categories)opening[c]=c===selectedDrawer?1:0;paintCabinet();return;}if(visible&&!frame){last=0;frame=requestAnimationFrame(tick);}}
function setDrawer(category,explanation="Check your classification to open the matching drawer.") {
  if(category!==null&&!categories.includes(category))throw new RangeError("Unknown evidence category.");
  selectedDrawer=category;$("#signal-reading").textContent=explanation;wakeCabinet();
}
new IntersectionObserver(entries=>{visible=entries[entries.length-1].isIntersecting;if(!visible&&frame){cancelAnimationFrame(frame);frame=0;}else if(visible)wakeCabinet();},{rootMargin:"120px 0px"}).observe($(".cabinet-stage"));
reduceMotion.addEventListener("change",wakeCabinet);
renderRoute();
