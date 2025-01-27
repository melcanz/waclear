const venom = require('venom-bot');
const fs = require('fs');

// Fungsi untuk menyimpan waktu banned ke file logbaned.txt
const logBanedTime = () => {
  const time = new Date().toLocaleString();
  fs.appendFileSync('logbaned.txt', `Bot terbaned pada: ${time}\n`);
  console.log(`Bot terbaned pada: ${time}`);
};

// Fungsi utama untuk menjalankan bot
venom
  .create({
    session: 'bot-session', // Nama sesi
    multidevice: true, // Aktifkan mode multi-device
    disableWelcome: true, // Nonaktifkan pesan selamat datang default
    logQR: false, // Nonaktifkan log QR
    useChrome: true,
    headless: true, // Headless browser
  })
  .then((client) => startBot(client))
  .catch((err) => {
    console.error('Error saat membuat bot:', err);
    logBanedTime(); // Catat waktu banned jika gagal login
  });

// Fungsi untuk memulai bot
const startBot = (client) => {
  console.log('Bot berhasil terhubung ke WhatsApp.');

  // Fungsi untuk menghapus semua chat kecuali 2 teratas
  const deleteChats = async () => {
    console.log('Memulai proses penghapusan chat...');
    try {
      const chats = await client.getAllChats(); // Ambil semua chat

      // Hapus semua kecuali 2 chat teratas
      const chatsToDelete = chats.slice(2); // Sisakan 2 chat teratas
      for (const chat of chatsToDelete) {
        console.log(`Menghapus chat dengan ID: ${chat.id._serialized}`);
        await client.deleteChat(chat.id._serialized);
      }
      console.log('Proses penghapusan selesai.');
    } catch (error) {
      console.error('Gagal menghapus chat:', error.message);
    }
  };

  // Jalankan setiap 5 menit
  setInterval(deleteChats, 5 * 60 * 1000);

  // Deteksi ketika bot keluar atau terbaned
  client.onStateChange((state) => {
    console.log('State berubah:', state);
    if (state === 'DISCONNECTED') {
      logBanedTime(); // Simpan waktu banned
    }
  });
};
