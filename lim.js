require("dotenv").config();
const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://api.neynar.com/v2/farcaster";

const headers = {
  accept: "application/json",
  "content-type": "application/json",
  api_key: process.env.NEYNAR_API_KEY,
};

// ─────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function now() {
  return new Date().toLocaleString("id-ID");
}

function generateReply(text) {
  if (text.includes("halo") || text.includes("hello") || text.includes("hi")) {
    return "Halo! 👋 Saya bot otomatis. Ada yang bisa dibantu?";
  }
  if (text.includes("bot")) {
    return "Ya, saya bot! 🤖 Dibuat dengan Node.js + Neynar API.";
  }
  return null;
}

// ─────────────────────────────────────────
// 1. POST CAST
// ─────────────────────────────────────────
async function postCast(text, options = {}) {
  const { channelId, embedUrl, replyTo } = options;

  const payload = {
    signer_uuid: process.env.SIGNER_UUID,
    text,
  };

  if (channelId) payload.channel_id = channelId;
  if (embedUrl) payload.embeds = [{ url: embedUrl }];
  if (replyTo) payload.parent = replyTo;

  try {
    const res = await axios.post(`${BASE_URL}/cast`, payload, { headers });
    console.log(`✅ [${now()}] Cast berhasil → hash: ${res.data.cast.hash}`);
    return res.data.cast;
  } catch (err) {
    console.error(`❌ [${now()}] Gagal post:`, err.response?.data || err.message);
  }
}

// ─────────────────────────────────────────
// 2. RECAST
// ─────────────────────────────────────────
async function recast(castHash) {
  const payload = {
    signer_uuid: process.env.SIGNER_UUID,
    reaction_type: "recast",
    target: castHash,
  };

  try {
    await axios.post(`${BASE_URL}/reaction`, payload, { headers });
    console.log(`🔁 [${now()}] Recast berhasil → ${castHash}`);
  } catch (err) {
    console.error(`❌ [${now()}] Gagal recast:`, err.response?.data || err.message);
  }
}

// ─────────────────────────────────────────
// 3. LIKE CAST
// ─────────────────────────────────────────
async function likeCast(castHash) {
  const payload = {
    signer_uuid: process.env.SIGNER_UUID,
    reaction_type: "like",
    target: castHash,
  };

  try {
    await axios.post(`${BASE_URL}/reaction`, payload, { headers });
    console.log(`❤️  [${now()}] Like berhasil → ${castHash}`);
  } catch (err) {
    console.error(`❌ [${now()}] Gagal like:`, err.response?.data || err.message);
  }
}

// ─────────────────────────────────────────
// 4. CEK NOTIFIKASI & AUTO-REPLY
// ─────────────────────────────────────────
async function checkAndReply() {
  try {
    const res = await axios.get(`${BASE_URL}/notifications`, {
      headers,
      params: { fid: process.env.FID, type: "mentions,replies" },
    });

    const notifications = res.data.notifications || [];
    console.log(`🔔 [${now()}] ${notifications.length} notifikasi ditemukan`);

    for (const notif of notifications) {
      const cast = notif.cast;
      if (!cast) continue;

      const text = cast.text?.toLowerCase() || "";
      const replyText = generateReply(text);

      if (replyText) {
        await postCast(replyText, { replyTo: cast.hash });
        await sleep(2000);
      }
    }
  } catch (err) {
    console.error(`❌ [${now()}] Gagal cek notifikasi:`, err.response?.data || err.message);
  }
}

// ─────────────────────────────────────────
// 5. FETCH DATA EKSTERNAL & POST
// ─────────────────────────────────────────
async function postExternalData() {
  try {
    const res = await axios.get("https://api.quotable.io/random");
    const { content, author } = res.data;

    const text = `💬 "${content}"\n\n— ${author}\n\n#quote #daily`;
    await postCast(text);
  } catch (err) {
    console.error(`❌ [${now()}] Gagal fetch data eksternal:`, err.message);
  }
}

// ─────────────────────────────────────────
// 6. SEARCH & AUTO-ENGAGE KEYWORD
// ─────────────────────────────────────────
async function engageWithKeyword(keyword) {
  try {
    const res = await axios.get(`${BASE_URL}/cast/search`, {
      headers,
      params: { q: keyword, limit: 5 },
    });

    const casts = res.data.result?.casts || [];
    console.log(`🔍 [${now()}] ${casts.length} cast ditemukan untuk keyword: "${keyword}"`);

    for (const cast of casts) {
      await likeCast(cast.hash);
      await sleep(1500);
    }
  } catch (err) {
    console.error(`❌ [${now()}] Gagal engage:`, err.response?.data || err.message);
  }
}

// ─────────────────────────────────────────
// 7. POST THREAD (MULTI-CAST)
// ─────────────────────────────────────────
async function postThread(messages) {
  let parentHash = null;

  console.log(`🧵 [${now()}] Memulai thread (${messages.length} cast)...`);

  for (let i = 0; i < messages.length; i++) {
    const cast = await postCast(messages[i], { replyTo: parentHash });
    parentHash = cast?.hash || null;
    console.log(`   └─ [${i + 1}/${messages.length}] terkirim`);
    await sleep(2000);
  }
}

// ─────────────────────────────────────────
// 8. BACA & POST DARI post.txt
// ─────────────────────────────────────────
async function postFromFile(asThread = false) {
  const filePath = path.join(__dirname, "post.txt");

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  [${now()}] File post.txt tidak ditemukan.`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8").trim();

  if (!content) {
    console.log(`⚠️  [${now()}] post.txt kosong, tidak ada yang diposting.`);
    return;
  }

  // Pisah pesan berdasarkan separator ---
  const messages = content
    .split("---")
    .map((msg) => msg.trim())
    .filter((msg) => msg.length > 0);

  console.log(`📄 [${now()}] Ditemukan ${messages.length} pesan di post.txt`);

  if (asThread) {
    // Post sebagai thread (saling reply)
    await postThread(messages);
  } else {
    // Post sebagai cast terpisah
    console.log(`📢 [${now()}] Mode: Cast Terpisah`);
    for (let i = 0; i < messages.length; i++) {
      await postCast(messages[i]);
      console.log(`   ✅ [${i + 1}/${messages.length}] terkirim`);
      await sleep(2000);
    }
  }

  // Kosongkan file setelah semua terkirim
  fs.writeFileSync(filePath, "");
  console.log(`🗑️  [${now()}] post.txt dikosongkan setelah posting.`);
}

// ─────────────────────────────────────────
// JADWAL CRON
// ─────────────────────────────────────────
console.log("🤖 Farcaster Bot aktif!\n");

// Cek post.txt setiap 10 menit → posting sebagai thread
cron.schedule("*/10 * * * *", () => {
  console.log(`⏰ [${now()}] Cek post.txt...`);
  postFromFile(true); // ganti false jika tidak mau thread
});

// Post quote eksternal setiap hari jam 08:00
cron.schedule("0 8 * * *", () => {
  console.log(`📅 [${now()}] Jadwal pagi: posting quote...`);
  postExternalData();
});

// Cek notifikasi & auto-reply setiap 5 menit
cron.schedule("*/5 * * * *", () => {
  checkAndReply();
});

// Auto-engage keyword setiap jam
cron.schedule("0 * * * *", () => {
  engageWithKeyword("nodejs");
  engageWithKeyword("farcaster");
});

// ── Uncomment baris di bawah untuk test manual saat bot start ──
// postCast("🤖 Bot aktif! Dibangun dengan Node.js 🚀 #bot");
// postFromFile(true);
