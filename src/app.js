const $ = selector => document.querySelector(selector);
const esc = value => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const storageKey = "founder-fieldwork-v1";
const ids = lessons.map(l => l.id);
let state = emptyProgress();
let storageAvailable = true;
let storageCorrupt = false;
let saveTimer;
let currentLesson = lessons[0];
let currentView = "course";
let labIndex = 0;
let labChecked = false;
let labCorrect = 0;

function storageError(message) {
  const banner = $("#storage-error");
  banner.textContent = message;
  banner.hidden = false;
}
try {
  const raw = localStorage.getItem(storageKey);
  if (raw !== null) state = parseProgress(raw, ids);
} catch (error) {
  if (error instanceof SyntaxError || error instanceof TypeError) {
    storageCorrupt = true;
    storageError("Saved notes could not be read. They have not been overwritten. Export the original saved data from Field notes, then explicitly reset it to enable saving.");
  } else {
    storageAvailable = false;
    storageError("Browser storage is unavailable. You can work in this tab, but notes will not survive a reload. Export them before leaving.");
  }
  console.error("Fieldwork storage could not be loaded:", error);
}
const requestedTheme = new URLSearchParams(location.search).get("scoutTheme");
if (["light","dark"].includes(requestedTheme)) state.theme = requestedTheme;
document.documentElement.dataset.theme = state.theme;

function save() {
  clearTimeout(saveTimer);
  if (!storageAvailable || storageCorrupt) return false;
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    return true;
  } catch (error) {
    storageAvailable = false;
    storageError("Your latest changes could not be saved in this browser. Export field notes now so they are not lost.");
    console.error("Fieldwork notes could not be saved:", error);
    return false;
  }
}
function announce(message) { $("#announcement").textContent = message; }
function updateThemeButton() {
  $("#theme-toggle").setAttribute("aria-label", `Switch to ${state.theme === "dark" ? "light" : "dark"} theme`);
}
$("#theme-toggle").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = state.theme;
  updateThemeButton();
  save();
});
updateThemeButton();

function updateProgress() {
  const n = state.completed.length;
  $("#progress-text").textContent = `${n} of ${lessons.length} practices complete`;
  $("#course-progress").value = n;
  $("#note-count").textContent = Object.values(state.notes).filter(n => n.trim()).length;
}
function renderIndex() {
  const groups = [...new Set(lessons.map(l => l.group))];
  $("#lesson-list").innerHTML = groups.map(group => `<section class="lesson-group"><h3>${esc(group)}</h3>${lessons.filter(l=>l.group===group).map(l => {
    const i = lessons.indexOf(l), done = state.completed.includes(l.id);
    return `<a class="lesson-link" href="#lesson=${l.id}"${currentView==="course"&&currentLesson.id===l.id ? ' aria-current="step"' : ""}><span class="ordinal">${i+1}</span><span>${esc(l.short)}</span>${done ? '<svg class="done-mark" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" aria-label="Practice complete"><path d="M3 8L6.5 11.5L13 4.5"/></svg>' : ""}</a>`;
  }).join("")}</section>`).join("");
  $("#lesson-position").textContent = `${lessons.indexOf(currentLesson)+1} / ${lessons.length}`;
  $("#mobile-lesson").innerHTML = groups.map(group=>`<optgroup label="${esc(group)}">${lessons.filter(l=>l.group===group).map(l=>`<option value="${l.id}">${lessons.indexOf(l)+1}. ${esc(l.short)}</option>`).join("")}</optgroup>`).join("");
  $("#mobile-lesson").value = currentLesson.id;
}
$("#mobile-lesson").addEventListener("change",event=>{location.hash="lesson="+event.target.value;});
function completionState() {
  const button = $("#complete-lesson");
  if (!button) return;
  const done = state.completed.includes(currentLesson.id);
  button.disabled = !canComplete(state,currentLesson.id) || done;
  button.textContent = done ? "Practice complete" : "Mark practice complete";
  $("#completion-hint").textContent = done ? "This records your practice, not business validation." :
    !state.passed.includes(currentLesson.id) ? "Answer the check correctly and write a field note to complete this practice." :
    !state.notes[currentLesson.id]?.trim() ? "Write a field note to complete this practice." : "Ready when your note describes a real next step.";
}
function noteStatus(saved) {
  for (const el of document.querySelectorAll(".save-state")) {
    el.textContent = saved ? "Saved in this browser" : "Not saved to storage. Export before leaving.";
  }
}
function wireNotes() {
  for (const textarea of document.querySelectorAll("textarea[data-note]")) {
    textarea.addEventListener("input", () => {
      const id = textarea.dataset.note;
      state.notes[id] = textarea.value;
      if (!textarea.value.trim()) state.completed = state.completed.filter(item=>item!==id);
      completionState(); updateProgress(); renderIndex();
      const status = textarea.parentElement.querySelector(".save-state");
      if(status) status.textContent = storageAvailable&&!storageCorrupt ? "Saving..." : "Not saved to storage. Export before leaving.";
      clearTimeout(saveTimer);
      saveTimer = setTimeout(()=>noteStatus(save()),300);
    });
  }
}
function renderLesson() {
  const l = currentLesson, n = lessons.indexOf(l);
  $("#workspace-content").innerHTML = `<div class="lesson-layout">
    <article class="lesson-article">
      <div class="lesson-meta"><span class="lesson-number">Lesson ${n+1} of ${lessons.length}</span><span>${esc(l.author)}</span></div>
      <h3 class="lesson-title" tabindex="-1">${esc(l.title)}</h3>
      <p class="lesson-idea">${esc(l.idea)}</p>
      <div class="lesson-prose">${l.paragraphs.map(p=>`<p>${esc(p)}</p>`).join("")}
      <h4>At the founder's desk</h4><p class="case-text">${esc(l.case)}</p></div>
      <div class="comparison"><div><span>${esc(l.distinction[0])}</span><p>${esc(l.distinction[1])}</p></div><div><span>${esc(l.distinction[2])}</span><p>${esc(l.distinction[3])}</p></div></div>
      <p class="trap"><strong>Where this breaks.</strong> ${esc(l.trap)}</p>
      <form id="lesson-quiz" class="quiz"><h4>Check your judgment</h4><fieldset><legend>${esc(l.quiz.question)}</legend>
      ${l.quiz.options.map((o,i)=>`<label class="answer"><input type="radio" name="answer" value="${i}" required><span>${esc(o)}</span></label>`).join("")}
      </fieldset><button class="secondary" type="submit">Check answer</button><div id="quiz-feedback" class="feedback" aria-live="polite" hidden></div></form>
      <div class="lesson-bottom"><p class="takeaway">${esc(l.takeaway)}</p><div class="bottom-actions">${n>0?`<a href="#lesson=${lessons[n-1].id}">Previous lesson</a>`:'<a href="#lab">Try the evidence lab</a>'}${n<lessons.length-1?`<a href="#lesson=${lessons[n+1].id}">Next: ${esc(lessons[n+1].short)}</a>`:'<a href="#notebook">Review your field notes</a>'}</div></div>
      <p class="source-attribution">Reading: <a href="${esc(l.url)}" rel="noopener noreferrer">${esc(l.resource)}</a><br>${esc(l.origin)}. Lesson and exercises are original.</p>
    </article>
    <aside class="fieldcard" aria-labelledby="practice-heading">
      <h3 id="practice-heading">Take it into the field.</h3><p class="practice-task">${esc(l.task)}</p>
      <ol class="practice-steps">${l.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
      <label for="lesson-note">${esc(l.prompt)}</label><textarea id="lesson-note" data-note="${l.id}" placeholder="Keep this specific to your project.">${esc(state.notes[l.id]||"")}</textarea>
      <span class="save-state" role="status">${storageAvailable&&!storageCorrupt ? "Notes save locally as you write" : "Storage unavailable. Export your notes."}</span>
      <details><summary>See an example note</summary><p>${esc(l.example)}</p></details>
      <button id="complete-lesson" class="primary completion" type="button">Mark practice complete</button><p id="completion-hint" class="completion-hint"></p>
    </aside></div>`;
  $("#lesson-quiz").addEventListener("submit",event=>{
    event.preventDefault();
    const selected = Number(new FormData(event.currentTarget).get("answer"));
    const correct = selected===l.quiz.correct;
    const feedback = $("#quiz-feedback");
    feedback.hidden = false;
    feedback.dataset.result = correct ? "correct" : "incorrect";
    feedback.textContent = `${correct ? "That's the useful distinction." : "Reconsider the evidence."} ${l.quiz.explanations[selected]}`;
    if(correct&&!state.passed.includes(l.id)) { state.passed.push(l.id); save(); }
    completionState();
  });
  $("#complete-lesson").addEventListener("click",()=>{
    if (!canComplete(state,l.id) || state.completed.includes(l.id)) return;
    state.completed.push(l.id); save(); updateProgress(); renderIndex(); completionState();
    announce(`Practice complete: ${l.short}.`);
  });
  completionState(); wireNotes();
}
function renderLab() {
  const final = labIndex>=signals.length;
  $("#workspace-content").innerHTML = `<section aria-labelledby="lab-title"><p class="lesson-meta">Practice separating the signal from the story</p><h3 id="lab-title" class="lab-title" tabindex="-1">What does the evidence say?</h3>
    <p class="lab-intro">An opinion, observed behavior, and a costly commitment answer different questions. Sort the signal, then inspect what it still does not prove.</p>
    ${final ? `<p class="lab-statement">You sorted ${labCorrect} of ${signals.length} signals correctly on the first try.</p><p class="lab-intro">This was a classification exercise, not a test of your business. Take one claim from your project and ask what evidence actually supports it.</p><button id="restart-lab" class="secondary" type="button">Practice again</button><a class="secondary" href="#lesson=focus">Plan your next experiment</a>` :
    `<p class="lesson-meta">Signal ${labIndex+1} of ${signals.length}</p><p class="lab-statement">${esc(signals[labIndex].text)}</p>
    <form id="lab-form"><fieldset><legend>Which drawer does it belong in?</legend><div class="lab-options">${categories.map(c=>`<label class="answer"><input type="radio" name="category" value="${c}" required><span>${c[0].toUpperCase()+c.slice(1)}</span></label>`).join("")}</div></fieldset>
    <div class="lab-actions"><button id="check-signal" class="primary" type="submit">Inspect the signal</button><button id="next-signal" class="secondary" type="button" hidden>Next signal</button></div>
    <div id="lab-feedback" class="feedback" aria-live="polite" hidden></div></form><p class="lab-readout">Opinion: a reaction or prediction. Behavior: something that happened. Commitment: a specific investment of time, effort, or money.</p>`}
    </section>`;
  if(final) {
    $("#restart-lab").addEventListener("click",()=>{labIndex=0;labCorrect=0;labChecked=false;renderLab();});
    return;
  }
  labChecked=false;
  $("#lab-form").addEventListener("submit",event=>{
    event.preventDefault();
    if(labChecked) return;
    const choice = new FormData(event.currentTarget).get("category");
    const result = evaluateSignal(signals[labIndex],choice);
    if(result.correct) labCorrect++;
    labChecked=true;
    const feedback=$("#lab-feedback");
    feedback.hidden=false; feedback.dataset.result=result.correct?"correct":"incorrect";
    feedback.innerHTML=`<p><strong>${result.correct?"Correct classification.":"This belongs in "+result.category+"."}</strong> ${esc(result.explanation)}</p><p>Next: ${esc(result.next)}</p>`;
    selectDrawer(result.category,{text:signals[labIndex].text,reading:result.explanation});
    $("#check-signal").disabled=true;
    for (const input of document.querySelectorAll('#lab-form input')) input.disabled=true;
    $("#next-signal").hidden=false;
    $("#next-signal").textContent=labIndex===signals.length-1?"Review your practice":"Next signal";
  });
  $("#next-signal").addEventListener("click",()=>{labIndex++;renderLab();$("#lab-title").focus({preventScroll:true});});
}
function download(filename,text,type="text/markdown;charset=utf-8") {
  const blob=new Blob([text],{type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function preparePrint() {
  $("#print-course").innerHTML=`<h1>Founder Fieldwork</h1><p>An original learning companion inspired by @davecto's reel. The full nine-resource list was not public; these readings are independently curated.</p><p>Fictional running case: a receipt-chasing service for independent bookkeepers. Examples and timings are exercises, not claims about a real business.</p>`+
    lessons.map(l=>`<article><h2>${esc(l.title)}</h2><p>${esc(l.author)}: <a href="${esc(l.url)}">${esc(l.resource)}</a></p><p>${esc(l.origin)}.</p><h3>The idea</h3><p>${esc(l.idea)}</p>${l.paragraphs.map(p=>`<p>${esc(p)}</p>`).join("")}<h3>Worked example</h3><p>${esc(l.case)}</p><h3>Where this breaks</h3><p>${esc(l.trap)}</p><h3>Practice</h3><p>${esc(l.task)}</p><ol>${l.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol><p>${esc(l.prompt)}</p><h3>Your field note</h3><p>${esc(state.notes[l.id]||"(No note yet.)")}</p><h3>Check your judgment</h3><p>${esc(l.quiz.question)}</p><ol>${l.quiz.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p>Answer: ${l.quiz.correct+1}. ${esc(l.quiz.explanations[l.quiz.correct])}</p></article>`).join("");
}
function renderNotebook() {
  $("#workspace-content").innerHTML=`<section aria-labelledby="notebook-title"><h3 id="notebook-title" class="notebook-title" tabindex="-1">Your field notes.</h3><p class="lab-intro">Carry one project through the course. These notes stay in this browser. Export a copy before clearing site data or moving devices. Avoid storing private customer details here.</p>
    <div class="notebook-toolbar"><button class="primary" id="export-notes" type="button">Export field notes</button><button class="secondary" id="print-guide" type="button">Print full guide</button>${storageCorrupt?'<button class="secondary" id="export-original" type="button">Export original saved data</button>':""}</div>
    ${lessons.map((l,i)=>`<section class="notebook-entry"><h4>${i+1}. ${esc(l.short)}</h4><label for="note-${l.id}">${esc(l.prompt)}</label><textarea id="note-${l.id}" data-note="${l.id}" placeholder="Your observation or next step.">${esc(state.notes[l.id]||"")}</textarea><span class="save-state" role="status">${storageAvailable&&!storageCorrupt?"Saved locally as you write":"Not saved to storage. Export before leaving."}</span><p class="source-attribution"><a href="#lesson=${l.id}">Return to lesson</a>${state.completed.includes(l.id)?" / Practice complete":""}</p></section>`).join("")}
    <div class="reset-area"><p>Reset removes this course's notes and progress from this browser. It does not touch other sites or downloaded copies.</p><button class="secondary" id="reset-request" type="button" aria-expanded="false">Reset this course</button><div id="reset-confirm" class="reset-confirm" hidden><span>Export first if you need a copy.</span><button class="secondary" id="reset-cancel" type="button">Keep my notes</button><button class="secondary" id="reset-yes" type="button">Delete my course notes</button></div></div></section>`;
  $("#export-notes").addEventListener("click",()=>{save();download("founder-fieldwork-notes.md",makeNotebook(lessons,state));announce("Field notes exported.");});
  $("#print-guide").addEventListener("click",()=>{preparePrint();window.print();});
  if(storageCorrupt) $("#export-original").addEventListener("click",()=>{
    try { const original=localStorage.getItem(storageKey);if(original===null)throw new Error("The original saved record is no longer present.");download("founder-fieldwork-original.txt",original,"text/plain;charset=utf-8"); }
    catch(error) {storageError("The original saved data could not be exported. Browser storage may be blocked. Your current notes can still be exported separately.");console.error(error);}
  });
  $("#reset-request").addEventListener("click",()=>{$("#reset-confirm").hidden=false;$("#reset-request").setAttribute("aria-expanded","true");$("#reset-cancel").focus();});
  $("#reset-cancel").addEventListener("click",()=>{$("#reset-confirm").hidden=true;$("#reset-request").setAttribute("aria-expanded","false");$("#reset-request").focus();});
  $("#reset-yes").addEventListener("click",()=>{
    clearTimeout(saveTimer);
    try {localStorage.removeItem(storageKey);}
    catch(error) {storageError("Reset failed because this browser blocked storage access. Your notes have not been cleared in this tab.");console.error(error);return;}
    const theme=state.theme;state=emptyProgress();state.theme=theme;
    storageCorrupt=false;storageAvailable=true;$("#storage-error").hidden=true;
    save();updateProgress();renderIndex();renderNotebook();$("#notebook-title").focus({preventScroll:true});announce("Course notes and progress reset.");
  });
  wireNotes();
}
function route({focus=false}={}) {
  save();
  const routeHash=location.hash.slice(1);
  if(routeHash==="sources") return;
  const oldView=currentView;
  currentView=routeHash==="lab"?"lab":routeHash==="notebook"?"notebook":"course";
  if(currentView==="course") {
    const id=routeHash.startsWith("lesson=")?routeHash.slice(7):lessons[0].id;
    currentLesson=lessons.find(l=>l.id===id)||lessons[0];
    renderLesson();
  } else if(currentView==="lab") renderLab();
  else renderNotebook();
  $("#bench-title").textContent=currentView==="course"?"The founder's field guide":currentView==="lab"?"The evidence lab":"Your working notebook";
  for(const a of document.querySelectorAll("nav a[data-view]")) {
    if(a.dataset.view===currentView)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
  }
  renderIndex();updateProgress();
  if(focus && routeHash) {
    const target=$(currentView==="course"?".lesson-title":currentView==="lab"?"#lab-title":"#notebook-title");
    $("#workbench").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
    target.focus({preventScroll:true});
  }
  if(oldView!=="lab"&&currentView==="lab") announce("Evidence lab. Classify a signal, then inspect what it does not prove.");
}
window.addEventListener("hashchange",()=>route({focus:true}));
window.addEventListener("pagehide",save);
window.addEventListener("beforeprint",preparePrint);
$("#reading-list").innerHTML=lessons.map(l=>`<li><a href="${esc(l.url)}" rel="noopener noreferrer">${esc(l.resource)}</a><span>${esc(l.author)}</span></li>`).join("");

const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)");
const parts=[...document.querySelectorAll("#cabinet-parts>[data-part]")];
const opening=Object.fromEntries(categories.map(c=>[c,0]));
let selectedDrawer="behavior",visible=false,frame=0,last=0;
function paintCabinet() {
  for(const part of parts) {
    const share=opening[part.dataset.drawer]||0;
    part.setAttribute("transform",`translate(${cabinetMotion[0]*share} ${cabinetMotion[1]*share})`);
    part.classList.toggle("selected",part.dataset.drawer===selectedDrawer);
  }
  const sorted=[...parts].sort((a,b)=>(Number(a.dataset.key)+Number(a.dataset.lift)*(opening[a.dataset.drawer]||0))-(Number(b.dataset.key)+Number(b.dataset.lift)*(opening[b.dataset.drawer]||0)));
  for(const part of sorted) $("#cabinet-parts").append(part);
}
function tick(now) {
  const dt=last?Math.min((now-last)/1000,1/30):1/60;last=now;
  let moving=false;
  for(const c of categories) {
    const target=c===selectedDrawer?1:0;
    opening[c]=reduceMotion.matches?target:opening[c]+(target-opening[c])*(1-Math.exp(-dt/.16));
    if(Math.abs(target-opening[c])<.001)opening[c]=target;else moving=true;
  }
  paintCabinet();
  frame=visible&&moving?requestAnimationFrame(tick):0;
}
function wakeCabinet() {
  if(reduceMotion.matches) {
    for(const c of categories)opening[c]=c===selectedDrawer?1:0;
    paintCabinet();return;
  }
  if(visible&&!frame){last=0;frame=requestAnimationFrame(tick);}
}
function selectDrawer(category,preview=previews.find(p=>p.category===category)) {
  if(!categories.includes(category))throw new RangeError("Unknown cabinet drawer.");
  selectedDrawer=category;
  for(const button of document.querySelectorAll("[data-signal]")) {
    button.setAttribute("aria-pressed",String(previews[Number(button.dataset.signal)].category===category));
  }
  $("#signal-example").textContent=preview.text;
  $("#signal-reading").textContent=preview.reading;
  wakeCabinet();
}
const previews=[
  {category:"opinion",text:signals[0].text,reading:"An encouraging reaction. The problem and willingness to pay are still untested."},
  {category:"behavior",text:signals[1].text,reading:"A visible workaround. Useful evidence, not proof of demand."},
  {category:"commitment",text:signals[2].text,reading:"A specific investment in this offer. Repeat value and delivery economics remain open."}
];
for(const button of document.querySelectorAll("[data-signal]")) button.addEventListener("click",()=>{
  const preview=previews[Number(button.dataset.signal)];
  selectDrawer(preview.category,preview);
});
new IntersectionObserver(entries=>{
  visible=entries[entries.length-1].isIntersecting;
  if(!visible&&frame){cancelAnimationFrame(frame);frame=0;}else if(visible)wakeCabinet();
},{rootMargin:"120px 0px"}).observe($(".cabinet-stage"));
reduceMotion.addEventListener("change",wakeCabinet);
route();
if(location.hash.startsWith("#lesson=")||location.hash==="#lab"||location.hash==="#notebook") {
  requestAnimationFrame(()=>$("#workbench").scrollIntoView({behavior:"instant",block:"start"}));
}
