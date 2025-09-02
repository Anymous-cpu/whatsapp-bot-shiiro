const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// Load pertanyaan fun
const funQuestions = require('./data/fun_questions.json');

// Inisialisasi client WhatsApp
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "shiiro-bot"
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});

// Variabel untuk menyimpan timer pertanyaan
const activeTimers = new Map();
const userAnswers = new Map();

// Event ketika QR code diperlukan
client.on('qr', (qr) => {
  console.log('QR Code received, scan it!');
  qrcode.generate(qr, { small: true });
});

// Event ketika client sudah ready
client.on('ready', () => {
  console.log('Shiiro Bot is ready!');
});

// Event ketika menerima pesan
client.on('message', async (message) => {
  try {
    const chat = await message.getChat();
    const contact = await message.getContact();
    const user = contact.pushname || contact.number;
    const text = message.body.toLowerCase().trim();
    
    // Reaksi emoji untuk semua perintah
    if (text.startsWith('.')) {
      await message.react('💤');
    }
    
    // Cek jika ada timer yang aktif untuk pengguna ini
    if (activeTimers.has(message.from)) {
      const answerData = userAnswers.get(message.from);
      if (answerData && text === answerData.answer.toLowerCase()) {
        clearTimeout(activeTimers.get(message.from));
        activeTimers.delete(message.from);
        userAnswers.delete(message.from);
        await message.reply(`🎉 *Benar!* Jawabannya adalah *${answerData.answer}*`);
        return;
      }
    }
    
    // Handle perintah
    if (text === '.menu') {
      // Delay sebelum mengirim pesan
      setTimeout(async () => {
        try {
          // Download video dari URL
          const videoUrl = 'https://files.catbox.moe/nis376.mp4';
          const media = await MessageMedia.fromUrl(videoUrl);
          
          // Kirim video
          await client.sendMessage(message.from, media, {
            caption: `Menu utama :\n🇬🇧 ► Hello ${user} ✨, welcome to Shiiro Bot, I'm here to assist you\n\n🇳🇴 ► Hei ${user} ✨, velkommen til Shiiro Bot, jeg er her for å hjelpe deg\n\n┏━━『 𝗕𝗼𝘁 𝗜𝗻𝗳𝗼 』━━━━━━━┓\n┣❍ 𝗔𝘂𝘁𝗵𝗼𝗿 : Shiiro\n┣❍ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.5\n┣❍ 𝗦𝘁𝗮𝘁𝘂𝘀 : Active\n┗━━━━━━━━━━━━━━━━━━┙\n\n┏❍ 𝗠𝗲𝗻𝘂 𝗨𝘁𝗮𝗺𝗮\n┣━▣ .info ▹ See information\n┣━▣ .credit ▹ See credit info\n┣━▣ .ping ▹ See Status\n┗━━━━━━━━━━━━━━━━━━━\n┏❍ 𝗠𝗲𝗻𝘂 𝗙𝘂𝗻\n┣━▣ .teka-teki ▹ Puzzle\n┣━▣ .tebaknegara ▹ Negara\n┗━━━━━━━━━━━━━━━━━━━`,
            buttons: [
              { body: '🌈 𝗜 𝗦𝗮𝘆 𝗧𝗵𝗮𝗻𝗸 𝗬𝗼𝘂' }
            ]
          });
        } catch (error) {
          console.error('Error sending video:', error);
          // Fallback ke teks saja jika video gagal
          await client.sendMessage(message.from, `Menu utama :\n🇬🇧 ► Hello ${user} ✨, welcome to Shiiro Bot, I'm here to assist you\n\n🇳🇴 ► Hei ${user} ✨, velkommen til Shiiro Bot, jeg er her for å hjelpe deg\n\n┏━━『 𝗕𝗼𝘁 𝗜𝗻𝗳𝗼 』━━━━━━━┓\n┣❍ 𝗔𝘂𝘁𝗵𝗼𝗿 : Shiiro\n┣❍ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.5\n┣❍ 𝗦𝘁𝗮𝘁𝘂𝘀 : Active\n┗━━━━━━━━━━━━━━━━━━┙\n\n┏❍ 𝗠𝗲𝗻𝘂 𝗨𝘁𝗮𝗺𝗮\n┣━▣ .info ▹ See information\n┣━▣ .credit ▹ See credit info\n┣━▣ .ping ▹ See Status\n┗━━━━━━━━━━━━━━━━━━━\n┏❍ 𝗠𝗲𝗻𝘂 𝗙𝘂𝗻\n┣━▣ .teka-teki ▹ Puzzle\n┣━▣ .tebaknegara ▹ Negara\n┗━━━━━━━━━━━━━━━━━━━`, {
            buttons: [
              { body: '🌈 𝗜 𝗦𝗮𝘆 𝗧𝗵𝗮𝗻𝗸 𝗬𝗼𝘂' }
            ]
          });
        }
      }, 2000); // Delay 2 detik
    } 
    else if (text === '.credit') {
      setTimeout(async () => {
        await client.sendMessage(message.from, '┏━━━━━❒ 𝗖𝗥𝗘𝗗𝗜𝗧\n┣⭔ 🔗 𝖫𝗂𝗇𝗄 : http://bit.ly/4n8IzLy\n┗━━━━━━━━━━━━━━━━━━━');
      }, 1500);
    }
    else if (text === '.ping') {
      setTimeout(async () => {
        await client.sendMessage(message.from, '┏━━━━━❒ 𝗣𝗜𝗡𝗚\n┣⭔ 🔗 𝖫𝗂𝗇𝗄 : http://bit.ly/47nPTi2\n┗━━━━━━━━━━━━━━━━━━━');
      }, 1500);
    }
    else if (text === '.info') {
      setTimeout(async () => {
        await client.sendMessage(message.from, '┏━━━━━❒ 𝗜𝗡𝗙𝗢\n┣⭔ 🔗 𝖫𝗂𝗇𝗄 : http://bit.ly/45Ub3Sh\n┗━━━━━━━━━━━━━━━━━━━');
      }, 1500);
    }
    else if (text === '.teka-teki') {
      setTimeout(async () => {
        const randomIndex = Math.floor(Math.random() * funQuestions.teka_teki.length);
        const question = funQuestions.teka_teki[randomIndex];
        
        // Simpan jawaban untuk user
        userAnswers.set(message.from, {
          answer: question.answer,
          question: question.question
        });
        
        // Kirim pertanyaan
        await client.sendMessage(message.from, `❓ ${question.question}\n\nAnda punya 2 menit untuk menjawab!`);
        
        // Set timer 2 menit
        const timer = setTimeout(async () => {
          if (userAnswers.has(message.from)) {
            const answerData = userAnswers.get(message.from);
            if (answerData.question === question.question) {
              await client.sendMessage(message.from, `⏰ Waktu habis! Jawaban yang benar adalah: *${question.answer}*`);
              userAnswers.delete(message.from);
              activeTimers.delete(message.from);
            }
          }
        }, 2 * 60 * 1000); // 2 menit
        
        activeTimers.set(message.from, timer);
      }, 1500);
    }
    else if (text === '.tebaknegara') {
      setTimeout(async () => {
        const randomIndex = Math.floor(Math.random() * funQuestions.tebak_negara.length);
        const question = funQuestions.tebak_negara[randomIndex];
        
        // Simpan jawaban untuk user
        userAnswers.set(message.from, {
          answer: question.answer,
          question: question.question
        });
        
        // Kirim pertanyaan
        await client.sendMessage(message.from, `🌍 ${question.question}\n\nAnda punya 2 menit untuk menjawab!`);
        
        // Set timer 2 menit
        const timer = setTimeout(async () => {
          if (userAnswers.has(message.from)) {
            const answerData = userAnswers.get(message.from);
            if (answerData.question === question.question) {
              await client.sendMessage(message.from, `⏰ Waktu habis! Jawaban yang benar adalah: *${question.answer}*`);
              userAnswers.delete(message.from);
              activeTimers.delete(message.from);
            }
          }
        }, 2 * 60 * 1000); // 2 menit
        
        activeTimers.set(message.from, timer);
      }, 1500);
    }
    else if (text === '🌈 𝗜 𝗦𝗮𝘆 𝗧𝗵𝗮𝗻𝗸 𝗬𝗼𝘂' || text === 'i say thank you') {
      await message.reply('You\'re welcome! 😊');
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

// Handle error
client.on('auth_failure', (msg) => {
  console.error('Authentication failure:', msg);
});

client.on('disconnected', (reason) => {
  console.log('Client was logged out:', reason);
});

// Inisialisasi client
client.initialize();