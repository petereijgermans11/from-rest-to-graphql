## Spring I/O 2026 - REST vs GraphQL demo

---
Voor een presentatie over GraphQL met als deel van het abstract "REST can become
a burden: endpoints multiply, versioning becomes messy, and clients receive too
much (or too little) data. Maybe it’s time to wake up and stop REST-ing, and
migrate Spring GraphQL" wil ik een demo maken over een DJ-console. Ik heb een
simpel domain model hiervoor verzonnen (model.zip). Kun je een paar (3 tot max
5) API-calls verzinnen om mee te beginnen.

----

Je model leent zich heel goed voor een event-driven DJ set, dus je kunt in je
demo mooi laten zien hoe GraphQL precies de data teruggeeft die de client nodig
heeft. Hieronder staan 5 simpele maar krachtige calls (queries + mutations) die
goed passen bij je domain en een demo van GraphQL vs REST ondersteunen.

Ik heb ze zo gekozen dat je kunt laten zien:
•	nested data ophalen
•	precies de velden kiezen
•	mutaties die domeinlogica triggeren
•	events toevoegen en resultaat zien

----

1. Huidige mix session ophalen

Client wil weten wat er nu draait + status van de set.

GraphQL query

query CurrentMixSession {
mixSession {
status
dj {
name
}
tracks {
song {
title
artist {
name
}
}
energyLevel
}
}
}

Waarom goed voor demo

Met REST zou je mogelijk nodig hebben:
GET /mixSession
GET /tracks
GET /artists/{id}

GraphQL → één call.




2. Alleen de huidige track ophalen

Mobile UI wil alleen het huidige nummer tonen.

GraphQL query

query CurrentTrack {
mixSession {
tracks(last: 1) {
song {
title
artist {
name
}
}
energyLevel
}
}
}

Demo punt

Laat zien dat de client alleen deze velden vraagt.

REST zou waarschijnlijk teruggeven:
track
length
cuePoints
energyLevel
song
artist
etc

→ overfetching


3. Cue points van een track ophalen

DJ interface wil cue points tonen op de waveform.

GraphQL query

query TrackDetails($title: String!) {
track(title: $title) {
song {
title
}
cuePoints {
label
elapsedTime
}
}
}

Demo punt

UI bepaalt zelf welke velden nodig zijn.

⸻

4. Crowd event registreren

De crowd reageert → systeem kiest automatisch het volgende nummer.

GraphQL mutation

mutation CrowdCheered {
crowdCheered {
mixSession {
status
tracks(last: 1) {
song {
title
}
energyLevel
}
}
}
}

Demo flow

1️⃣ Crowd cheers
2️⃣ mutation
3️⃣ backend kiest volgende track via applyEvent()
4️⃣ nieuwe track terug

Mooi voorbeeld van domain-driven mutation.

⸻

5. Audience request

Iemand vraagt een nummer aan.

GraphQL mutation

mutation RequestTrack($title: String!) {
requestFromAudience(trackName: $title) {
mixSession {
tracks(last: 1) {
song {
title
artist {
name
}
}
}
}
}
}

Demo punt

Laat zien:
•	GraphQL mutation
•	Domain logic (findTrackByTitle)
•	fallback naar DJ logic

⸻

Mooie demo-flow voor je talk

1️⃣ Query mix session

→ toon huidige tracks

2️⃣ Query current track

→ DJ UI

3️⃣ Crowd event

→ mutation crowdCheered

→ nieuwe track

4️⃣ Audience request

→ mutation requestFromAudience

⸻

💡 Extra tip voor je presentatie

Begin met een REST slide:
GET /mixSession
GET /mixSession/tracks
GET /tracks/{id}/cuepoints
POST /mixSession/events

Daarna GraphQL:

POST /graphql



→ met verschillende queries.

Dat maakt je “stop REST-ing” grap meteen duidelijk 😄

⸻

Als je wilt kan ik ook nog helpen met:
•	een GraphQL schema (SDL) voor je model
•	een Spring GraphQL demo schema + resolvers
•	of een live demo scenario van 5 minuten voor je presentatie.
	
	