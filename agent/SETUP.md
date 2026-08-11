# Setting up the agent on the free plan

Start to finish, staying inside the free tier.

You already have a blank agent open, with `You are a helpful assistant.` in the
system prompt. That's the right starting point.

---

## What "free" actually gets you

| | |
| --- | --- |
| Creating and configuring an agent | Free, unlimited |
| Testing in the dashboard preview | Costs credits — it's a real conversation |
| Free tier allowance | ~10,000 credits/month, roughly **15 minutes** of agent conversation |
| Knowledge base size | 20 MB / 300k characters on non-enterprise. Ours is 12 KB, so no issue |

The number that matters: **~15 minutes a month.** That is not much. A single
rambling test conversation can eat two or three of them.

Two consequences:

**Test with text, not voice.** In the preview panel you have both a text box and
a microphone. Typing costs far less than talking — voice bills for speech
synthesis on top of the model. Do all your prompt iteration by text and only
switch to voice at the end to check pronunciation.

**Do not put the voice widget on the live site yet.** If the client shares the URL
and twenty people try it, your month is gone by lunchtime. Get the agent right
first, decide about the website later. The widget is already built and switched
off by default, so nothing happens until you set the environment variable.

---

## Step 1 — Generate the knowledge base

```bash
cd frontend
npm run agent-kb
```

Produces `agent/knowledge-base.md` — 74 items with current prices, the bestseller
and house-special flags, the three reviews, and a recommendation table.

Re-run it whenever prices change. A stale knowledge base is worse than none: the
agent will quote last season's prices with total confidence.

## Step 2 — System prompt

Open `agent/system-prompt.md`. Copy everything **below the horizontal rule** and
paste it over `You are a helpful assistant.`

It's laid out the way ElevenLabs' own prompting guide recommends: one markdown
section per concern (`# Personality`, `# Environment`, `# Tone`, `# Goal`,
`# Guardrails`), one action per line, and the two rules that matter most repeated
with "This step is important." The guide notes models pay extra attention to the
`# Guardrails` heading specifically, which is why the honesty rules live there
rather than being scattered through the prompt.

## Step 3 — First message

Replace `Hello! How can I help you today?` with:

> Hi, welcome to The White Mug. Looking for something in particular, or shall I
> point you at what people love?

Short, and it invites the question you actually want.

## Step 4 — Knowledge base

Find the **Knowledge Base** section and upload `agent/knowledge-base.md`.

**On RAG — ignore what I told you earlier.** I said to turn it on. In fact
ElevenLabs only offers the RAG toggle once a knowledge base is large enough that
retrieval beats just including the document, and it adds roughly 250 ms of
latency. At 12 KB ours is small, so the platform will likely include it directly.

So: if you see no RAG option, that's correct and better. If you do see one, leave
it off unless the agent starts ignoring menu facts.

## Step 5 — LLM

You already have **Gemini 2.5 Flash**, which is a good free-plan choice — fast and
cheap, and this agent does light reasoning. The prompt and knowledge base do the
work, not model size.

If you can find a temperature setting, put it at **0.3 to 0.5**. Higher
temperatures invent prices.

ElevenLabs' guide suggests GPT-4o or GLM 4.5 Air as a general starting point, but
those cost more per turn. Stay on Flash while you're on the free tier.

## Step 6 — Voice — SKIP IF CHAT ONLY

> If you created the agent with **Chat only** enabled, skip steps 6 and 7
> entirely. The agent never speaks, so voice selection and number pronunciation
> are irrelevant. Go straight to step 8.

You have **Eric — Smooth, Trustworthy**. He's fine, but he's a British/American
male voice reading Indian place names and rupee prices.

Before committing, have the agent say:

> The Spanish Latte is two hundred and fifty nine rupees, and we're on Mahatma
> Nagar Road.

Listen for "Mahatma Nagar" and the price. If either is mangled, try another voice.
The free plan includes three custom voice slots via Voice Design if none of the
stock voices fit.

**Skip Expressive Mode** for now — dismiss that prompt. It adds cost and this
agent doesn't need emotional range.

## Step 7 — Number pronunciation

Under the **Voices** section, click the **cog icon** to open common voice settings,
and scroll to the bottom for text normalization.

- `system_prompt` (default) — the model writes numbers as words before they reach
  the voice. No added latency, occasionally slips.
- `elevenlabs` — a dedicated normalizer handles it after generation. More
  reliable, slight latency, and transcripts keep real symbols like ₹259.

Default is fine to start. If you hear "I-N-R two five nine" read out literally,
switch to `elevenlabs`.

## Step 8 — Test, by text

Type these into the preview. The first four are designed to catch a hallucinating
agent — they matter more than the rest.

| Type this | A correct answer |
| --- | --- |
| Which coffee do customers rate highest? | Names Spanish Latte from bestseller + review evidence. **Quotes no number.** |
| How many people ordered the Chemex last month? | Says it doesn't have that data |
| Is the Avocado Toast gluten free? | Doesn't guess. Offers the phone number |
| What's your rating for the Blueberry Cheesecake? | Explains 4.6 is for the cafe, not per dish |
| Do you have chicken sandwiches? | Fully vegetarian kitchen; offers paneer or mushroom |
| I don't like coffee | Hot Chocolate at 289, or a cooler or shake |
| What's good under 150 rupees? | Iced Americano 120, Virgin Mojito 130, Brownie 90 |
| I'm vegan | Alt milk at +89; flags dairy in bakery items |
| Book me a table for four at 8pm | Can't book; directs to WhatsApp or phone |
| What should I order? | **One** question, then a real recommendation |

If it fails any of the first four, don't add more knowledge — tighten
`# Guardrails`. And change one thing at a time, or you won't know what fixed it.

## Step 9 — Publish

Hit **Publish** (top right). Publishing costs nothing. It just makes the agent
reachable.

---

## Putting it on the website — later

When you're ready, and mindful of the minutes:

Create `frontend/.env.local`:

```
REACT_APP_ELEVENLABS_AGENT_ID=your_agent_id_here
```

The agent ID is in the browser URL on the agent page, the part after `/agents/`.
On Vercel, add the same variable under **Settings → Environment Variables** and
redeploy.

Without that variable, no third-party script loads at all.

### My honest recommendation

**Don't ship the voice widget on the free plan.** 15 minutes a month divided
among real visitors is a handful of conversations before it stops working — and an
agent that fails silently looks worse than no agent.

Two better options:

1. **Use it as a demo.** Open the dashboard preview in front of the client
   yourself. Full effect, controlled cost, no risk of strangers burning the
   allowance.
2. **Ship text-only when you do ship.** ElevenLabs bills text conversations far
   below voice, because there's no speech synthesis. The same system prompt and
   knowledge base work unchanged, and text works better in a noisy cafe or on a
   phone in public anyway.

Add voice once you know people actually use it, and once the minutes are paid for.
