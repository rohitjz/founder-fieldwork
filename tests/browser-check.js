async(hostPage)=>{
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};
  const browser=hostPage.context().browser(),context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:"reduce"});
  const page=await context.newPage(),base="http://127.0.0.1:8768",key="founder-fieldwork-v1",errors=[],passed=[],measurements=[];
  page.on("pageerror",error=>errors.push(error.message));
  const cases=[["problem",1],["interviews",2],["learning",0],["mvp",1],["manual",2],["launch",0],["pricing",1],["retention",2],["focus",0]];
  try {
    await page.goto(base+"/");
    assert(await page.locator(".lesson-menu a").count()===9,"Course outline must expose all nine lessons.");
    assert(await page.locator("#start-course").isVisible(),"One start action must be obvious.");
    assert(await page.locator("#view-content .primary").count()===1,"Course must have one dominant action.");
    assert(await page.locator("#lab-section").isHidden(),"The cabinet belongs in optional practice.");
    for(const [width,height] of [[1440,900],[390,844]]) {
      await page.setViewportSize({width,height});await page.goto(base+"/#course");
      const start=await page.locator("#start-course").boundingBox();
      assert(start.y+start.height<=height,`Start action must fit in the first ${width}px viewport.`);
      await page.locator("#start-course").click();await page.locator('[data-phase="learn"]').waitFor();
      const result=await page.evaluate(()=>({
        firstIdeaY:Math.round(document.querySelector(".lesson-idea").getBoundingClientRect().top),
        headerHeight:Math.round(document.querySelector(".topbar").getBoundingClientRect().height),
        readerDisplay:getComputedStyle(document.querySelector(".reader")).display,
        overflow:document.documentElement.scrollWidth>innerWidth
      }));
      assert(result.firstIdeaY<=480,`The idea starts too late at ${width}px: ${result.firstIdeaY}.`);
      assert(result.headerHeight<=72,"Mobile chrome must remain compact.");
      assert(result.readerDisplay==="block","The lesson must have one reading lane.");
      assert(!result.overflow,"Reader must not overflow.");
      assert(await page.locator("#view-content textarea").count()===0,"Learn must not display a project editor.");
      assert(await page.locator("#lesson-quiz").count()===0,"Learn must not expose the quiz.");
      assert(await page.locator(".course-index,.fieldcard,.visual-route,.hero").count()===0,"Competing navigation and marketing panels must be absent.");
      measurements.push({width,...result});
    }
    passed.push("Measured first-viewport entry, compact header, one reading lane, and phase separation");
    await page.setViewportSize({width:1440,height:900});
    for(const [id,answer] of cases) {
      await page.goto(base+`/#lesson=${id}`);
      await page.locator(`[data-lesson="${id}"] [data-phase="learn"]`).waitFor();
      assert(await page.locator(".lesson-phase").count()===1,"Exactly one phase must be rendered.");
      assert(await page.locator("#view-content .primary").count()===1,"Learn needs one forward action.");
      await page.getByRole("link",{name:"Check your understanding",exact:true}).click();
      await page.locator('[data-phase="check"]').waitFor();
      assert(await page.locator("#answer-choices").getAttribute("open")===null,"Recognition choices must start collapsed.");
      assert(await page.locator('input[name="answer"]').first().isHidden(),"Recall must come before visible answer choices.");
      await page.locator("#recall-note").fill(`My explanation of ${id}: use observable evidence and name what remains uncertain.`);
      await page.locator("#answer-choices>summary").click();
      if(id==="problem") {
        await page.locator('input[name="answer"][value="0"]').check();await page.locator("#check-answer").click();
        assert(await page.locator("#quiz-feedback").getAttribute("data-result")==="incorrect","Wrong answers need explanation.");
        assert(await page.locator("#check-next").isHidden(),"An incorrect answer must not reveal the forward completion path.");
      }
      await page.locator(`input[name="answer"][value="${answer}"]`).check();await page.locator("#check-answer").click();
      assert(await page.locator("#quiz-feedback").getAttribute("data-result")==="correct",`${id}: correct answer must pass.`);
      await page.getByRole("link",{name:"Apply it to your project",exact:true}).click();
      await page.locator(`textarea[data-note="${id}"]`).waitFor();
      assert(await page.locator(".lesson-idea").count()===0,"Apply must not repeat the explanation.");
      assert(await page.locator("#finish-lesson").isDisabled(),"An empty project note cannot complete a lesson.");
      assert(await page.locator(".visual-note-action").count()===0,"No tool may write the learner's application for them.");
      await page.locator("#lesson-note").fill(`For my project, I will test the ${id} decision with a real example. <b>Keep as text.</b>`);
      await page.locator("#finish-lesson").click();await page.locator("#done-title").waitFor();
      assert(await page.locator(".saved-decision b").count()===0,"Application notes must be escaped.");
    }
    await page.goto(base+"/#course");await page.locator("#course-title").waitFor();
    assert((await page.locator(".course-progress").textContent()).includes("9 of 9"),"Every completed practice must be recorded.");
    await page.reload();assert((await page.locator(".course-progress").textContent()).includes("9 of 9"),"Progress must survive reload.");
    passed.push("All nine Learn/Check/Apply flows, recall persistence, explained answers, and completion");
    await page.goto(base+"/#lesson=problem&step=apply");await page.locator("#lesson-note").waitFor();
    await page.locator("#lesson-note").fill("");assert(await page.locator("#finish-lesson").isDisabled(),"Clearing an application must remove completion.");
    await page.locator("#lesson-note").fill("My revised problem statement.");await page.locator("#finish-lesson").click();await page.locator("#done-title").waitFor();
    await page.getByRole("link",{name:"Notebook",exact:true}).click();await page.locator("#notebook-title").waitFor();
    assert(await page.locator(".notebook-entry").count()===9,"All original notes remain reachable.");
    assert(await page.locator(".notebook-entry[open]").count()===0,"Notebook must not open nine editors at once.");
    await page.locator(".notebook-entry").first().locator("summary").first().click();
    assert(await page.locator("#note-problem").isVisible(),"Notes must remain editable.");
    await page.locator(".notebook-entry").nth(1).locator("summary").first().click();
    await page.waitForFunction(()=>document.querySelectorAll(".notebook-entry[open]").length===1);
    const exportPromise=page.waitForEvent("download");await page.locator("#export-notes").click();
    assert((await exportPromise).suggestedFilename()==="founder-fieldwork-notes.md","Markdown export must still work.");
    await page.evaluate(()=>window.dispatchEvent(new Event("beforeprint")));await page.emulateMedia({media:"print"});
    assert(await page.locator("#print-course").isVisible(),"Full-course print must remain available.");
    assert(await page.locator("#print-course article").count()===9,"Print must contain the complete course, not one phase.");
    await page.emulateMedia({media:"screen"});
    passed.push("Application consistency, collapsed notebook, escaped notes, export, and complete-course print");
    await page.goto(base+"/#lab");await page.locator("#lab-title").waitFor();
    const expected=["opinion","behavior","commitment","opinion","behavior","commitment"];
    for(let i=0;i<expected.length;i++) {
      await page.locator(`input[name="category"][value="${i===0?"commitment":expected[i]}"]`).check();
      await page.locator("#check-signal").click();
      assert(await page.locator("#check-signal").isHidden(),"A repeated click must not inflate the practice score.");
      assert(await page.locator(".selected[data-drawer]").first().getAttribute("data-drawer")===expected[i],"Cabinet must show the actual classification.");
      await page.locator("#next-signal").click();
    }
    assert((await page.locator(".lab-statement").textContent()).includes("5 of 6"),"Evidence practice must score first responses accurately.");
    await page.goto(base+"/#sources");await page.locator(".reading-list").waitFor();
    assert(await page.locator(".reading-list li").count()===9,"Every source must remain accessible.");
    assert((await page.locator(".source-boundary").textContent()).includes("not a reconstruction"),"Source boundary must stay explicit.");
    await page.goto(base+"/#lesson=problem&step=learn");await page.locator('[data-phase="learn"]').waitFor();
    await page.locator('.phase-nav a[href="#lesson=problem&step=check"]').click();await page.locator('[data-phase="check"]').waitFor();
    await page.goBack();await page.locator('[data-phase="learn"]').waitFor();
    await page.goto(base+"/#lesson=unknown");assert((await page.locator("#view-content h1").textContent()).includes("not found"),"Bad links must be explicit.");
    await page.goto(base+"/#lesson=problem");await page.locator('[data-phase="learn"]').waitFor();
    await page.getByRole("button",{name:"Switch to light theme",exact:true}).click();await page.reload();
    assert(await page.locator("html").getAttribute("data-theme")==="light","Theme must persist.");
    for(const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:844});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No page overflow at ${width}px.`);
      for(const control of await page.locator(".topbar a,.topbar button").all()) {
        const box=await control.boundingBox();
        assert(box.width>=44&&box.height>=44,`Header controls need 44x44px targets at ${width}px.`);
      }
    }
    await page.locator(".skip-link").focus();await page.keyboard.press("Enter");
    assert(await page.locator('[data-phase="learn"]').count()===1,"Skip link must not invoke a not-found route.");
    passed.push("Optional practice, source provenance, browser history, direct links, theme, responsive fit, and skip navigation");
    assert(errors.length===0,errors.join("; "));
    return {result:"Guided reader browser checks passed.",passed,measurements,uncaughtErrors:errors};
  } finally {await context.close();}
}
