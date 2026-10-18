# Comprehension-first redesign

## The problem

The page grew around components instead of a learning sequence. Adding OpenUI made individual panels richer while leaving the information architecture fragmented.

The learner has to decide where to look, which navigation to trust, which interaction matters, and whether to write notes before understanding the idea. The visual system gives supporting tools nearly the same weight as the lesson.

The goal is a much clearer learning experience. A "100x" improvement is an ambition, not a measured learning result.

## Audit: observed gaps

Measurements below were taken from the published page on 18 October 2026 with an empty learner record.

| Gap | Evidence | Consequence | Priority |
|---|---|---|---|
| The first visit behaves like a landing page | The first lesson's core idea begins at document y=1,206px on a 1440x900 desktop and y=1,777px on a 390x844 phone | The learner must scroll past the pitch and demonstration before reaching teaching | P0 |
| Too many competing routes | 17 rendered controls precede the first core idea on desktop; 16 on phone. There are top navigation, hero actions, a section map, a lesson index, and previous/next links | The interface repeatedly asks for navigation decisions | P0 |
| Reading and writing compete | Desktop lessons have a 644px article beside a 240px exercise panel, with another lesson-navigation column alongside | The learner is asked to read, explore a diagram, and write at the same time | P0 |
| The sequence is implicit | Explanation, model, example, comparison, caveat, quiz, note, and completion are shown together | It is hard to know what to do now and what comes next | P0 |
| Visuals repeat rather than always clarify | Every lesson gets an interactive visual even when it repeats the surrounding explanation | More controls and captions create work without an equally clear teaching benefit | P1 |
| The cabinet leads the course | A detailed filing analogy dominates the entry screen before the customer-problem lesson | A supporting evidence-classification exercise becomes the apparent subject | P1 |
| Recognition can substitute for recall | The quiz exposes answer choices before asking the learner to explain the idea | It is easy to recognize a plausible sentence without articulating the distinction | P1 |
| Prefilled notes can look like application | A visual can append a generic template that satisfies the non-empty-note completion rule | A click can produce apparent progress without the learner making a project decision | P1 |
| The notebook shows every blank field | Nine expanded note editors create a long secondary page | Unwritten work obscures what the learner has actually produced | P2 |
| Source attribution is accurate but scattered | Provenance appears in the hero, each lesson, the reading list, and repeated explanatory notes | Important transparency becomes repeated page chrome | P2 |

These are interface observations and design hypotheses. No learner comprehension study has been conducted.

## Directions considered

1. **Resource library:** organize around the nine original readings. Good for reference, but still leaves a beginner to invent their own learning sequence.
2. **Learning dashboard:** retain the maps, cards, progress panels, and sidebars. Good for monitoring activity, but this is the architecture the reader has rejected.
3. **Guided reader, chosen:** a short course outline followed by one reading column, with explanation, recall, and application separated. Keep reference tools available without displaying them throughout.

## The new architecture

```text
Course
  One clear start/continue action
  Find a real problem
    Find a real problem
    Ask better questions
    Test the blocking assumption
  Test a useful offer
    Build a useful first version
    Deliver it by hand
    Reach the first customer
  Earn repeat use
    Make a paid offer
    Check whether people return
    Choose the next experiment

Lesson
  Learn: one idea, one worked example, one relevant caution
  Check: explain from memory, then reveal the answer choices
  Apply: make one decision for your own project
  Finish: your takeaway, your note, one next lesson

Notebook
  Review and export your decisions
  Expand individual notes when needed

Resources
  Reading list and source boundary
  Optional evidence-classification practice
```

## What changes

### P0: remove the competing structure

- Replace the large marketing hero with a compact course introduction.
- Remove the permanent lesson sidebar and duplicate section map.
- Use one reading column with a bounded text measure.
- Show one lesson phase at a time: Learn, Check, or Apply.
- Give each phase one dominant next action.
- Retain direct lesson links and browser Back/Forward navigation.

### P1: make the learning sequence explicit

- Name lessons by the decision the learner will make, not by a source or metaphor.
- State the artifact each lesson produces.
- Keep the fictional receipt-chasing case, with enough context to understand it.
- Ask for an explanation from memory before exposing the existing quiz choices.
- Put project writing in Apply rather than beside the explanation.
- Remove the automatic note-template action. Examples remain optional guidance.
- Use OpenUI only for interview comparison and MVP scope, where changing the view exposes a useful distinction. Other lessons use a readable worked example.
- Move the Anatomy cabinet to the optional evidence practice. It is retained, not discarded.

### P2: keep reference and recovery out of the main path

- Move the full source boundary and reading list to a dedicated Resources view.
- Keep a compact source link in each lesson.
- Use collapsible notebook entries rather than nine open editors.
- Preserve local notes, completed practices, export, full-course print, theme preference, storage warnings, and recovery of unreadable saved data.
- Store optional recall notes without invalidating the existing version-1 learner record.

## Visual direction

Keep the established charcoal/yellow and light themes. Change hierarchy, not the brand.

- A compact header, restrained glass on the header only.
- Larger reading text and a consistent, narrow column.
- Flat teaching content rather than nested cards and rim shadows.
- Yellow identifies the current phase or primary action, not every panel.
- Examples use direct labels and whitespace.
- A diagram earns its place by explaining something the text alone handles poorly.
- No decorative animation, automatic tours, vanity scores, or mandatory hover interactions.

The local UX database search did not return a relevant disclosure guideline. This plan is based on the inspected interface and general progressive-disclosure practice, not a claimed database recommendation.

## Acceptance criteria

| Requirement | How it will be checked |
|---|---|
| A new learner has one obvious starting action | One prominent course CTA, visible within the first viewport at desktop and phone sizes |
| Teaching begins promptly after opening a lesson | Core idea starts within the first 480 CSS pixels at 1440x900 and 390x844 |
| There is only one primary reading lane | No lesson sidebar or parallel exercise column |
| One phase is shown at a time | Learn never renders quiz choices or a project editor; Apply does not render the full lesson |
| The next action is explicit | Each phase has one dominant forward button or link |
| Recall precedes recognition | Answer choices are collapsed until the learner elects to reveal them |
| Visual interactions are purposeful | Only the two designated lessons mount an OpenUI illustration |
| Old progress is safe | Existing version-1 notes and completion marks survive parse, navigation, and reload |
| Practice still requires application | New completion requires the existing correct check and a non-empty project note; no action prepopulates a note |
| No new account or data service is introduced | The built page remains self-contained and makes no external runtime requests |
| Mobile remains usable | No horizontal overflow, controls at least 44px high, no fixed chrome obscuring focused controls |
| All supporting tools still work | Note editing/export, complete-course print, source list, optional lab, theme change, and storage recovery pass interaction checks |

## Validation and limits

Run model, schema, routing, storage-compatibility, and browser interaction checks. Inspect the actual desktop and phone renders in both relevant themes. Record measured interface results here after implementation.

Do not call fewer controls or shorter scrolling a measured comprehension gain. To measure learning, a follow-up study would compare unaided explanations, correct application to a new scenario, and delayed recall against the previous design.

## Implementation results

The course now uses a compact outline and a single-column guided reader. The baseline and new entry measurements use different page structures: the baseline was a continuous landing/lesson page, while the redesigned reader opens after one explicit Start action. The figures below describe layout and access, not a controlled comparison of learning speed.

| Check | Result |
|---|---|
| Course entry | One dominant Start/Continue action, visible in the first viewport at 1440x900 and 390x844 |
| First lesson's core idea | Begins at y=372px on desktop and y=337px on phone after opening the lesson |
| All nine lessons | Every core idea begins at or above y=372px at both measured widths, within the 480px target |
| Phone header | 64px, compared with the previous 114px |
| Reading structure | One block reading lane. No permanent lesson sidebar, parallel exercise panel, marketing hero, or duplicate section map |
| Lesson sequence | Exactly one phase rendered: Learn, Check, or Apply. One dominant forward action |
| Recall | Optional own-words response appears before the initially collapsed answer choices |
| Application | No prefill action. Completion still requires a correct check and a project note |
| Visuals | Interactive examples retained only for interview questions and MVP scope. Cabinet moved to optional practice |
| Notebook | Individual entries collapsed by default; opening an editor closes the previous editor |
| Compatibility | Existing version-one notes, completion marks, and theme survive. Recall extends the same record |
| Supporting behavior | Export, complete-course print, source provenance, optional practice, Back/Forward, direct links, skip navigation, reset, unreadable-data recovery, and blocked-storage editing pass browser checks |
| Responsive fit | No page overflow at 320, 390, 768, or 1440 pixels |
| Runtime | No external runtime requests or uncaught errors in the focused visual checks |
| Automated coverage | 19 model/content/routing/schema tests pass, plus guided-reader, storage-compatibility, and focused-visual browser checks |

Desktop and phone renders were inspected in dark and light themes. The core explanations were also rewritten around plain-language mechanisms instead of opening each lesson with an author summary.

### What has not been established

No measured "100x" learning gain is claimed. A useful next validation would give comparable tasks to people using the old and new versions, then compare:

- Whether they can explain the distinction without looking at the page.
- Whether they can apply it to a different business example.
- What they remember after a delay.

Do not attribute a same-person retest improvement entirely to the interface; they may simply remember the material from the first attempt. No learner tracking or analytics has been added.
