const money=value=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
const quantity=value=>new Intl.NumberFormat("en-US",{maximumFractionDigits:6}).format(value);
function calculatorMarkup() {
  return `<details class="economics-explorer"><summary>Try the arithmetic with different assumptions</summary><p class="small">One illustrative month, in USD. These inputs are invented. Change one at a time to understand the relationship, not to predict your earnings.</p>
  <form id="economics-form">${economicsFields.map(f=>`<div class="numeric-field"><label for="econ-${f.id}">${f.label}</label><input id="econ-${f.id}" name="${f.id}" type="number" value="${f.value}" min="${f.min}" max="${f.max}" step="${f.step}" required></div>`).join("")}
  <div class="example-actions"><button class="secondary" type="submit">Calculate this example</button><button id="reset-example" class="text-button" type="button">Restore the example</button></div><p id="economics-error" class="calculation-error" role="alert" hidden></p></form>
  <section id="economics-results" aria-label="Illustrative economics result" aria-live="polite"></section>
  <p class="small">Order counts are modeled quantities and can be fractional. Displayed dollar amounts are rounded to cents; calculations use unrounded quantities. This guide uses completed orders / visits; it does not mix those visits with unique people. Rates above 100% are outside this simplified model.</p>
  <p class="small">Break-even holds acquisition spending, fixed costs, and per-order contribution constant. In real life, changing traffic or price can also change conversion, acquisition spending, and delivery costs. Tax, financing, owner pay, refunds, depreciation, and any unlisted expenses need separate treatment or explicit inclusion. This is not a profit forecast.</p></details>`;
}
function wireCalculator() {
  const form=$("#economics-form");
  if(!form)return;
  function draw(input) {
    const r=calculateEconomics(input);
    const rows=[
      ["Modeled orders",quantity(r.orders),`${quantity(input.visits)} visits x ${quantity(input.rate)}%`],
      ["Modeled net revenue",money(r.revenue),`${quantity(r.orders)} orders x ${money(input.price)}`],
      ["Variable delivery cost",money(r.variableCost),`${quantity(r.orders)} orders x ${money(input.variable)}`],
      ["Contribution",money(r.contribution),`${money(r.revenue)} - ${money(r.variableCost)}`],
      ["Acquisition + fixed costs",money(r.periodCost),`${money(input.acquisition)} + ${money(input.fixed)}`],
      [r.surplus<0?"Modeled shortfall before tax":"Modeled surplus before tax",money(r.surplus),`${money(r.contribution)} - ${money(r.periodCost)}`]
    ];
    $("#economics-results").innerHTML=`<dl class="calculation-rows">${rows.map(([name,value,formula])=>`<div><dt>${name}<small>${formula}</small></dt><dd>${value}</dd></div>`).join("")}</dl>
    <p class="break-even">${r.breakEvenOrders===null?"No positive per-order contribution: more of these orders cannot cover a positive acquisition/fixed-cost budget.":`Modeled cost-covering volume: ${quantity(r.breakEvenOrders)} whole orders at ${money(r.contributionPerOrder)} contribution per order.`}</p>`;
    $("#economics-error").hidden=true;$("#economics-results").hidden=false;
  }
  function update() {
    try {
      const data=new FormData(form),input={};
      for(const field of economicsFields) {
        const raw=data.get(field.id);
        if(typeof raw!=="string"||raw.trim()==="")throw new RangeError(`Enter ${field.label.toLowerCase()}.`);
        input[field.id]=Number(raw);
      }
      draw(input);
    } catch(error) {
      if(!(error instanceof RangeError))throw error;
      $("#economics-results").hidden=true;$("#economics-error").textContent=error.message;$("#economics-error").hidden=false;
    }
  }
  form.addEventListener("submit",event=>{event.preventDefault();update();});
  form.addEventListener("input",()=>{$("#economics-results").hidden=true;$("#economics-error").textContent="Inputs changed. Calculate again to see a matching result.";$("#economics-error").hidden=false;});
  $("#reset-example").addEventListener("click",()=>{form.reset();draw(exampleInputs);});
  draw(exampleInputs);
}
