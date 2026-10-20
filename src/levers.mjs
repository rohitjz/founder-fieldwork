const original="Added teaching reference; not identified as a resource in the reel";
export const leversLessons=[
  {
    id:"claim",group:"Check the starting point",short:"Read the claim carefully",
    title:"A revenue number does not tell you what the owner kept.",
    author:"Stripe",resource:"How to calculate the break-even point",
    url:"https://stripe.com/resources/more/how-to-calculate-the-break-even-point",origin:original,
    idea:"Before learning from an earnings claim, ask what was measured, over what period, and after which costs.",
    paragraphs:[
      "Revenue is the value of sales. A cost is what the business spends to make and support those sales. Profit depends on which costs have been deducted. Cash received is another question: a sale can be recorded before the customer pays, and a payment can arrive before you deliver.",
      "Ask for the currency, period, business activity, refunds, costs, and the evidence behind the number. A personal result is one person's account, not a forecast for you. The useful lesson is how a business works, not a target you must copy."
    ],
    case:"Imagine an online service with $1,000 in sales for one month. It spends $300 delivering orders, $200 acquiring customers, and $400 on fixed costs. The modeled remainder is $100 before tax and any omitted costs. Saying it made $1,000 would leave the most important part unclear.",
    distinction:["Sales","$1,000 of revenue in the example month.","Modeled remainder","$100 after the example's specified costs, before tax and omitted items."],
    task:"Write the questions you would ask before trusting an earnings claim.",
    steps:["Name the metric, currency, and period.","Ask which costs and refunds are included.","Separate what was shown from what you are assuming."],
    prompt:"Which number are you trying to understand, what does it include, and what evidence is missing?",
    example:"I need monthly revenue, direct delivery costs, acquisition costs, fixed costs, refunds, and owner pay separately. A screenshot of sales alone will not answer what the business keeps.",
    trap:"Do not infer the creator's costs or actual profit. The reel's personal claim has not been verified here.",
    quiz:{question:"A screenshot shows $10,000 in payments received. What can you conclude?",options:["The owner earned $10,000 in profit.","You need the period, refunds, delivery obligations, and costs before judging earnings.","Every similar business can reach the same result."],correct:1,explanations:["Payments received do not show expenses, refunds, or unfinished obligations.","The screenshot alone cannot establish profit or what the owner can take home.","One account cannot establish a transferable outcome for another business."]},
    takeaway:"Name the metric before you borrow the ambition."
  },
  {
    id:"buyer",group:"Check the starting point",short:"Find a buyer with a real problem",
    title:"A reachable buyer comes before a traffic target.",
    author:"Rob Fitzpatrick",resource:"The Mom Test",
    url:"https://www.momtestbook.com/",origin:original,
    idea:"Find someone with a problem they already spend effort solving. Then test a small, clear offer.",
    paragraphs:[
      "A buyer is not simply everyone who might like the idea. Choose a person you can reach, a task they struggle with, and an outcome you can safely deliver. Ask about their last attempt before presenting your product. Their actual workaround gives you a starting point.",
      "Interest, a request for information, a completed trial, and payment are different observations. Record them separately. You can use AI to help prepare questions, but generated customer quotes or personas cannot replace conversations with real people."
    ],
    case:"Our fictional service could promise AI content for everyone. A narrower test is a reviewed brief for an independent instructor preparing a course launch. Ask how they prepared the last launch, what took time, and whether they already paid someone to help.",
    distinction:["An audience category","Anyone building a personal brand.","A testable buyer situation","An independent instructor preparing a course launch who can describe the last preparation process."],
    task:"Name a reachable buyer and a small offer.",
    steps:["Choose a person or group you can actually contact.","Ask about the most recent occurrence of the problem.","Describe a limited outcome, permissions, and delivery terms."],
    prompt:"Who will you talk to, what recent problem will you investigate, and what small result could you offer?",
    example:"I will ask an independent instructor about their last launch brief. If the preparation was painful, I will offer one reviewed brief using permitted inputs, with the scope and price agreed first.",
    trap:"A polite yes is not a purchase. Do not pressure people or treat a fictional persona as observed demand.",
    quiz:{question:"Which observation is the strongest starting point for investigation?",options:["A person shows the process they used to prepare their last launch.","AI estimates that many people might want content help.","Friends like the name of your service."],correct:0,explanations:["A recent process gives you something real to inspect. You still need to investigate cost and urgency.","A generated estimate does not establish a customer's behavior or buying decision.","Branding feedback does not show a recurring problem."]},
    takeaway:"Find the job before you count the visitors."
  },
  {
    id:"funnel",group:"Follow the money",short:"Connect visits to sales",
    title:"Make the path from attention to an order explicit.",
    author:"Shopify",resource:"Ecommerce conversion rate",
    url:"https://www.shopify.com/blog/ecommerce-conversion-rate",origin:original,
    idea:"For a simple order funnel, visits multiplied by the order rate gives modeled orders. Orders multiplied by average net revenue gives modeled revenue.",
    paragraphs:[
      "Choose one period and one denominator. In this guide, the order rate is completed orders divided by site visits in that same period. A visit is a session, not a unique person. One person may visit several times. Do not replace visits with followers or total registered users.",
      "This is a simple direct-sale teaching model. Some businesses need extra stages such as a qualified lead, a sales call, or an approval. Label the stages and use matching periods before comparing rates. Improving a metric requires a test; changing a number in a model is not evidence you can achieve it."
    ],
    case:"With 1,000 visits and 20 completed orders, the example order rate is 20 / 1,000 = 2%. At $50 average net revenue per order, modeled revenue is $1,000. Raising the rate to 3% while holding everything else constant gives 30 modeled orders and $1,500 revenue.",
    distinction:["A defined rate","20 orders / 1,000 visits in one month = 2%.","An incompatible denominator","20 orders / everyone who has ever followed the account."],
    task:"Write a small funnel with clearly labeled stages.",
    steps:["Define the start, the completed action, and the period.","Use the same population and period in numerator and denominator.","Choose one possible source of friction to investigate."],
    prompt:"What starts your funnel, what counts as a completed sale, and which rate could you measure honestly?",
    example:"I will count visits to the pilot-offer page and completed paid orders during the same month. I will keep requests for information separate from purchases.",
    trap:"A higher order rate can reflect a different audience or mix of visitors. It does not automatically prove the page improved.",
    quiz:{question:"You have 800 visits and 16 completed orders in one period. What is the order rate?",options:["16%.","50%.","2%."],correct:2,explanations:["16 is the order count, not the percentage of visits.","Dividing visits by orders reverses the question.","16 / 800 = 0.02, which is 2%. Keep the numerator and denominator labeled."]},
    takeaway:"Every rate needs an action, a denominator, and a period."
  },
  {
    id:"economics",group:"Follow the money",short:"Check what each sale leaves",
    title:"More orders help only when the economics support them.",
    author:"Stripe",resource:"Break-even analysis and contribution",
    url:"https://stripe.com/resources/more/how-to-calculate-the-break-even-point",origin:original,
    idea:"Subtract the cost that grows with each order before deciding how much more volume is worth.",
    paragraphs:[
      "Variable cost grows with delivery: payment fees, materials, model usage, or review work may belong here. Contribution per order is net revenue per order minus variable cost per order. Total contribution still has to cover acquisition spending and fixed costs before the modeled business has a surplus.",
      "Customer acquisition cost, or CAC, is matched sales and marketing cost divided by new customers acquired. It is not cost divided by every order, signup, or existing customer. In a simple acquisition-period view, $200 for 10 new customers is $20 per new customer. Long sales cycles require careful timing and attribution. Do not subtract the same acquisition expense twice."
    ],
    case:"In the example month, 20 orders at $50 produce $1,000 revenue. Delivery costs are $15 per order, or $300 total. The $700 contribution then covers $200 acquisition spending and $400 fixed costs, leaving $100 before tax and omitted costs. If variable cost rises above $50 per order, selling more adds loss before those fixed costs.",
    distinction:["Contribution per order","$50 net revenue - $15 variable cost = $35.","Modeled monthly remainder","20 x $35 - $200 acquisition spending - $400 fixed costs = $100."],
    task:"List costs before deciding to buy more traffic.",
    steps:["Name the costs that grow with each order.","List the period's acquisition spending and fixed costs separately.","Check whether owner time, refunds, taxes, and other expenses are missing."],
    prompt:"What is left from one order, which other costs must it cover, and what is still missing from your estimate?",
    example:"A $50 brief with $15 variable delivery cost contributes $35 before acquisition and fixed costs. I still need to account for my review time, refunds, and tax before judging real earnings.",
    trap:"The explorer is a simplified model, not a profit forecast. A traffic or price change may also change acquisition costs, conversion, support load, and refunds.",
    quiz:{question:"Net revenue is $40 per order and variable delivery cost is $45. What happens if orders rise while those figures stay the same?",options:["Each additional order adds $5 of loss before acquisition and fixed costs.","Volume automatically fixes the loss.","The business breaks even after any fixed number of orders."],correct:0,explanations:["Contribution is $40 - $45 = -$5. More of the same orders makes that part of the loss larger.","Negative contribution is not repaired by multiplying it.","There is no volume that covers positive fixed costs with negative contribution under these assumptions."]},
    takeaway:"Inspect contribution before you scale the order count."
  },
  {
    id:"repeat",group:"Improve one thing at a time",short:"Look for a reason to return",
    title:"A second purchase needs a second reason to buy.",
    author:"Rahul Vohra / First Round Review",resource:"How Superhuman Built an Engine to Find Product Market Fit",
    url:"https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/",origin:original,
    idea:"Look for return behavior when the customer needs the outcome again. Do not assume every customer buys on a fixed schedule.",
    paragraphs:[
      "A cohort is a group defined by a shared starting point, such as the month of a first purchase. To investigate return use, compare customers who actually reached another opportunity to use the service. Record the outcome and ask why people returned or did not return.",
      "A subscription, a one-off service, and a repeat-purchase store have different cadences. A monthly charge does not prove monthly value. Avoid turning a short, small pilot into a lifetime-value estimate or assuming a survey benchmark proves product-market fit."
    ],
    case:"Of 10 instructors who bought a brief, only four have another launch during the observation window. Two buy again. That is two repeat buyers out of four eligible customers, or 50% for this small eligible group. It is also two out of the original 10, or 20% of that cohort. Both are labeled facts; they answer different questions.",
    distinction:["Eligible return rate","2 repeat buyers / 4 with another launch = 50% in this example.","Original-cohort repeat share","2 repeat buyers / 10 initial buyers = 20% over the observation window."],
    task:"Define the next real opportunity to buy again.",
    steps:["Name the event that creates another customer need.","Separate eligible customers from those not yet due to return.","Ask returners and non-returners what happened."],
    prompt:"When should your customer need this again, who would be eligible, and what would you observe?",
    example:"I will look at instructors with another launch during the next observation window. I will report both the original cohort and the eligible subset, then ask why they did or did not buy.",
    trap:"The example percentages come from tiny invented counts. They are not benchmarks or stable estimates of future retention.",
    quiz:{question:"Three of 12 initial buyers face the job again, and one buys again. Which report is clearest?",options:["Retention is definitely 33%, without qualification.","All 12 customers had an equal reason to return.","One of three eligible buyers returned; also report one of 12 original buyers over the window."],correct:2,explanations:["The small sample and eligibility definition change what the number means.","The scenario says only three faced the job again.","Both denominators are useful when labeled. Neither tiny fraction is a universal retention rate."]},
    takeaway:"Count returns against a real opportunity to return."
  },
  {
    id:"ai-test",group:"Improve one thing at a time",short:"Use AI on a testable task",
    title:"Use AI to shorten the work, not to invent the evidence.",
    author:"Anthropic with Rick Dakan and Joseph Feller",resource:"AI Fluency: Framework and foundations",
    url:"https://academy.claude.com/courses/ai-fluency-framework-foundations",origin:original,
    idea:"Give AI a bounded task, review the result, and measure whether the total workflow improved.",
    paragraphs:[
      "Claude or another AI tool can help draft interview questions, organize permitted notes, explain formulas, or produce a first draft of an offer. You remain responsible for the claims and the decision. State the task, allowed inputs, constraints, and how you will check the output.",
      "Measure total time including preparation, checking, and rework. A faster draft can create more work if errors reach the customer. Keep sensitive data out unless you have the right permissions and an appropriate data-handling setup. Do not send campaigns, spend money, or change customer records without deliberate approval."
    ],
    case:"An invented manual workflow takes 40 minutes per brief. An AI-assisted attempt takes eight minutes to draft and 37 minutes to check and repair. Total time is 45 minutes, so it is not faster. Try a narrower drafting task and compare reviewed outputs before rolling it out.",
    distinction:["Misleading speed claim","The draft took eight minutes instead of 40.","Full workflow comparison","Eight minutes drafting + 37 minutes reviewing = 45 minutes, versus 40 before."],
    task:"Plan one bounded AI-assisted experiment.",
    steps:["Choose a repeated task and define acceptable output.","Use permitted or fictional inputs and review against the same standard.","Compare total time, errors, and customer usefulness; write a stop rule."],
    prompt:"Which task will you test, what evidence will you use, and what result would make you keep, change, or stop the approach?",
    example:"Use fictional inputs to draft a launch brief. Require a human check for unsupported claims, scope, and accuracy. Compare total reviewed time against the manual process. Stop if review costs cancel the time saved.",
    trap:"Generated interviews, fake testimonials, and model confidence are not customer evidence. No AI prompt establishes demand or guarantees earnings.",
    quiz:{question:"AI drafts an offer in five minutes but it takes 30 more minutes to fix. The manual process took 25 minutes. Which comparison is valid?",options:["AI was five times faster because drafting took five minutes.","The AI-assisted workflow took 35 minutes, so it was slower on this attempt.","The checking time should be ignored because it is human work."],correct:1,explanations:["That comparison ignores the work required to make the draft usable.","Count drafting and review together, and compare quality under the same standard.","Review is part of the delivery process and must be counted."]},
    takeaway:"Keep the faster workflow only after counting the whole job."
  }
];
export const leversGoals={
  claim:{label:"Read the earnings claim carefully",artifact:"A checklist of missing evidence",recall:"What do you need to know before treating a revenue claim as profit?"},
  buyer:{label:"Find the buyer and the problem",artifact:"A reachable buyer and a small offer",recall:"What does an existing customer workaround tell you that a generated persona cannot?"},
  funnel:{label:"Connect visits to orders",artifact:"A funnel with a defined rate",recall:"How do visits, order rate, and average net revenue connect in a simple order model?"},
  economics:{label:"Check what each sale leaves",artifact:"A cost model with its omissions named",recall:"Why can more orders make the loss larger when contribution per order is negative?"},
  repeat:{label:"Understand repeat purchases",artifact:"A definition of an eligible return",recall:"Why should you distinguish the original customer cohort from those with a new opportunity to buy?"},
  "ai-test":{label:"Choose one AI-assisted test",artifact:"An experiment with a review standard",recall:"Which parts of the workflow must you count before claiming AI saved time?"}
};
export const leversChapters=[
  {title:"Check the starting point",question:"What do you know, and who might buy?",ids:["claim","buyer"]},
  {title:"Follow the money",question:"How does a visit become a sale, and what remains?",ids:["funnel","economics"]},
  {title:"Improve one thing at a time",question:"What brings people back, and where can AI help?",ids:["repeat","ai-test"]}
];
