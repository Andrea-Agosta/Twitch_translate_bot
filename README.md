# Twitch chat translator bot

This project runs a **small program on your computer** that watches a Twitch channel’s chat. When someone writes in a language that is **not English**, the program asks a local AI (running on your machine) to translate it, then the bot posts the English version in chat.

You do **not** need to know how to code. Follow the steps in order. If something fails, jump to [When something goes wrong](#when-something-goes-wrong).

---

## What you need first (read this once)

1. **A Twitch account for the bot**  
   Many people create a **second** Twitch account (for example `MyChannelTranslator`) that will *only* run the bot. You log in with **your** normal account; the bot uses **its own** login.

2. **Permission to post in the channel**  
   The bot account must be able to chat in the channel you choose (for example: follow the channel if chat is followers-only, or ask the streamer to allow the bot).

3. **A computer that can run the AI**  
   The translations use **Ollama** with the **llama3.2** model. That needs a reasonably modern PC or Mac (the first download of the model can be **large** and take time). If the PC is very old or very weak, translations may be slow or fail.

4. **Two ways to run everything** (pick **one**):

   | | **Local (Ollama on your PC)** | **Docker (everything in containers)** |
   |---|---|---|
   | **Best if** | You are okay installing Node.js and Ollama like normal apps | You prefer one “package” (Docker) that starts both the bot and Ollama together |
   | **You install** | Node.js + Ollama | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |

Both versions use the same **`.env`** file with your Twitch settings (explained below).

---

## Step 1 — Get the project on your computer

**Option A — Download ZIP (easiest if you don’t use Git)**  
1. On GitHub, open this repository.  
2. Click the green **Code** button → **Download ZIP**.  
3. Unzip the folder somewhere you remember (for example `Documents` → `Twitch_translate_bot`).

**Option B — Git clone (if you already use Git)**  
Open a terminal in the folder where you keep projects and run:

```bash
git clone https://github.com/Andrea-Agosta/Twitch_translate_bot.git
cd Twitch_translate_bot
```

From now on, all paths mean “inside this project folder”.

---

## Step 2 — Create a Twitch “password” for the bot (OAuth token)

The bot needs a **special login key** so it can connect to Twitch chat. This is **not** your normal Twitch password.

1. Log in to Twitch as **the bot account** (the account that will send translations).
2. Open a **Twitch chat token generator** in your browser. A common one is:  
   [https://twitchtokengenerator.com/](https://twitchtokengenerator.com/)  
   (If that site changes or is down, search for “Twitch chat token generator” and pick one that mentions **OAuth** and **chat** scopes.)
3. Choose something like **“Chat Bot”** or select scopes that include at least:
   - **Read chat**
   - **Send chat messages**  
   (Names may vary slightly; the goal is: the bot can **read** and **write** in chat.)
4. Generate the token. You should get a string that often starts with **`oauth:`**.  
   **Keep this secret.** Anyone with the token can use the bot account in chat.

Write down three things (you will paste them into `.env` in the next section):

- **Bot username** — the Twitch login name of the bot, **lowercase**, no `@`.
- **OAuth token** — the full token including the `oauth:` part (if the site shows it without `oauth:`, many setups need you to add `oauth:` in front — follow what your token tool says).
- **Channel** — the streamer’s channel name **only**, lowercase, no `#` and no `twitch.tv/`.  
  Example: for `https://www.twitch.tv/giantwaffle` the channel is `giantwaffle`.

---

## Step 3 — Create your `.env` file

1. In the project folder, create a new file named **`.env`** (the name starts with a dot).
2. Put exactly these three lines inside (replace the values with yours):

```env
TWITCH_USERNAME=your_bot_username
TWITCH_OAUTH=oauth:your_token_here
TWITCH_CHANNEL=channel_name_lowercase
```

**Examples (fake):**

```env
TWITCH_USERNAME=mychanneltranslator
TWITCH_OAUTH=oauth:abcdefghijklmnopqrstuvwxyz123456
TWITCH_CHANNEL=myfriendstream
```

Save the file. **Never** upload `.env` to the internet or share it in Discord — it is like a password.

---

## Version 1 — Run locally with Ollama (Node.js on your PC)

### 1. Install Node.js

1. Go to [https://nodejs.org/](https://nodejs.org/) and download the **LTS** version for your system (Windows, Mac, or Linux).  
2. Run the installer with the default options.  
3. To check it worked: open **Terminal** (Mac/Linux) or **Command Prompt / PowerShell** (Windows) and run:

```bash
node -v
```

If you see a version number (for example `v22.x.x`), you are good.

### 2. Install Ollama

1. Go to [https://ollama.com/](https://ollama.com/) and download Ollama for your system.  
2. Install and **start Ollama** (on many computers it runs in the background after install).

### 3. Download the AI model (first time only)

Open a terminal and run:

```bash
ollama pull llama3.2
```

Wait until it finishes. This can take a while and uses disk space.

### 4. Install project dependencies and start the bot

In a terminal, **go into the project folder**, then run:

```bash
npm install
npm run dev
```

You should see logs that the server is running and the bot started. **Leave this window open** while you want the bot online.

- The app listens on **port 8080** by default (that is normal; the bot still talks to Twitch chat).
- Ollama is expected at **`http://localhost:11434`** unless you set `OLLAMA_URL` in `.env`.
- Optional in `.env`: `OLLAMA_MODEL=llama3.2` if you want to be explicit (this is already the default in code).

### 5. Stop the bot

In the same terminal window, press **Ctrl+C** (Mac/Windows/Linux).

### Optional: run a built version (slightly more “production”)

```bash
npm install
npm run build
npm start
```

---

## Version 2 — Run with Docker (bot + Ollama together)

Docker runs the bot and Ollama in **isolated boxes** so you don’t install Node or Ollama directly on your system (except Docker itself).

### 1. Install Docker Desktop

1. Download from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/).  
2. Install and **start Docker Desktop**. Wait until it says it is running.

### 2. Make sure `.env` exists

Same **Step 3** as above: `.env` in the project folder with `TWITCH_USERNAME`, `TWITCH_OAUTH`, `TWITCH_CHANNEL`.

### 3. Start everything

Open a terminal in the project folder and run:

```bash
docker compose up -d --build
```

- **First time only**, download the model into Docker’s Ollama (can take several minutes):

```bash
docker compose exec ollama ollama pull llama3.2
```

After that, the bot container is already configured to use Ollama at `http://ollama:11434` and model `llama3.2` (see `docker-compose.yml`).

### 4. See if it is working (logs)

```bash
docker compose logs -f bot
```

Press **Ctrl+C** to stop watching logs (the bot keeps running).

### 5. Stop Docker when you are done

```bash
docker compose down
```

---

## When something goes wrong

| Problem | What to try |
|--------|-------------|
| **Bot never appears in chat** | Check `.env` spelling; bot account must be able to chat in that channel; regenerate OAuth if the token was leaked or expired. |
| **“Translation error” in the terminal / logs** | Is Ollama running? For local: run `ollama serve` or open the Ollama app. For Docker: `docker compose ps` — both `ollama` and `bot` should be “Up”. Did you run `ollama pull llama3.2`? |
| **Docker: bot starts before Ollama is ready** | Wait a minute after `docker compose up`, then check logs again; pull the model if you skipped that step. |
| **Port 8080 already in use** | Another program is using 8080; close that program or change the port in the code / compose (advanced). |
| **Commands like `npm` or `docker` not found** | Node or Docker is not installed or not in your PATH — reinstall and restart the terminal / computer. |

---

## What the bot actually does (short)

- It **ignores** its own messages, very short messages, messages starting with `!`, and some safety filters.
- If the text looks **English**, it does nothing.
- Otherwise it asks the local model to **translate to English** and posts something like:  
  `ImTyping @username said in Italian 🇮🇹 [ English text here ]`  
  (Exact wording and emoji depend on language detection.)

---

## For developers

- **Dev:** `npm run dev` (TypeScript via `ts-node`).  
- **Build:** `npm run build` → `npm start` runs `dist/server.js`.  
- **Docker scripts:** `npm run docker:up`, `docker:up:build`, `docker:down`, `docker:logs` (see `package.json`).

Environment variables:

- **Required:** `TWITCH_USERNAME`, `TWITCH_OAUTH`, `TWITCH_CHANNEL`
- **Optional:** `OLLAMA_URL` (default `http://localhost:11434`), `OLLAMA_MODEL` (default `llama3.2`)

---

If you tell someone else how to install this, send them this README and remind them: **never share their OAuth token**.
