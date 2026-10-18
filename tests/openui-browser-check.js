async(hostPage)=>{
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};
  const context=await hostPage.context().browser().newContext({viewport:{width:1440,height:900},reducedMotion:"reduce"});
  const page=await context.newPage(),base="http://127.0.0.1:8768",requests=[],errors=[];
  page.on("request",r=>{if(!r.url().startsWith(base)&&!r.url().startsWith("data:"))requests.push(r.url());});
  page.on("pageerror",e=>errors.push(e.message));
  try {
    for(const id of ["problem","learning","manual","launch","pricing","retention","focus"]) {
      await page.goto(base+`/#lesson=${id}`);await page.locator(`[data-lesson="${id}"]`).waitFor();
      assert(await page.locator("[data-openui-rendered]").count()===0,`${id} must not have a redundant interactive model.`);
    }
    await page.goto(base+"/#lesson=interviews");await page.locator(".learning-visual").waitFor();
    await page.getByRole("button",{name:"Ask for an opinion",exact:true}).click();
    assert((await page.locator(".question-example p").textContent()).includes("Would you use"),"Question comparison must change the example.");
    await page.getByRole("button",{name:"Ask about behavior",exact:true}).click();
    assert((await page.locator(".question-example p").textContent()).includes("last monthly close"),"Behavior view must reveal the past-event question.");
    assert(await page.locator(".visual-note-action").count()===0,"A diagram must not prefill project notes.");
    await page.goto(base+"/#lesson=mvp");await page.locator(".learning-visual").waitFor();
    await page.getByRole("button",{name:"A larger backlog",exact:true}).click();
    assert(await page.locator(".scope-drawing.expanded").count()===1,"Scope comparison must reveal additional work.");
    await page.setViewportSize({width:390,height:844});
    assert(await page.locator(".scope-key").isVisible(),"Mobile must have readable labels outside the scaled diagram.");
    for(const theme of ["light","dark"]) {
      if(await page.locator("html").getAttribute("data-theme")!==theme)await page.locator("#theme-toggle").click();
      assert(await page.locator("#visual-warning").isHidden(),"The visual must work in both themes.");
    }
    const button=page.getByRole("button",{name:"A complete small pilot",exact:true});
    await button.focus();await page.keyboard.press("Space");
    assert(await button.getAttribute("aria-pressed")==="true","Diagram controls must be keyboard accessible.");
    assert((await button.boundingBox()).height>=44,"Touch targets must be at least 44px high.");
    await context.setOffline(true);
    await page.getByRole("button",{name:"A larger backlog",exact:true}).click();
    assert(await page.locator(".scope-drawing.expanded").count()===1,"The example must work without a network call.");
    assert(requests.length===0,`Unexpected external requests: ${requests.join("; ")}`);
    assert(errors.length===0,errors.join("; "));
    return {result:"Purposeful OpenUI checks passed.",interactiveLessons:["interviews","mvp"],unnecessaryModels:0,notePrefillActions:0,externalRequests:requests,runtimeErrors:errors};
  } finally {await context.close();}
}
