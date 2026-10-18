async (hostPage) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const browser = hostPage.context().browser();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const base = "http://127.0.0.1:8768";
  const cases = [
    ["problem",1],["interviews",2],["learning",0],["mvp",1],["manual",2],
    ["launch",0],["pricing",1],["retention",2],["focus",0]
  ];
  const storageKey = "founder-fieldwork-v1";
  const passed = [];
  let stage = "initial checks";
  try {
    await page.goto(base+"/");
    assert(await page.locator(".lesson-link").count()===9,"Nine lessons must render.");
    assert(await page.locator("#reading-list li").count()===9,"Nine primary readings must render.");
    assert(await page.locator("#complete-lesson").isDisabled(),"Completion must require practice.");
    await page.locator('input[name="answer"][value="0"]').check();
    await page.getByRole("button",{name:"Check answer",exact:true}).click();
    assert(await page.locator("#quiz-feedback").getAttribute("data-result")==="incorrect","Wrong answer needs explanatory feedback.");
    assert(await page.locator("#complete-lesson").isDisabled(),"Wrong answer must not complete a lesson.");
    passed.push("Wrong-answer feedback and completion gate");
    for (const [id,answer] of cases) {
      stage = `completing ${id}`;
      await page.locator(`.lesson-link[href="#lesson=${id}"]`).click();
      await page.locator(`textarea[data-note="${id}"]`).fill(`I will inspect an actual ${id} assumption. <img src=x onerror=alert(1)>`);
      await page.locator(`input[name="answer"][value="${answer}"]`).check();
      await page.getByRole("button",{name:"Check answer",exact:true}).click();
      assert(await page.locator("#quiz-feedback").getAttribute("data-result")==="correct",`${id}: Correct response must be recognized.`);
      await page.getByRole("button",{name:"Mark practice complete",exact:true}).click();
    }
    assert((await page.locator("#progress-text").textContent()).startsWith("9 of 9"),"All nine practices must be recorded.");
    await page.reload();
    assert((await page.locator("#progress-text").textContent()).startsWith("9 of 9"),"Progress must survive reload.");
    passed.push("All nine lessons, answers, notes, completion, and reload persistence");
    stage = "clearing and restoring the first note";
    await page.locator('.lesson-link[href="#lesson=problem"]').click();
    await page.locator('textarea[data-note="problem"]').fill("");
    assert((await page.locator("#progress-text").textContent()).startsWith("8 of 9"),"Removing a note must remove its completion.");
    await page.locator('textarea[data-note="problem"]').fill("An actual problem statement.");
    await page.getByRole("button",{name:"Mark practice complete",exact:true}).click();
    passed.push("Completion stays consistent with the note");
    stage = "export and print";
    await page.getByRole("link",{name:/Field notes/}).click();
    await page.locator("#notebook-title").waitFor({state:"visible"});
    assert(await page.locator(".notebook-entry").count()===9,"Notebook needs all nine entries.");
    assert(await page.locator(".notebook-entry img").count()===0,"Notes must stay text, not HTML.");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button",{name:"Export field notes",exact:true}).click();
    const download = await downloadPromise;
    assert(download.suggestedFilename()==="founder-fieldwork-notes.md","Export must have the requested Markdown filename.");
    await page.evaluate(()=>window.dispatchEvent(new Event("beforeprint")));
    await page.emulateMedia({media:"print"});
    assert(await page.locator("#print-course").isVisible(),"Full guide must be printable.");
    assert(await page.locator("#print-course article").count()===9,"Print must include every lesson, not just the active one.");
    await page.emulateMedia({media:"screen"});
    passed.push("Escaped notes, Markdown download, and full-course print");
    stage = "evidence lab";
    await page.getByRole("link",{name:"Evidence lab",exact:true}).click();
    await page.locator("#lab-title").waitFor({state:"visible"});
    const expected=["opinion","behavior","commitment","opinion","behavior","commitment"];
    for(let i=0;i<expected.length;i++) {
      const answer=i===0?"commitment":expected[i];
      await page.locator(`input[name="category"][value="${answer}"]`).check();
      await page.getByRole("button",{name:"Inspect the signal",exact:true}).click();
      const feedback=await page.locator("#lab-feedback").textContent();
      assert(feedback.length>70,"Evidence check must explain limits.");
      assert(await page.locator("#check-signal").isDisabled(),"Repeated submits must not inflate the exercise score.");
      assert(await page.locator(`.figure-controls button[aria-pressed="true"]`).textContent()===expected[i][0].toUpperCase()+expected[i].slice(1),"Cabinet controls must agree with the classification.");
      await page.locator("#next-signal").click();
    }
    assert((await page.locator(".lab-statement").textContent()).includes("5 of 6"),"Lab must count the first response accurately.");
    passed.push("Evidence lab classification, honest scoring, and shared cabinet state");
    stage = "theme and responsive behavior";
    await page.getByRole("button",{name:"Switch to light theme"}).click();
    await page.reload();
    assert(await page.locator("html").getAttribute("data-theme")==="light","Theme must persist.");
    await page.goto(base+"/#lesson=mvp");
    assert((await page.locator(".lesson-title").textContent()).includes("smallest"),"Direct lesson links must work.");
    for(const width of [390,768,1440]) {
      await page.setViewportSize({width,height:844});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No page overflow at ${width}px.`);
      if(width===390) {
        await page.locator("#mobile-lesson").selectOption("interviews");
        await page.locator('textarea[data-note="interviews"]').waitFor();
        assert((await page.locator(".lesson-title").textContent()).includes("story"),"Mobile lesson selector must navigate.");
      }
    }
    passed.push("Theme persistence, deep links, reduced motion, and responsive widths");
    stage = "corrupt-data recovery";
    await page.addInitScript(key=>localStorage.setItem(key,"{"),storageKey);
    await page.reload();
    assert(await page.locator("#storage-error").isVisible(),"Corrupt notes must produce an explicit warning.");
    assert(await page.evaluate(key=>localStorage.getItem(key),storageKey)==="{","Unreadable original data must not be overwritten.");
    await page.getByRole("link",{name:/Field notes/}).click();
    await page.locator("#notebook-title").waitFor({state:"visible"});
    const originalPromise=page.waitForEvent("download");
    await page.getByRole("button",{name:"Export original saved data",exact:true}).click();
    assert((await originalPromise).suggestedFilename()==="founder-fieldwork-original.txt","Recovery export must remain available.");
    await page.getByRole("button",{name:"Reset this course",exact:true}).click();
    await page.getByRole("button",{name:"Keep my notes",exact:true}).click();
    assert(await page.evaluate(key=>localStorage.getItem(key),storageKey)==="{","Cancel reset must preserve notes.");
    await page.getByRole("button",{name:"Reset this course",exact:true}).click();
    await page.getByRole("button",{name:"Delete my course notes",exact:true}).click();
    assert(await page.locator("#storage-error").isHidden(),"Explicit reset must restore usable storage.");
    assert((await page.locator("#progress-text").textContent()).startsWith("0 of 9"),"Reset must clear course progress.");
    passed.push("Corrupt-data preservation, recovery export, and confirmed scoped reset");
    stage = "blocked browser storage";
    const blockedContext=await browser.newContext({reducedMotion:"reduce"});
    await blockedContext.addInitScript(key=>{
      const original=Storage.prototype.getItem;
      Storage.prototype.getItem=function(k) {
        if(k===key) throw new DOMException("Storage blocked for test.","SecurityError");
        return original.call(this,k);
      };
    },storageKey);
    const blockedPage=await blockedContext.newPage();
    try {
      await blockedPage.goto(base+"/#lesson=problem");
      assert((await blockedPage.locator("#storage-error").textContent()).includes("unavailable"),"Blocked storage must be explicit.");
      await blockedPage.locator('textarea[data-note="problem"]').fill("Keep a usable note even without storage.");
      await blockedPage.getByRole("link",{name:/Field notes/}).click();
      await blockedPage.locator("#notebook-title").waitFor({state:"visible"});
      assert((await blockedPage.locator("#note-problem").inputValue()).includes("without storage"),"Blocked storage must not prevent in-tab notes.");
      const blockedExport=blockedPage.waitForEvent("download");
      await blockedPage.getByRole("button",{name:"Export field notes",exact:true}).click();
      assert((await blockedExport).suggestedFilename()==="founder-fieldwork-notes.md","Export must remain usable without storage.");
    } finally {
      await blockedContext.close();
    }
    passed.push("Blocked-storage warning, in-tab editing, and working export");
    assert(errors.length===0,`No uncaught runtime errors: ${errors.join("; ")}`);
    return { passed, uncaughtErrors: errors, result: "All browser regression checks passed." };
  } catch (error) {
    const detail = await page.evaluate(()=>({url:location.href,progress:document.querySelector("#progress-text")?.textContent,completeButton:document.querySelector("#complete-lesson")?.textContent,warning:document.querySelector("#storage-error")?.textContent}));
    throw new Error(`${stage}: ${error.message}. State: ${JSON.stringify(detail)}. Passed: ${passed.join("; ")}`);
  } finally {
    await context.close();
  }
}
