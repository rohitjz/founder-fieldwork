async (hostPage) => {
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};
  const context=await hostPage.context().browser().newContext({viewport:{width:1440,height:900},reducedMotion:"reduce"});
  const page=await context.newPage();
  const errors=[],externalRequests=[],passed=[];
  const base="http://127.0.0.1:8768";
  page.on("pageerror",error=>errors.push(error.message));
  page.on("request",request=>{if(!request.url().startsWith(base)&&!request.url().startsWith("data:"))externalRequests.push(request.url());});
  await context.addInitScript(()=>{
    if(localStorage.getItem("founder-fieldwork-v1")===null)localStorage.setItem("founder-fieldwork-v1",JSON.stringify({
      version:1,notes:{problem:"My existing project note. <b>Keep this as text.</b>"},passed:[],completed:[],theme:"dark"
    }));
  });
  try {
    await page.goto(base+"/");
    await page.locator(".openui-canvas").waitFor();
    assert(await page.locator(".route-station").count()===3,"The OpenUI course route must render.");
    assert((await page.locator("#lesson-note").inputValue()).includes("My existing project note."),"Legacy notes must remain readable.");
    const cases=[
      ["problem",2],["interviews",0],["learning",1],["mvp",1],["manual",2],
      ["launch",1],["pricing",0],["retention",0],["focus",1]
    ];
    for(const [id,index] of cases) {
      await page.locator(`.lesson-link[href="#lesson=${id}"]`).click();
      const visual=page.locator(`[data-lesson-visual="${id}"]`);
      await visual.locator(".openui-canvas").waitFor();
      await page.waitForFunction(id=>document.querySelector(`[data-lesson-visual="${id}"]`)?.dataset.visualState==="ready",id);
      assert(await page.locator("#visual-warning").isHidden(),`${id}: No renderer warning.`);
      await visual.locator(".visual-segments button").nth(index).click();
      assert(await visual.locator(".visual-segments button").nth(index).getAttribute("aria-pressed")==="true",`${id}: The selected lens must change.`);
      if(id==="mvp")assert((await visual.locator(".scope-drawing").getAttribute("class")).includes("expanded"),"Scope toggle must reveal the extra features.");
      if(id==="pricing")assert((await visual.locator(".offer-document>strong").textContent())==="AI tokens","Pricing visual must change the billing unit.");
      if(id==="retention")assert(!(await visual.locator(".return-drawing").getAttribute("class")).includes("cadence"),"Return visual must change the measured cadence.");
      const note=page.locator(`textarea[data-note="${id}"]`);
      const original=await note.inputValue();
      await visual.locator(".visual-note-action").click();
      const updated=await note.inputValue();
      assert(updated.length>original.length,`${id}: OpenUI action must append a prompt.`);
      assert(updated.startsWith(original),`${id}: Existing notes must not be replaced.`);
      assert(await page.locator(".notebook-entry b").count()===0,"User text must not become HTML.");
    }
    passed.push("All nine real OpenUI renders, interactive lenses, and append-only note actions");
    await page.reload();
    assert((await page.locator("#lesson-note").inputValue()).includes("By ____"),"Visual note actions must persist through the existing storage path.");
    await page.locator('.route-station[href="#lesson=mvp"]').click();
    await page.locator('[data-lesson-visual="mvp"] .openui-canvas').waitFor();
    assert(await page.locator('.route-station[aria-current="step"]').getAttribute("href")==="#lesson=mvp","The route must follow the selected lesson.");
    passed.push("Original storage compatibility, note persistence, and section navigation");
    for(const theme of ["light","dark"]) {
      const actual=await page.locator("html").getAttribute("data-theme");
      if(actual!==theme)await page.locator("#theme-toggle").click();
      const token=await page.locator(".openui-canvas").evaluate(e=>getComputedStyle(e).getPropertyValue("--cp-accent").trim());
      assert(token===(theme==="dark"?"#ffd84d":"#ca8a04"),`OpenUI must inherit the ${theme} brand palette.`);
    }
    const first=page.locator(".visual-segments button").first();
    await first.focus();await page.keyboard.press("Space");
    assert(await first.getAttribute("aria-pressed")==="true","Visual controls must work from the keyboard.");
    assert(await first.evaluate(e=>getComputedStyle(e).outlineWidth)!=="0px","Visual controls need a visible keyboard focus ring.");
    passed.push("Shared light/dark tokens and native keyboard interaction");
    await page.setViewportSize({width:390,height:844});
    await page.locator("#mobile-lesson").selectOption("interviews");
    await page.locator('[data-lesson-visual="interviews"] .openui-canvas').waitFor();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"OpenUI must not introduce mobile overflow.");
    for(const button of await page.locator(".visual-segments button,.visual-note-action").all()) {
      const box=await button.boundingBox();
      assert(box.height>=44,"Mobile illustration controls need at least 44px height.");
    }
    await context.setOffline(true);
    await page.locator("#mobile-lesson").selectOption("pricing");
    await page.locator('[data-lesson-visual="pricing"] .openui-canvas').waitFor();
    await page.locator(".visual-segments button").first().click();
    assert(await page.locator(".offer-document>strong").textContent()==="AI tokens","Visual interactions must not need a network call.");
    passed.push("Mobile fit, touch targets, and network-free rendering");
    assert(externalRequests.length===0,`No external runtime requests: ${externalRequests.join("; ")}`);
    assert(errors.length===0,`No uncaught errors: ${errors.join("; ")}`);
    return {result:"OpenUI browser checks passed.",passed,uncaughtErrors:errors,externalRequests};
  } finally {
    await context.close();
  }
}
