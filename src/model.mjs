export const categories = ["opinion", "behavior", "commitment"];

export function evaluateSignal(signal, answer) {
  if (!categories.includes(answer)) throw new RangeError("Choose a valid evidence category.");
  return { correct: signal.category === answer, category: signal.category, explanation: signal.why, next: signal.next };
}

export function emptyProgress() {
  return { version: 1, notes: {}, recalls: {}, passed: [], completed: [], theme: "dark" };
}

export function parseProgress(raw, ids) {
  const saved = JSON.parse(raw);
  if (!saved || saved.version !== 1 || typeof saved.notes !== "object" || saved.notes === null ||
      Array.isArray(saved.notes) || !Array.isArray(saved.passed) || !Array.isArray(saved.completed) ||
      !["dark", "light"].includes(saved.theme)) {
    throw new TypeError("Saved field notes have an unsupported format.");
  }
  if(saved.recalls!==undefined&&(typeof saved.recalls!=="object"||saved.recalls===null||Array.isArray(saved.recalls))) {
    throw new TypeError("Saved recall notes have an unsupported format.");
  }
  const notes = {},recalls={};
  for (const id of ids) {
    if (Object.hasOwn(saved.notes, id)) {
      if (typeof saved.notes[id] !== "string") throw new TypeError("A saved field note is not text.");
      notes[id] = saved.notes[id];
    }
    if(saved.recalls&&Object.hasOwn(saved.recalls,id)) {
      if(typeof saved.recalls[id]!=="string")throw new TypeError("A saved recall note is not text.");
      recalls[id]=saved.recalls[id];
    }
  }
  const passed = [...new Set(saved.passed.filter(id => ids.includes(id)))];
  const completed = [...new Set(saved.completed.filter(id => ids.includes(id) && passed.includes(id) && notes[id]?.trim()))];
  return { version: 1, notes, recalls, passed, completed, theme: saved.theme };
}

export function canComplete(state, id) {
  return state.passed.includes(id) && Boolean(state.notes[id]?.trim());
}

export function makeNotebook(lessons, state) {
  const lines = ["# Founder Fieldwork", "", "Original companion course inspired by @davecto's reel.", "The full nine-resource list was not publicly visible. This is an independently curated selection.", "", "Personal notes exported from this browser. Course completion is not business validation.", ""];
  for (const lesson of lessons) {
    lines.push(`## ${lesson.short}`, "", `${lesson.author}: ${lesson.resource}`, lesson.url, "", `Practice: ${lesson.task}`, "", state.notes[lesson.id]?.trim() || "(No note yet.)", "", `Practice complete: ${state.completed.includes(lesson.id) ? "yes" : "no"}`, "");
    if(state.recalls?.[lesson.id]?.trim())lines.push("Recall note:",state.recalls[lesson.id],"");
  }
  return lines.join("\n");
}
