## Presentation for Spring I/O 2026

---

[Spring Time: From REST to GraphQL](https://2026.springio.net/sessions/spring-time-from-rest-to-graphql/)

---

### 1. bootstrap used to create the presentation outline

Now you run one intentional “kick‑off” prompt in Agent Mode.

✅ Use this exact structure
In Copilot Chat (Agent Mode, Claude Sonnet 4.6):

```
You are in Presentation Mode.

Rules:
- This is slide content, not documentation
- You MUST use templates from .github/slide-templates/
- Follow copilot-instructions.md strictly

Task:
- Read all files in slides-starter/
- Propose a slide outline (titles only)
- For each slide, choose the correct template
- Do NOT generate slide content yet
- One slide per core idea
- To correctly progress the demo I want to include these slides
  1. A slide to explain what happens at a party
    > People come together to dance and have fun
    > DJs perform MixSessions to guide the crowd.
    > Music evolves: warm-up → peak → cool-down.
  2. A slide to explain what a DJ does at a party
    > A DJ curates a MusicLibrary of songs and artists.
    > During a MixSession, the DJ selects tracks to play.
    > The DJ reacts to CrowdEvents (cheers, energy drops).
    > The DJ responds to requests from the audience.
    > The DJ builds the session’s energy flow with track selection.
  3. Incoming requests from audience received events
    > RequestFromAudienceReceived: "Radar Love" by Golden Earring
    > RequestFromAudienceReceived: "Wake me up!" by Avicii
    > RequestFromAudienceReceived: "Something like suavemente ??"
  4. The DJ makes a mistake and plays a track that drops the energy
    > CrowdEnergyDropped: "Never Gonna Give You Up" by Rick Astley
    > DanceFloorEmptied: 50% of the crowd leaves
    > DJ reacts by quickly switching to a high-energy track


- Target 25–30 slides

Output format:
Act 1 — Set the Tension
  Slide 1 — Title  (act-01-tension/01-title.md · slide-title.md)
  Slide 2 — <title>  (act-01-tension/02-name.md · slide-text.md)

Act 2 — First Demo Touch
  Slide 1 — <title>  (act-02-first-demo/01-name.md · slide-code.md)
(with newlines between acts)

```

Why this works

Titles are the hardest thing to get right
It forces abstraction before content
It prevents premature detail
Sonnet excels at this step

✅ Do not generate bullets yet
✅ Do not generate speaker notes yet

---

It feels like the mental load is heavy at the beginning, also the slide names sometimes feel long. What is your suggestion? Maybe split the demo instead of putting that last? If so, how? Or what else could be improved

1. Why the beginning feels heavy
   Problem 1 — Too much conceptual ramp‑up

Problem 2 — Long, explanatory titles
Your titles are accurate, but they read like documentation headers, not slide anchors.

2. How to shorten slide names (without dumbing them down)
   Rule of thumb

Slide titles should trigger recall, not explain.
Explanation belongs in bullets and speaker notes.

3. Yes — the demo should be split (very strong instinct)
   Right now, the demo is a 20‑minute monolith at the end.

That causes:

Fatigue (“still theory?”)
Risk (everything depends on the last block)
Missed reinforcement opportunities

Better approach: Demo as a thread, not a finale

4. A better structure (concrete proposal)

✅ Act 1 — Set the tension (shorter)
Slides 1–6 (keep this tight)

Title
REST Still Works
REST Pain Points
Why GraphQL
Schema First
Client‑Driven Shape

✅ Stop here.
✅ Audience is now primed.
✅ Act 2 — First demo touch (early, small)
✅ Act 3 — Mechanics, now with context
✅ Act 4 — Migration & performance (focused)
✅ Act 5 — Demo payoff (short, powerful)
✅ Act 6 — Close cleanly

---

I have added source code in the src folder.
Using the presentation-architect agent, take a moment to read all the code files 
and verify that the slide outline still makes sense. Update and expand upon
the outline as needed to ensure the code examples fit naturally into the narrative flow.


---

## 2. Lock in the slide voice (very important)
Once the outline looks right, immediately follow up with:

```
Persist the current slide outline as the canonical structure.

Task:
- Create the full contents of `slides/00-outline.md`
- This file is the single source of truth for the deck
- Apply the slide naming convention: slides/act-NN-descriptive-words/NN-short-name.md
  - NN = zero-padded act/slide number; descriptive-words = 1–2 words describing the act's purpose
- Use short, slide-like titles
- Include the chosen template per slide
- Do NOT generate slide content

Output rules:
- Output ONLY the contents of slides/00-outline.md
- No explanations, no commentary, no markdown fences
```

---

```
You are operating in Agent Mode with two roles:

1) Presentation Architect (primary)
2) Spring GraphQL Expert (verification only)

Context:
- This repository generates a technical presentation
- Canonical deck structure is defined in slides/00-outline.md
- Slide templates are in .github/slide-templates/
- Slides are slide content, NOT documentation
- Spring GraphQL information must follow ONLY:
  https://docs.spring.io/spring-graphql/reference/index.html

Task — Act 1 Only:
Generate slide content for ACT 1 of the presentation:
- Slides included in Act 1 are those marked as Act 1 in slides/00-outline.md
- Do NOT generate slides outside Act 1

Process (MANDATORY):
Step 1 — Presentation Architect
- Read slides/00-outline.md
- For each Act 1 slide:
  - Use the exact filename specified
  - Use the specified slide template
  - Generate slide content + speaker notes
  - Keep titles short and slide-like
  - Follow all template headings exactly

Step 2 — Spring GraphQL Expert
- Review ONLY the generated slides
- Verify:
  - Architectural correctness
  - Spring GraphQL correctness against the official reference
- If something is incorrect or misleading:
  - Correct it directly in the slide content
  - Do NOT add commentary

Output Rules:
- Output each slide as a separate file block
- Start each block with:
  === FILE: slides/<filename>.md ===
- Output ONLY file contents
- No explanations
- No summaries
- No markdown fences
```

"Using the presentation-architect, please create a first cut for the sheets in act 2"
>> “Using the presentation-architect agent and the code-to-slide skill, turn this test into 2 slides with speaker notes.”

Or:

“As spring-graphql-expert, explain what architectural decision this test implies.”

Or:

“Apply demo-storytelling to this test and outline a 3‑step live demo.”

This setup turns your IDE into a presentation workbench, not just a code editor.

--

When creating diagrams, use this prompt:

```text
You are acting as Presentation Architect.

Apply the diagram-as-code skill.

Task:
- Create a Mermaid diagram explaining GraphQL query execution
- Scope: one client request, schema, resolvers, DataLoader
- Audience: experienced Spring developers
- Output must fit on a single slide

Output rules:
- Produce ONLY the contents of:
  diagrams/graphql/query-execution-flow.mmd
- No explanation
- No slide content
```

Afterwards, optionally verify the diagram with the Spring GraphQL Expert:

```
Act as Spring GraphQL Expert.

Review the Mermaid diagram in diagrams/graphql/query-execution-flow.mmd.
Verify accuracy against the Spring GraphQL reference.
Correct the diagram if needed.
Output corrected diagram only.
```


 Best workflow: two-stage generation (diagram first, then slide)
 
1) Have the Presentation Architect create the diagram file
   ```
   Act as Presentation Architect.
   
   Apply the diagram-as-code skill.
   
   Task:
   - Create a Mermaid diagram for <topic>
   - Store it as: diagrams/<area>/<short-name>.mmd
   - The diagram must fit on one slide
   
   Output rules:
   - Output ONLY:
     === FILE: diagrams/<area>/<short-name>.mmd ===
     <file contents>
   - No commentary
   ```
2) Have the Presentation Architect create the diagram file
   ```
   Act as Presentation Architect.
   
   Create slides/<act-folder>/<nn-short-name>.md using slide-image.md.
   In the Visual section, reference:
   [DIAGRAM: diagrams/<area>/<short-name>.mmd]
   
   Output ONLY the slide file content.
   ```
3) Verify the diagram with the Spring GraphQL Expert
   ```
   Act as Spring GraphQL Expert.
   
   Review diagrams/graphql/<name>.mmd for correctness.
   Correct only what is inaccurate.
   Output ONLY the corrected diagram file content.
   ```
   


### Rendering the presentation
“Create the architecture slide using the image template.
Generate diagrams/architecture/layers.mmd and reference 
diagram-assets/architecture/layers.svg.
Apply the diagram-as-code with rendered assets skill.”


## Diagram Rendering & Version Control

### Hash-Based Rendering (Prevents Unnecessary Updates)

The `render-diagrams.sh` script uses **per-file SHA-256 hashing** to avoid re-rendering diagrams that haven't changed:

1. **How it works**
   - Computes SHA-256 hash of each source `.mmd` and `.puml` file
   - Stores hash in a `.sha256` sidecar file (co-located with source)
   - Only re-renders if source changed, output missing, or no stored hash
   - Updates sidecar hash file after successful render

2. **For collaborators**
   - `.sha256` sidecar files ARE committed to git — shared baseline prevents re-renders
   - Running `npm run render:diagrams` will skip unchanged diagrams for all collaborators
   - SVG files only appear modified in git when diagrams actually changed

3. **Best practice**
   - Commit `.mmd`/`.puml` sources, `.sha256` sidecar hashes, and `.svg` rendered output together
   - This ensures deterministic, collaborative builds

### Workflow

```bash
npm run render:diagrams
npm run present
```

The build pipeline:
1. Checks source diagram hashes against local sidecar files
2. Only re-renders changed diagrams
3. Validates all referenced diagrams exist
4. Copies Reveal.js assets
5. Aggregates slides into `reveal/slides.md`
6. Serves presentation on http://localhost:8000


---

### Presentation update

I have fetched sources from git upstream.
Using the presentation-architect and the spring-graphql-expert sub-agent, 
check the latest sources vs the presentation if and where the presentation 
should be updated (4 commits)

--- 

A colleague has worked on the presentation and made some updates.
Useful updates regarding micro frontends were added.
As presentation-architect please review the flow of the presentation 
and suggest potential restructuring alternative to make the flow
natural and engaging.

---

As presentation-architect and demo-narrator now please review the flow of the presentation, especially regarding subscriptions if the flow
is still natural and engaging. Furthermore as graphql-expert verify for correctness

As presentation-architect and demo-narrator now please review the flow of the presentation, especially regarding the number of payoff slides. The suggestion from attendee was that there were about eight of them. Make sure that the flow remains  natural and engaging. Create a proposal and use the graphql-expert to verify for correctness