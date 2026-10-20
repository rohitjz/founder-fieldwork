async(hostPage)=>{
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const context=await hostPage.context().browser().newContext({viewport:{width:1440,height:900},reducedMotion:"reduce"});
  const page=await context.newPage(),origin="http://127.0.0.1:8768",base=origin+"/business-levers/";
  const errors=[],external=[],passed=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("request",r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith("data:"))external.push(r.url());});
  await context.addInitScript(()=>{
    if(localStorage.getItem("founder-fieldwork-v1")===null)localStorage.setItem("founder-fieldwork-v1",JSON.stringify({version:1,notes:{problem:"Keep my original founder note."},passed:["problem"],completed:["problem"],theme:"light"}));
  });
  try {
    await page.goto(base);
    assert(await page.locator(".lesson-menu a").count()===6,"The companion must have its own six lessons.");
    assert((await page.locator("#start-course").textContent())==="Start lesson 1","The original course's progress must not leak into the new one.");
    await page.locator("#start-course").click();await page.locator('[data-lesson="claim"]').waitFor();
    for(const [id,answer] of [["claim",1],["buyer",0],["funnel",2],["economics",0],["repeat",2],["ai-test",1]]) {
      await page.goto(base+`#lesson=${id}`);
      await page.locator(`[data-lesson="${id}"] .lesson-idea`).waitFor();
      assert(await page.locator("#lesson-note").count()===0,"Learn must remain separate from Apply.");
      await page.getByRole("link",{name:"Check your understanding",exact:true}).click();await page.locator("#recall-note").waitFor();
      await page.locator("#recall-note").fill(`I can explain ${id} with the example.`);
      assert(await page.locator('#answer-choices').getAttribute("open")===null,"Recall must precede choices.");
      await page.locator("#answer-choices>summary").click();
      await page.locator(`input[name="answer"][value="${answer}"]`).check();await page.locator("#check-answer").click();
      assert(await page.locator("#quiz-feedback").getAttribute("data-result")==="correct",`${id} answer mismatch.`);
      await page.getByRole("link",{name:"Apply it to your project",exact:true}).click();await page.locator("#lesson-note").waitFor();
      assert(await page.locator("#finish-lesson").isDisabled(),"An empty note must not complete practice.");
      await page.locator("#lesson-note").fill(`My ${id} action: inspect a real input before changing the business.`);
      await page.locator("#finish-lesson").click();await page.locator("#done-title").waitFor();
    }
    passed.push("Six complete Learn/Check/Apply lessons with recall, explained checks, and original project notes");
    await page.goto(base+"#lesson=economics");await page.locator(".economics-explorer").waitFor();
    await page.locator(".economics-explorer>summary").click();
    const resultValue=()=>page.locator(".calculation-rows>div").last().locator("dd").textContent();
    assert(await resultValue()==="$100.00","Initial example must reconcile.");
    await page.locator("#econ-rate").fill("3");
    assert(await page.locator("#economics-results").isHidden(),"An edited assumption must not leave stale results visible.");
    await page.getByRole("button",{name:"Calculate this example",exact:true}).click();
    assert(await resultValue()==="$450.00","Changing order rate must update the exact arithmetic.");
    await page.locator("#econ-variable").fill("60");await page.getByRole("button",{name:"Calculate this example",exact:true}).click();
    assert((await page.locator(".break-even").textContent()).includes("No positive"),"Negative contribution must not show fake break-even volume.");
    await page.locator("#econ-visits").fill("0");await page.getByRole("button",{name:"Calculate this example",exact:true}).click();
    assert(await resultValue()==="-$600.00","Zero orders still incur the period costs.");
    await page.locator("#econ-rate").fill("101");await page.getByRole("button",{name:"Calculate this example",exact:true}).click();
    assert(await page.locator("#economics-results").isHidden(),"Invalid input must not retain a success-shaped result.");
    assert(!(await page.locator("#econ-rate").evaluate(e=>e.validity.valid)),"Out-of-range rate must be invalid.");
    await page.locator("#reset-example").click();assert(await resultValue()==="$100.00","Restore must reset inputs and results together.");
    await page.locator("#econ-visits").fill("1");await page.locator("#econ-rate").fill("0.1");
    await page.getByRole("button",{name:"Calculate this example",exact:true}).click();
    assert(await page.locator(".calculation-rows>div").first().locator("dd").textContent()==="0.001","Fractional modeled orders must not be displayed as zero.");
    await page.locator("#reset-example").click();
    passed.push("Calculator reconciliation, stale-result handling, negative contribution, zero orders, invalid input, and reset");
    await page.goto(base+"#notebook");await page.locator("#notebook-title").waitFor();
    assert(await page.locator(".notebook-entry").count()===6,"Notebook must match this guide.");
    const exported=page.waitForEvent("download");await page.locator("#export-notes").click();
    assert((await exported).suggestedFilename()==="business-levers-notes.md","Export must identify this guide.");
    await page.evaluate(()=>window.dispatchEvent(new Event("beforeprint")));await page.emulateMedia({media:"print"});
    assert(await page.locator("#print-course article").count()===6,"Print must include all six lessons.");
    assert((await page.locator("#print-course").textContent()).includes("@thelazyceo"),"Print provenance must match this reel.");
    await page.emulateMedia({media:"screen"});
    await page.goto(base+"#sources");await page.locator(".source-boundary").waitFor();
    assert((await page.locator(".source-boundary").textContent()).includes("did not obtain"),"Unavailable guide boundary must be explicit.");
    assert(await page.locator('a[href="#lab"]').count()===0,"This guide must not expose the unrelated evidence cabinet.");
    await page.goto(base+"#lab");assert((await page.locator("#view-content h1").textContent()).includes("not found"),"An absent lab must not look like a working empty practice.");
    for(const width of [320,390,1440]) {
      await page.setViewportSize({width,height:844});
      await page.goto(base+"#lesson=claim");await page.locator(".lesson-idea").waitFor();
      const y=await page.locator(".lesson-idea").evaluate(e=>e.getBoundingClientRect().top);
      assert(y<=480,`First idea should remain in the first lesson viewport at ${width}px.`);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No page overflow at ${width}px.`);
    }
    await page.goto(origin+"/#lesson=problem&step=apply");await page.locator("#lesson-note").waitFor();
    assert(await page.locator("#lesson-note").inputValue()==="Keep my original founder note.","The old course must retain its notes.");
    await page.goto(base+"#notebook");await page.locator("#notebook-title").waitFor();
    await page.locator(".storage-tools>summary").click();await page.locator("#reset-request").click();await page.locator("#reset-yes").click();
    const original=await page.evaluate(()=>JSON.parse(localStorage.getItem("founder-fieldwork-v1")));
    assert(original.notes.problem==="Keep my original founder note.","New guide reset must not touch original storage.");
    const guide=await page.evaluate(()=>JSON.parse(localStorage.getItem("business-levers-v1")));
    assert(guide.completed.length===0,"New guide reset must clear only its own progress.");
    passed.push("Per-guide export/print/provenance, responsive simplicity, separate progress, and isolated reset");
    assert(errors.length===0,errors.join("; "));assert(external.length===0,external.join("; "));
    return {result:"Business Levers browser checks passed.",passed,runtimeErrors:errors,externalRequests:external};
  } finally {await context.close();}
}
