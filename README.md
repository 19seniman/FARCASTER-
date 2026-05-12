# 🟣 FARCASTER AUTO-POST BOT

<div align="center">

```
███████╗ █████╗ ██████╗  ██████╗ █████╗ ███████╗████████╗███████╗██████╗
██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗
█████╗  ███████║██████╔╝██║     ███████║███████╗   ██║   █████╗  ██████╔╝
██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║╚════██║   ██║   ██╔══╝  ██╔══██╗
██║     ██║  ██║██║  ██║╚██████╗██║  ██║███████║   ██║   ███████╗██║  ██║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
```

**Automated casting bot for Farcaster — post on schedule, stay consistent, grow effortlessly.**

![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square&logo=nodedotjs)
![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)
![Farcaster](https://img.shields.io/badge/Farcaster-Protocol-8A63D2?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)

</div>

---

## 📌 What is This?

A lightweight, zero-fuss **Node.js bot** that automatically posts casts to your Farcaster account on a scheduled interval. Set it up once, drop your posts in a text file, and let it run — no babysitting required.

---

## 🚀 Quick Start

### Step 1 — Create a Farcaster Account

If you don't have one yet, sign up here:

> 🔗 **[https://farcaster.xyz/~/code/TEUE3P](https://farcaster.xyz/~/code/TEUE3P)**

Use the referral link above to join the network!

---

### Step 2 — Clone the Repository

```bash
git clone https://github.com/19seniman/FARCASTER-.git
cd FARCASTER-
```

---

### Step 3 — Install Dependencies

Install all required packages one by one:

```bash
npm install axios
npm install dotenv
npm install node-cron
```

Or install all at once:

```bash
npm install axios dotenv node-cron
```

---

### Step 4 — Configure Your Environment

Open the `.env` file to set your credentials:

```bash
nano .env
```

Fill in your details like this:

```env
NEYNAR_API_KEY=your_api_key
SIGNER_UUID=your_signer_uuid
FID=your_fid
```

> ⚠️ **Keep your `.env` file private. Never share your mnemonic with anyone.**

---

### Step 5 — Add Your Posts

Open `post.txt` and write the messages you want to cast:

```bash
nano post.txt
```

Add one post per line, for example:

```
Post 1

---

Post 2

---

Poat 3
```

---

### Step 6 — Run the Bot

```bash
node lim.js
```

The bot will start posting from your `post.txt` on the configured schedule. Sit back and let it work. 🎯

---

## 📁 Project Structure

```
FARCASTER-/
├── lim.js          # Main bot script
├── post.txt        # Your scheduled posts (one per line)
├── .env            # API credentials (keep this secret!)
├── package.json    # Project metadata & dependencies
└── README.md       # You are here
```

---

## 🛠️ Dependencies

| Package | Purpose |
|---|---|
| `axios` | HTTP requests to Farcaster API |
| `dotenv` | Load environment variables from `.env` |
| `node-cron` | Schedule automated posting |

---

## ⚙️ Requirements

- **Node.js** v18 or higher
- A valid **Farcaster account** with FID + mnemonic
- A server or VPS to keep the bot running 24/7 (optional but recommended)

---

---

## ⚠️ Disclaimer

This bot is for **personal use and automation only**. Use it responsibly and in accordance with [Farcaster's terms of service](https://farcaster.xyz). Spamming or abusing the protocol may result in account suspension.

---

## 🤝 Contributing

Pull requests are welcome! If you have ideas for features or improvements, feel free to open an issue or submit a PR.

---

## 📬 Contact & Community

Built by **[@19seniman](https://github.com/19seniman)**

Find me on Farcaster — let's connect on the protocol! 🟣

---

---

## 🍉 Donate for Watermelon

If this project helped you, consider buying me a watermelon! 🍉

**EVM Address:**
```
0xf01fb9a6855f175d3f3e28e00fa617009c38ef59
```

> Supports: ETH, BNB, MATIC, ARB, OP, BASE, and any EVM-compatible chain.

Your support keeps the bot alive and the watermelons fresh! 🙏

---

<div align="center">

**Made with 💜 for the decentralized social web**

*Star ⭐ this repo if it helped you!*

</div>
