export const lessons = [
  {
    id: "problem", group: "Find the problem", short: "Notice expensive friction",
    title: "Start with a problem someone already has.",
    author: "Paul Graham", resource: "How to Get Startup Ideas",
    url: "https://paulgraham.com/startupideas.html", origin: "Selected from an author named in the reel",
    idea: "Start with a person who repeatedly struggles with a task. Look for the workaround they already use.",
    paragraphs: [
      "A real problem leaves a trace: time spent, money paid, a delay, or a workaround. Find people you can reach and ask to see that trace. A problem you have yourself is a useful lead. Other people's behavior is what you still need to investigate.",
      "Look for a specific person, a recurring situation, and a costly workaround. Cost can mean time, money, delay, or risk. Someone spending effort to solve a problem tells you more than someone agreeing that the idea sounds useful."
    ],
    case: "Our fictional founder wants to build an AI assistant for everyone who handles money. A narrower observation is more useful: independent bookkeepers chase missing client receipts before each monthly close. Now there is a workflow to investigate and a person to find.",
    distinction: ["Weak starting point", "An AI tool for small businesses.", "Testable starting point", "Independent bookkeepers repeatedly chase missing receipts before closing a client's books."],
    task: "Write a problem statement without naming your product.",
    steps: ["Choose a person you can realistically reach.", "Describe the last situation in which the problem occurred.", "Record the workaround and the cost. Mark guesses as guesses."],
    prompt: "Who struggles, in what situation, and what do they do about it today?",
    example: "Independent bookkeepers lose time chasing missing receipts before monthly close. I still need to check how often this happens and which part is most painful.",
    trap: "A narrow first customer is a learning choice, not a claim that the whole market is small. Do not turn your own experience into a market-size estimate.",
    quiz: {question: "Which observation gives you the best starting point?", options: ["The market has millions of small businesses.", "A bookkeeper shows the reminder spreadsheet they use every close.", "Your friends think your app name is memorable."], correct: 1, explanations: ["A large category says little about urgency or access to customers.", "A specific workaround exposes a real workflow. You still need to check frequency and cost.", "A reaction to branding is not evidence of a costly customer problem."]},
    takeaway: "Find a workaround before you build its replacement."
  },
  {
    id: "interviews", group: "Find the problem", short: "Ask about the last time",
    title: "Get the story before you pitch the solution.",
    author: "Rob Fitzpatrick", resource: "The Mom Test",
    url: "https://www.momtestbook.com/", origin: "Book explicitly named in the reel",
    idea: "Ask what the customer has already done. A recent real event tells you more than a prediction about your app.",
    paragraphs: [
      "When you describe your solution first, a person may react to the pitch instead of explaining their problem. Ask them to walk through a recent situation. Follow what they tried, where it failed, and what it cost. Ask permission before viewing client information or keeping sensitive notes.",
      "Ask for a recent example, then follow the sequence: what started the work, what they tried, who was involved, and what happened afterward. Keep observed facts separate from your interpretation. Ask permission before taking sensitive notes or viewing customer material."
    ],
    case: "Instead of asking whether an AI reminder bot sounds useful, ask the bookkeeper to describe their most recent close. You learn that reminder writing is quick, but finding which documents are still missing is slow. That changes what you should test.",
    distinction: ["Leading question", "Would you pay for my automatic receipt chaser?", "Learning question", "Walk me through how you handled missing receipts on your last close."],
    task: "Rewrite your interview questions so they can uncover an inconvenient answer.",
    steps: ["Remove the product name and the promised benefit.", "Ask for one recent event and its actual sequence.", "Ask what they tried and why it did or did not help."],
    prompt: "Write three questions about past behavior. What answer would make you reconsider your idea?",
    example: "Walk me through your last close. How did you identify the missing items? What happened when a client did not respond? I would reconsider if the work was rare or already handled well.",
    trap: "Do not treat a friendly conversation as validation. Interest, access to a workflow, and an agreement to a pilot are different signals.",
    quiz: {question: "A customer says, 'I'd definitely use that.' What should you do next?", options: ["Count them as a future paying customer.", "Ask them to repeat the compliment for your website.", "Ask about the last time the problem happened and what they actually did."], correct: 2, explanations: ["A prediction of future use is not a purchase or observed use.", "A testimonial cannot resolve whether the underlying problem matters.", "A concrete past event can expose frequency, workarounds, and consequences."]},
    takeaway: "Make it easy for the customer to disagree."
  },
  {
    id: "learning", group: "Find the problem", short: "Choose the next uncertainty",
    title: "Keep the learning loop close to the customer.",
    author: "Y Combinator", resource: "YC's essential startup advice",
    url: "https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice", origin: "Selected from an organization named in the reel",
    idea: "Test the assumption that could stop your plan from working before you build around it.",
    paragraphs: [
      "An assumption is something your plan depends on but you have not checked. A customer might want the result while refusing the data access your service needs. Write down the uncertain condition. Choose a small, safe test that could show you are wrong.",
      "Separate a belief about the problem from a belief about the solution. Someone may genuinely struggle with a workflow but refuse access to the data your product needs. Test that constraint before you automate the workflow."
    ],
    case: "The bookkeeper confirms that missing receipts are painful. But they will not connect a client's inbox to an unknown app. A safe test might use a redacted checklist or sample files. A better reminder model cannot fix a missing permission.",
    distinction: ["Output", "Build another inbox integration.", "Learning outcome", "Find out whether the customer can and will share the inputs the service needs."],
    task: "Name the uncertainty that could make your current plan fail.",
    steps: ["Write one assumption about the customer or workflow.", "Describe an observation that would contradict it.", "Choose the smallest safe way to obtain that observation."],
    prompt: "What do you need to learn before more building makes sense?",
    example: "I assume bookkeepers can provide a redacted missing-document checklist. I will ask one to show how that checklist is created before building an importer.",
    trap: "A small early sample can guide a next step. It does not establish representative demand or prove that all customers behave the same way.",
    quiz: {question: "Users want the outcome but cannot share the required data. What comes next?", options: ["Test a permissible input or a different workflow.", "Add more features until the product feels credible.", "Declare demand validated and buy ads."], correct: 0, explanations: ["The input constraint can block the service. Investigate a safe alternative before investing further.", "Feature count does not solve permission, trust, or data access.", "Interest in an outcome does not establish that your delivery model can work."]},
    takeaway: "Build to answer a question you can name."
  },
  {
    id: "mvp", group: "Test the offer", short: "Cut to one useful outcome",
    title: "Make the smallest version useful to someone.",
    author: "Michael Seibel / Y Combinator", resource: "How to plan an MVP",
    url: "https://www.ycombinator.com/library/6f-how-to-plan-an-mvp", origin: "Selected from an organization named in the reel",
    idea: "Build the smallest complete way to help one kind of customer do one useful job.",
    paragraphs: [
      "This first version is often called a minimum viable product, or MVP. Its job is to test an outcome with a real user. Cut features that do not help answer that question. Keep the permissions, reliability, and honesty needed to deliver the small outcome safely.",
      "Minimum does not excuse unsafe handling, broken promises, or unusable work. Manual delivery can reduce technical scope, but the customer should understand what is manual and what the pilot does not do."
    ],
    case: "The first receipt-chasing service could accept a permitted checklist and return a clear missing-item summary. It does not need bank sync, forecasting, or a team dashboard. The useful test is whether the summary helps the bookkeeper complete the close.",
    distinction: ["Feature bundle", "Dashboard, AI chat, bank sync, forecasting, reminders.", "First useful result", "A checked list of missing items for one close, with a clear handoff."],
    task: "Write a pilot scope that fits on a short note.",
    steps: ["Name the input the customer can safely provide.", "Define the output and the customer's next action.", "List what you will deliberately leave out and what must still be reliable."],
    prompt: "What is the smallest complete outcome, and what will you leave out?",
    example: "Input: a redacted receipt checklist. Output: a reviewed list of missing items. Leave out inbox access, automated sending, and bank sync. The customer reviews the output before using it.",
    trap: "A prototype that gets clicks can test comprehension. It cannot by itself prove that the service delivers value, retains users, or earns money.",
    quiz: {question: "Which MVP scope answers the most useful question?", options: ["A polished landing page with every planned feature.", "One safe workflow that produces a result the target user can use.", "An architecture that can support a hypothetical million customers."], correct: 1, explanations: ["A landing page can test a message, but not whether the proposed workflow works.", "A complete, narrow outcome lets you observe usefulness while keeping scope small.", "Early scale does not answer whether the first customer wants the result."]},
    takeaway: "Cut features. Keep the customer's outcome."
  },
  {
    id: "manual", group: "Test the offer", short: "Do the work by hand",
    title: "Learn the service before you automate it.",
    author: "Paul Graham", resource: "Do Things That Don't Scale",
    url: "https://paulgraham.com/ds.html", origin: "Selected from an author named in the reel",
    idea: "Deliver the result yourself before deciding which parts to automate.",
    paragraphs: [
      "A manual pilot is a small service you perform by hand. Watching one complete job exposes exceptions, trust concerns, and the steps the customer values. Record the time and resources it takes. A useful service and a sustainable way to deliver it are separate things to test.",
      "Manual service exposes exceptions, trust concerns, and the steps customers value. Record the time and resources it takes. A delighted customer is useful evidence, but a service that requires unsustainable effort still needs a better delivery model."
    ],
    case: "You sit with a bookkeeper, prepare the missing-item summary, and watch them use it. They ignore your carefully written reminder and use only the client-by-client checklist. Automating the reminder first would have accelerated the wrong part.",
    distinction: ["Premature automation", "Build a workflow engine before watching one complete job.", "Useful manual work", "Deliver one outcome, observe the handoff, and record the recurring steps."],
    task: "Design a small concierge pilot you can deliver honestly.",
    steps: ["Recruit a specific person through a channel you can actually reach.", "Agree on scope, permissions, and what happens to their data.", "Track the steps, delivery time, failure points, and customer's response."],
    prompt: "What will you deliver manually, and which repeated step might deserve automation?",
    example: "I will prepare a reviewed missing-item summary from a permitted checklist. I will record the steps and time, then check which parts recur across jobs.",
    trap: "Do not disguise manual work as an autonomous AI system. Also ask whether close founder attention is masking friction that future users would face.",
    quiz: {question: "A manual pilot delights a customer but takes most of your week. What does that show?", options: ["The whole business is ready to scale.", "Manual delivery was a mistake and taught you nothing.", "The outcome may matter, while delivery cost and repeatability still need testing."], correct: 2, explanations: ["Usefulness is only one part of a viable business.", "Manual work can expose exactly where time goes and what users value.", "You learned something about value and something about operational limits. Keep both."]},
    takeaway: "Automate the repeated work you understand."
  },
  {
    id: "launch", group: "Test the offer", short: "Put the offer in reach",
    title: "A launch is a chance to learn, not a verdict.",
    author: "Kat Mañalac / Y Combinator", resource: "How to launch (again and again)",
    url: "https://www.ycombinator.com/library/6i-how-to-launch-again-and-again", origin: "Selected from an organization named in the reel",
    idea: "Show a clear offer to a relevant audience and ask for one observable next step.",
    paragraphs: [
      "A launch is an opportunity to learn from putting your offer in front of people. You can do it more than once. Choose an audience that might have the problem, explain a specific outcome, and ask for a concrete action. A quiet first attempt does not tell you which part failed.",
      "Choose a reachable audience and a specific next action. Track the path from exposure to conversation to use. Change one meaningful part of the next attempt so you can interpret the result."
    ],
    case: "A general social post gets polite reactions. A permitted post in a bookkeeper community describes the missing-receipt workflow and offers a scoped pilot. You record who asked for details, who brought a real checklist, and who actually tried the output.",
    distinction: ["Vague launch", "My AI finance app is live. Thoughts?", "Clear offer", "If you chase receipts during monthly close, I am testing a reviewed missing-item summary. Here is the scope and how to request a pilot."],
    task: "Write a small launch with an audience and a next step.",
    steps: ["Pick one relevant channel and follow its rules.", "Describe the problem and outcome without unsupported promises.", "Ask for a concrete action and decide what you will record."],
    prompt: "Where will you reach the customer, what will you offer, and what action will you observe?",
    example: "Ask a community moderator about a pilot invitation. Explain the missing-item summary, its limits, and the permitted inputs. Record requests, completed trials, and reasons for declining separately.",
    trap: "A lack of replies can mean weak distribution, an unclear message, low trust, or low demand. Avoid declaring the product dead or successful from one launch.",
    quiz: {question: "A broad launch gets almost no replies. What can you conclude?", options: ["You need to investigate audience, message, trust, and offer before diagnosing demand.", "No one has the problem.", "The answer is always a larger ad budget."], correct: 0, explanations: ["The observation has several possible explanations. A narrower follow-up can separate them.", "You have not shown that the right people understood and considered a credible offer.", "More exposure can repeat the same targeting or message problem at greater cost."]},
    takeaway: "Make the next launch easier to interpret."
  },
  {
    id: "pricing", group: "Earn repeat use", short: "Make a real offer",
    title: "Test a price against a clear unit of value.",
    author: "Stripe", resource: "SaaS pricing models: a guide",
    url: "https://stripe.com/resources/more/saas-pricing-models-101", origin: "Added companion reading, not confirmed in the reel's list",
    idea: "Make clear what the customer pays for, what you will deliver, and what it costs you to deliver it.",
    paragraphs: [
      "A billing unit is the thing you charge per: a person, a task, a month, or an amount of usage. Choose a unit the customer can connect to a useful result. Then test a real offer with clear scope and terms. A copied pricing table cannot tell you whether customers will pay.",
      "A real offer tests more than asking whether a price sounds fair. State the scope, amount, billing period or unit, cancellation terms, and delivery limits. Account for service costs, including AI usage and manual review. An accepted pilot is evidence of that offer, not proof of enduring demand."
    ],
    case: "The bookkeeper might evaluate a price per client close more easily than a price per AI token. But you still need to test whether that unit fits their workflow and whether your delivery costs leave room for a business.",
    distinction: ["Unclear offer", "Pay for some AI credits and see what happens.", "Inspectable offer", "A defined fee for a reviewed missing-item summary, with the scope, inputs, and cancellation terms stated."],
    task: "Draft an offer you could honestly deliver.",
    steps: ["Choose a billing unit tied to how the customer works.", "State the scope and any limits before asking for agreement.", "List delivery costs and ask for a real next step without pressure."],
    prompt: "What are you charging for, what does it cost to deliver, and what would count as acceptance?",
    example: "Charge per scoped close review, with an agreed checklist size and human review included. Track time and service costs. Count an agreed paid pilot separately from someone saying the price sounds reasonable.",
    trap: "Do not take payment for something you cannot deliver or hide automatic renewal. Cost-plus arithmetic alone does not establish willingness to pay.",
    quiz: {question: "Which signal most directly tests willingness to pay for this pilot?", options: ["A survey respondent says the price seems fair.", "An informed customer accepts a clearly scoped paid pilot.", "The pricing page looks similar to an established company's."], correct: 1, explanations: ["A reaction to a hypothetical price can differ from a real purchase decision.", "A real agreement tests this offer under its stated terms. Repeat value and delivery economics remain open.", "Presentation does not establish customer value or commercial demand."]},
    takeaway: "Price the outcome clearly enough to be declined."
  },
  {
    id: "retention", group: "Earn repeat use", short: "Find the reason to return",
    title: "Look for repeated value, not a launch-day spike.",
    author: "Rahul Vohra / First Round Review", resource: "How Superhuman Built an Engine to Find Product Market Fit",
    url: "https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/", origin: "Added companion reading, not confirmed in the reel's list",
    idea: "Look for customers using the service again when their problem happens again.",
    paragraphs: [
      "A return means more when the customer had a genuine reason to need the service again. Compare people doing similar jobs at similar points in their workflow. Ask returning customers what helped and non-returners what changed or failed. Their reasons matter alongside the count.",
      "Use surveys as one input, alongside actual use, repeat purchases, and cancellation reasons. For a small pilot, inspect individual journeys before treating percentages as reliable. The case study's survey benchmark is not a universal pass mark, so this course does not turn it into a business score."
    ],
    case: "Some bookkeepers try the summary once and disappear. Others return at the next monthly close. Weekly logins would misread this workflow. Ask what triggered the return and compare users at a relevant stage in their own cycle.",
    distinction: ["Vanity measure", "Everyone who ever signed up.", "Useful observation", "Which eligible users returned for the next close, what they did, and why others did not."],
    task: "Define repeat value at the customer's natural cadence.",
    steps: ["Name the event that creates another need for the product.", "Define who had a real opportunity to return.", "Record return behavior and ask about both useful and disappointing experiences."],
    prompt: "When should a customer need this again, and what would a meaningful return look like?",
    example: "At the next eligible monthly close, check whether the bookkeeper requests another reviewed summary and uses it to complete the task. Ask non-returners what changed or failed.",
    trap: "Daily engagement is not appropriate for every product. Survey sentiment, retention, payment, and product-market fit are related questions, not interchangeable metrics.",
    quiz: {question: "A monthly workflow has few daily logins. What should you check?", options: ["Whether users log in every morning.", "Whether the landing page needs more animation.", "Whether eligible customers return and get value at the next monthly workflow."], correct: 2, explanations: ["Daily activity can be the wrong cadence for the job.", "Visual polish cannot diagnose repeated usefulness by itself.", "Measure return against a real opportunity to use the product, then investigate the reasons."]},
    takeaway: "Measure return when the need returns."
  },
  {
    id: "focus", group: "Earn repeat use", short: "Choose the next experiment",
    title: "Spend the week on the uncertainty that matters.",
    author: "Sam Altman", resource: "Startup Playbook: focus and execution",
    url: "https://playbook.samaltman.com/#focus", origin: "Added companion reading, not confirmed in the reel's list",
    idea: "Choose one test that will change your next decision. Decide in advance what you will do with its result.",
    paragraphs: [
      "Your time is limited, so choose the uncertainty that could most change the plan. State what you believe, what you will observe, and when you will review it. Write down what would make you continue, change direction, or stop before you become attached to the result.",
      "Choose a test with a time limit, a visible result, and a rule for what you will do afterward. The rule can be qualitative when evidence is sparse. Separate continue, change, and stop conditions before you become attached to the result. Sustainable effort and necessary care remain constraints."
    ],
    case: "You could add a dashboard, write a launch thread, or investigate why last month's users did not return. If repeat usefulness is the open question, contact those users and inspect the next close. Postpone the dashboard unless it helps answer that question.",
    distinction: ["Busy week", "Ship every feature people mentioned.", "Learning week", "Test one consequential assumption and decide what the result changes."],
    task: "Write a one-week experiment and a decision rule.",
    steps: ["State the assumption and the evidence you need.", "Choose a reachable customer, action, and review date.", "Name what you will postpone and what would make you continue, change, or stop."],
    prompt: "What will you test next, what would change your mind, and what will you leave undone?",
    example: "Before next Friday, ask eligible pilot users about their next close and offer a clearly scoped repeat service. If they need it but reject the workflow, change delivery. If the problem has disappeared, reconsider the segment. Postpone the dashboard.",
    trap: "A busy calendar is not evidence of progress. Equally, an arbitrary tiny sample is not a statistical go/no-go rule. State what you learned and what remains uncertain.",
    quiz: {question: "Which weekly plan is easiest to learn from?", options: ["Test a named assumption, collect observable evidence, and review a prewritten decision rule.", "Improve the app until it feels finished.", "Build every requested feature and decide what it means afterward."], correct: 0, explanations: ["The plan links effort to a decision while making uncertainty explicit.", "Finished is not an observable customer outcome.", "Several simultaneous changes make the result harder to interpret and may exceed your capacity."]},
    takeaway: "End the week with a better decision."
  }
];

export const signals = [
  {text: "A friend says the idea sounds useful.", category: "opinion", why: "This is a reaction to an idea. It does not establish a recent problem, real use, or purchase.", next: "Ask for a recent example of the problem without pitching."},
  {text: "A bookkeeper shows the reminder spreadsheet used at the last close.", category: "behavior", why: "You can inspect a past workaround. That supports the existence of a workflow, not willingness to switch.", next: "Check the frequency, consequence, and hardest step."},
  {text: "A customer accepts a clearly scoped paid pilot.", category: "commitment", why: "They have committed resources to this offer. Delivery, repeated value, and sustainable economics remain untested.", next: "Deliver the promised outcome and inspect whether it helped."},
  {text: "Someone says they would pay if you added more features.", category: "opinion", why: "A hypothetical purchase remains an opinion, even when it mentions money.", next: "Explore the last problem and make a concrete, honest offer."},
  {text: "An eligible pilot user returns at the next monthly close.", category: "behavior", why: "This is observed repeat behavior. Investigate the value they received; one return is not proof of broad product-market fit.", next: "Ask what brought them back and inspect the completed task."},
  {text: "A bookkeeper schedules a pilot and agrees to prepare a permitted sample checklist.", category: "commitment", why: "A specific investment of time and effort is a commitment. Verify whether it happens before treating it as completed behavior.", next: "Confirm scope and permissions, then observe the pilot."}
];
