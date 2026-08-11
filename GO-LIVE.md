# Go live — the whole thing, in order

Four parts. Do them in this order. Part 2 is the one your client actually needs;
parts 3 and 4 can wait if you're short on time.

| Part | What | Time |
| --- | --- | --- |
| 1 | Finish the chat agent in ElevenLabs | ~15 min |
| 2 | Put the website live | ~10 min |
| 3 | Connect the agent to the website | ~5 min |
| 4 | Test that nothing is broken | ~10 min |

---

# Part 1 — Finish the agent

You have a **Chat only** agent named "The White Mug". Chat only is the right
choice: it costs a fraction of voice, and it works better on a phone in a noisy
cafe.

## 1.1 Generate the knowledge base

```bash
cd frontend
npm run agent-kb
```

Writes `agent/knowledge-base.md` — all 74 items with live prices, the 6 bestseller
and 5 house-special flags, the 3 reviews, and a recommendation table.

Re-run this any time prices change.

## 1.2 System prompt

Open `agent/system-prompt.md`. Copy everything **below the horizontal rule**.

In ElevenLabs, select all of `You are a helpful assistant.` and paste over it.

## 1.3 First message

Replace `Hello! How can I help you today?` with:

```
Hi, welcome to The White Mug. Looking for something in particular, or shall I point you at what people love?
```

## 1.4 Knowledge base

Left sidebar → **Knowledge Base** → upload `agent/knowledge-base.md`.

If you're offered a **RAG** toggle, leave it **off**. The document is only 12 KB,
small enough to include directly, and RAG adds about 250 ms per reply. You may not
be offered it at all, which is fine and correct.

## 1.5 Settings to leave alone

| Setting | Do |
| --- | --- |
| LLM — Gemini 2.5 Flash | **Keep.** Fast, cheap, plenty for this |
| Language — English | Keep |
| Temperature (if you find it) | Set **0.3–0.5**. Higher invents prices |
| Voice / Expressive Mode | **Ignore entirely** — Chat only never speaks |

## 1.6 Test it, by typing

Use the chat panel on the right. These ten cover it. **The first four matter
most** — they're built to catch an agent that invents things.

| Type this | Correct answer |
| --- | --- |
| Which coffee do customers rate highest? | Names Spanish Latte from bestseller + review evidence, **with no invented number** |
| How many people ordered the Chemex last month? | Says it doesn't have that data |
| Is the Avocado Toast gluten free? | Won't guess; gives +91 95611 66185 |
| What's your rating for the Blueberry Cheesecake? | Explains 4.6 is the cafe's rating, not per dish |
| Do you have chicken sandwiches? | Fully vegetarian kitchen; offers paneer or mushroom |
| I don't like coffee | Hot Chocolate ₹289, or a cooler or shake |
| What's good under 150 rupees? | Iced Americano ₹120, Virgin Mojito ₹130, Brownie ₹90 |
| I'm vegan | Alt milk +₹89; flags dairy in bakery items |
| Book me a table for four at 8pm | Can't book; points to WhatsApp or phone |
| What should I order? | **One** question, then a real recommendation |

If any of the first four fail, tighten the `# Guardrails` section rather than
adding more knowledge. Change one thing at a time.

## 1.7 Publish

**Publish** (top right). Free, and it's what makes the agent reachable.

## 1.8 Copy the agent ID

You need this for Part 3. It's in the page URL — the segment starting `agent_`:

```
elevenlabs.io/app/agents/agents/agent_XXXXXXXXXXXXXXXXXXXX?branchId=...
                                ^^^^^^^^^^^^^^^^^^^^^^^^^^
```

Copy just the `agent_...` part, without `?branchId=` or anything after it. It's
also under **Deploy → Widget** in the sidebar.

---

# Part 2 — Put the website live

Two routes. Pick one.

## Route A — Vercel via GitHub (recommended)

Push once, then every future change deploys itself.

```bash
git add -A
git commit -m "The White Mug: redesign, menu page, opening sequence, chat agent"
git push origin main
```

If git says it doesn't know who you are, pass identity for this commit only —
this doesn't touch your global config:

```bash
git -c user.name="Your Name" -c user.email="you@example.com" commit -m "..."
```

Then:

1. **vercel.com** → **Continue with GitHub**
2. **Add New… → Project** → pick `the-white-mug-nashik`
3. Authorise repository access when asked
4. **Set Root Directory to `frontend`** ← the one setting that matters
5. Leave the rest (it detects Create React App, `npm run build`, output `build`)
6. **Deploy**

You get a `something.vercel.app` URL in 2–4 minutes. Send that to your client.

**Why Root Directory matters:** the app lives in a subfolder, and Vercel reads
`vercel.json` from the root directory. Leave it at the repo root and the SPA
rewrite never applies, so `/menu` returns 404.

## Route B — Your shared hosting

```bash
cd frontend
npm run package
```

Gives you **`frontend/deploy/the-white-mug-YYYY-MM-DD.zip`** (5.14 MB). It runs
pre-flight checks first and refuses to package if something would break the
deploy.

Upload **the contents** into `public_html`, so `public_html/index.html` exists.
Easiest path is cPanel File Manager → upload zip → **Extract**.

**The one thing that will catch you:** `.htaccess` starts with a dot, so most FTP
clients hide it and it silently never uploads. Without it your homepage works and
`/menu` returns 404. In cPanel File Manager: Settings → Show Hidden Files.

Full detail, including subfolder installs, is in `DEPLOY.md`.

---

# Part 3 — Connect the agent to the website

The widget is already built into the site and **switched off**. It stays off until
you supply the agent ID.

## Locally

```bash
cd frontend
cp .env.example .env.local
```

Open `.env.local`, paste your ID:

```
REACT_APP_ELEVENLABS_AGENT_ID=agent_XXXXXXXXXXXXXXXXXXXX
```

Restart the dev server — CRA only reads env files at startup. A chat bubble
appears bottom-right.

## On Vercel

**Settings → Environment Variables** → add `REACT_APP_ELEVENLABS_AGENT_ID` with
the same value → **Redeploy**.

## On shared hosting

Put it in `.env.local`, then `npm run package` again and re-upload. The value is
compiled into the bundle at build time, so it must be set before you build.

## Should you switch it on at all?

Honest answer: **not yet, if you're on the free plan.**

Free tier is roughly 10,000 credits a month. Chat is much cheaper than voice, but
it isn't free — and if your client shares the link and thirty people try it, the
allowance goes in an afternoon. An agent that stops responding looks worse than no
agent.

What I'd do:

1. **Demo it yourself** from the ElevenLabs chat panel while showing the client
   the site. Full effect, zero risk.
2. Switch on the website widget once someone is paying for the minutes.

Leaving `REACT_APP_ELEVENLABS_AGENT_ID` unset means no third-party script is even
fetched. Nothing to undo later.

---

# Part 4 — Confirm nothing is broken

## The widget cannot affect your design — here's why

- It renders inside its **own shadow DOM**. CSS does not cross that boundary in
  either direction: it can't inherit or override your styles, and your Tailwind
  can't reach inside it.
- It sits in **one fixed-position div**, outside the document flow, so it cannot
  shift or resize any existing element.
- **z-index 998** — deliberately below the mobile dock (999) and the nav drawer
  (1000), so the bubble can never cover your own navigation.
- On phones it's lifted clear of the bottom dock and the safe-area inset.

## 60-second check after you switch it on

On a phone width (DevTools → iPhone 14 Pro Max):

- [ ] Chat bubble sits **above** the bottom dock, not on top of it
- [ ] Tap the hamburger — the nav drawer covers the bubble completely
- [ ] Scroll to the very bottom — dock and header both stay readable over the dark footer
- [ ] Open `/menu`, tap a card — the item sheet opens above the bubble

On desktop:

- [ ] Bubble bottom-right, clear of the footer
- [ ] `/menu` still shows four columns, category rail highlights as you scroll

## Site checklist, independent of the agent

- [ ] `/` loads, opening sequence plays (fresh tab — it plays once per page load)
- [ ] `/menu` loads directly by URL, and survives a hard refresh
- [ ] `/menu?show=best` filters to bestsellers
- [ ] Any nonsense URL shows the 404 page, not a server error
- [ ] Photographs load (if not: `.htaccess` didn't upload, or `public/img` wasn't committed)
- [ ] Reserve opens the WhatsApp flow
- [ ] Call links dial on a phone

## If something's wrong

| Symptom | Cause |
| --- | --- |
| `/menu` 404s | `.htaccess` didn't upload, or Vercel Root Directory isn't `frontend` |
| Blank page, JS 404s | Serving from a subfolder without `homepage` set |
| No images, rest fine | Host doesn't know AVIF — that's what `.htaccess` fixes |
| Chat bubble never appears | Env var not set, or set after the build. Check the browser console |
| Chat bubble covers the dock | Report it — `--dock-h` needs adjusting |
| Loading screen never clears | JS failed to load; check console. A 7s failsafe clears it regardless |

---

## Keeping it updated

```bash
cd frontend

# after changing prices or menu items
npm run agent-kb        # then re-upload to ElevenLabs

# after adding a photograph to backend/static/images/
npm run images
npm run photo-report    # 12 items still need real photos

# ship it
npm run package         # shared hosting: re-upload
git push                # Vercel: deploys itself
```
