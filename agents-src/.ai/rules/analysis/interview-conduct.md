---
name: interview-conduct
Scope: During the interview phase
description: How to conduct the domain interview, handle domain boundary crossings, and signal completion
---

Always open the session with the same question: what do you want to specify today? Do not proceed until this is answered — everything else depends on it.

When the human provides a feature or topic, identify the candidate unit of work and confirm with the human before starting the interview. If it touches more than one unit, present the candidates and ask the human which one to start with.

After the unit is confirmed, check whether a spec file already exists for it. If a file is found with `Status: Draft`, present its current state to the human and ask whether to continue from where it left off or discard it and start a new draft. If the human chooses to discard, delete the existing file and start the interview from scratch. If the human chooses to continue, resume the interview from the last incomplete section — do not re-ask questions already answered.

When the domain or feature may already exist in the system, ask the human which mode to operate in before starting the interview:
1. Start the spec from scratch — ignore any existing code.
2. Document the existing implementation as it is.
3. Specify a targeted change to what already exists.

Ask one question at a time. Do not present lists of questions — each answer shapes the next question.

Continue interviewing until no open questions remain about the domain's purpose, actors, rules, and boundaries. Before closing the interview, ask the human explicitly whether anything about the current domain has not been covered.

When the human confirms the interview is complete:
1. Present a summary of the domain — its purpose, actors, and the main business rules identified.
2. Ask the human to confirm the summary before proceeding.
3. Only after confirmation, write the spec.
4. Do not switch to another domain before the spec is written and confirmed.

After the spec is written and confirmed, if other units were identified during the conversation:
1. Ask the human whether they want to move to one of the identified units.
2. If yes — start the interview for that unit following the normal flow.
3. If no — review the documentation of every unit identified during the conversation:
   - For each unit that has an existing spec file: check whether the current conversation surfaced any information that would require an update to that spec. If updates are needed, present the unit name and the specific changes to be made, and wait for confirmation before writing.
   - For each unit that has no spec file: ask the human whether they want to create a draft for it. If yes, show the full path where the file will be created and wait for confirmation before creating it.

When the human introduces a second unit during the interview:
1. Record it as related context.
2. Ask the human whether to continue with the current unit or shift focus.
3. If continuing — keep the new unit recorded and return focus to the current one.
4. If shifting — follow the closing steps above before starting the next unit.

When the human cannot answer a question:
1. Attempt to derive the information from what has already been collected. Rephrase the question from a different angle.
2. Count each distinct rephrasing as one attempt. After 3 failed attempts, or if the human explicitly states they do not know, stop asking.
3. Mark the unanswered section in the spec with a note, written in the spec's language, stating that the human was unable to answer this section.
4. Continue the interview — do not block progress on one unanswered section.

When a contradiction is detected between two answers given during the interview, signal it immediately. Name both statements, identify the conflict, and ask the human to resolve it before continuing. Do not accumulate contradictions to surface at the summary stage.

Never speculate about the domain based on partial information. Ask the question that fills the gap.
