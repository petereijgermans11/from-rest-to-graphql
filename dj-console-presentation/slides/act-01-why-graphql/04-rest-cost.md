<!-- .slide: data-background-image="theme/background-images/01-title-background.jpg" data-background-size="cover" data-background-opacity="0.20" -->
# The REST Tax

One endpoint. One fixed fat shape. Every client gets everything — whether they need it or not.

<div style="display:flex; flex-direction:column; align-items:center; gap:0.5em; margin-top:0.6em; height:52vh; box-sizing:border-box;">

  <button id="rest-fetch-btn"
     onclick="(function(){
    var btn = document.getElementById('rest-fetch-btn');
    var pre = document.getElementById('rest-response-box');
    btn.disabled = true;
    btn.textContent = '⏳  fetching…';
    fetch('http://localhost:4200/api/sessions/current')
      .then(function(r){ return r.json(); })
      .then(function(d){
        pre.style.color = '#f8f8f2';
        pre.textContent = JSON.stringify(d, null, 2);
        btn.textContent = '🔄  reload';
        btn.style.opacity = '0.55';
        btn.style.animation = 'none';
        btn.disabled = false;
      })
      .catch(function(e){
        pre.style.color = '#ff6b6b';
        pre.textContent = '⚠  Could not reach localhost:8080 — is the backend running?';
        btn.textContent = '🔄  retry';
        btn.style.opacity = '1';
        btn.disabled = false;
      });
  })()"
     style="display:inline-block; padding:0.5em 1.8em; border-radius:14px;
            background:rgba(251,191,36,0.15); border:2px solid #fbbf24;
            color:#fbbf24; font-size:1.0em; font-weight:700; cursor:pointer;
            letter-spacing:0.05em; flex-shrink:0;
            box-shadow:0 0 22px rgba(251,191,36,0.4), 0 0 6px rgba(251,191,36,0.2);
            animation:pulse-glow-amber 2s ease-in-out infinite;">
    🌐 &nbsp; GET /api/sessions/current
  </button>

  <pre id="rest-response-box"
       style="background:#272822; color:#9090aa;
              border:1px solid #3a3a4a; border-radius:5px;
              font-size:0.62em; padding:0.6em 0.8em; width:96%;
              height:44vh; overflow-y:auto; flex-shrink:0; flex-grow:1;
              white-space:pre; font-family:monospace; margin:0;">// live response — click button above to load</pre>

</div>

## Speaker notes
<!-- DELIVERY CUE — read the title, pause. Click the button. Let the JSON load. Say nothing for 3 seconds — let the audience absorb the shape.

- The cost
  - One call — sounds efficient — but the shape is fixed server-side, always
  - Mobile app needs only `status`? Receives the full track list + cue points anyway
  - Dashboard needs only `energyLevel`? Gets DJ name, library count, event timeline too
  - `crowdEventTimeline` — polymorphic crowd events: cheers, song requests, energy votes — useful for analytics, useless for a UI that shows only now-playing

- What to point out in the response
  - `lengthIso8601` — ISO-8601 duration on every track; a projector vote screen never uses this
  - Every field always returned — no opt-out, no projection, no `?fields=` in plain Spring MVC
  - REST: server decides the shape; every consumer adapts or ignores

- Demo caveat (internal)
  - If `crowdEventTimeline` is empty at demo time, narrate: "by the time the crowd votes arrive, this array grows — and every client still receives it"
  - `apiStyle` field exists in the real JSON but is intentional demo meta — don't mention it

BRIDGE — "There has to be a better way. What if the client could write the question?" -->


