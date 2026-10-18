async(hostPage)=>{
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};
  const browser=hostPage.context().browser(),base="http://127.0.0.1:8768",key="founder-fieldwork-v1",passed=[];
  const legacy=await browser.newContext({reducedMotion:"reduce"});
  try {
    await legacy.addInitScript(()=>{
      if(localStorage.getItem("founder-fieldwork-v1")===null)localStorage.setItem("founder-fieldwork-v1",JSON.stringify({version:1,notes:{problem:"My original project decision."},passed:["problem"],completed:["problem"],theme:"light"}));
    });
    const page=await legacy.newPage();await page.goto(base+"/#course");
    assert((await page.locator(".course-progress").textContent()).includes("1 of 9"),"Legacy completion must remain intact.");
    assert((await page.locator("#start-course").getAttribute("href"))==="#lesson=interviews","Continue should choose the next unfinished lesson.");
    await page.goto(base+"/#lesson=problem&step=apply");await page.locator("#lesson-note").waitFor();
    assert(await page.locator("#lesson-note").inputValue()==="My original project decision.","The original note must be preserved.");
    assert(await page.locator("html").getAttribute("data-theme")==="light","Existing theme must be preserved.");
    await page.locator('.phase-nav a[href="#lesson=problem&step=check"]').click();await page.locator("#recall-note").waitFor();
    await page.locator("#recall-note").fill("My new recall note.");
    await page.reload();
    assert(await page.locator("#recall-note").inputValue()==="My new recall note.","Recall should use the existing storage path.");
    const record=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
    assert(record.version===1&&record.completed.includes("problem")&&record.notes.problem==="My original project decision.","Adding recall must not invalidate prior progress.");
    passed.push("Version-one project notes, completion, theme, and recall compatibility");
  } finally {await legacy.close();}
  const corrupt=await browser.newContext({reducedMotion:"reduce"});
  try {
    await corrupt.addInitScript(()=>{
      if(localStorage.getItem("founder-fieldwork-v1")===null)localStorage.setItem("founder-fieldwork-v1","{");
      localStorage.setItem("unrelated-notebook","keep");
    });
    const page=await corrupt.newPage();await page.goto(base+"/#notebook");
    assert(await page.locator("#storage-error").isVisible(),"Unreadable data must be explicit.");
    assert(await page.evaluate(key=>localStorage.getItem(key),key)==="{","Unreadable data must not be overwritten.");
    const original=page.waitForEvent("download");await page.locator("#export-original").click();
    assert((await original).suggestedFilename()==="founder-fieldwork-original.txt","Recovery export must remain available.");
    await page.locator("#reset-request").click();await page.locator("#reset-cancel").click();
    assert(await page.evaluate(key=>localStorage.getItem(key),key)==="{","Cancel reset must preserve the original.");
    await page.locator("#reset-request").click();await page.locator("#reset-yes").click();
    assert(await page.locator("#storage-error").isHidden(),"Explicit reset should restore usable storage.");
    assert(await page.evaluate(()=>localStorage.getItem("unrelated-notebook"))==="keep","Reset must not touch unrelated records.");
    passed.push("Unreadable-data preservation, original export, canceled reset, and scoped confirmed reset");
  } finally {await corrupt.close();}
  const blocked=await browser.newContext({reducedMotion:"reduce"});
  try {
    await blocked.addInitScript(()=>{
      const original=Storage.prototype.getItem;
      Storage.prototype.getItem=function(key){if(key==="founder-fieldwork-v1")throw new DOMException("Blocked for test","SecurityError");return original.call(this,key);};
    });
    const page=await blocked.newPage();await page.goto(base+"/#lesson=problem&step=apply");
    assert((await page.locator("#storage-error").textContent()).includes("unavailable"),"Blocked storage must be visible.");
    await page.locator("#lesson-note").fill("A note that survives within this tab.");
    await page.getByRole("link",{name:"Notebook",exact:true}).click();await page.locator("#notebook-title").waitFor();
    await page.locator(".notebook-entry").first().locator("summary").first().click();
    assert((await page.locator("#note-problem").inputValue()).includes("within this tab"),"Storage failure must not discard in-tab edits.");
    const exported=page.waitForEvent("download");await page.locator("#export-notes").click();
    assert((await exported).suggestedFilename()==="founder-fieldwork-notes.md","Export must work without browser storage.");
    passed.push("Blocked-storage warning, in-tab editing, and working export");
  } finally {await blocked.close();}
  return {result:"Storage and legacy compatibility checks passed.",passed};
}
