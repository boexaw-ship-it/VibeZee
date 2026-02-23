// =============================================
// VIBEZEE — Telegram Bot Config
// =============================================

const TelegramBot = require('node-telegram-bot-api');

let bot = null;

const initBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token || token === 'your_bot_token_here') {
    console.warn('⚠️  Telegram bot token မသတ်မှတ်ရသေးပါ။ .env ဖိုင်ထဲ TELEGRAM_BOT_TOKEN ထည့်ပါ။');
    return null;
  }

  try {
    bot = new TelegramBot(token, { polling: false });
    console.log('✅ Telegram Bot initialized');
    return bot;
  } catch (err) {
    console.error('❌ Telegram Bot Error:', err.message);
    return null;
  }
};

// ── ORDER NOTIFICATION ──
const sendOrderNotification = async (order) => {
  if (!bot) {
    console.log('📭 Telegram bot not connected. Order:', order.orderId);
    return false;
  }

  const groupId = process.env.TELEGRAM_GROUP_ID;
  if (!groupId || groupId === 'your_group_chat_id_here') {
    console.warn('⚠️  Telegram Group ID မသတ်မှတ်ရသေးပါ။');
    return false;
  }

  const paymentEmoji = {
    cod:     '🚚',
    kbzpay:  '📱',
    wavepay: '💜',
  };

  const paymentInfo = {
    cod:     'Cash on Delivery',
    kbzpay:  `KBZPay — ${process.env.KBZPAY_NUMBER}`,
    wavepay: `WavePay — ${process.env.WAVEPAY_NUMBER}`,
  };

  // Build items list
  const itemsList = order.items.map(item =>
    `  • ${item.name} × ${item.qty} — ${(item.price * item.qty).toLocaleString()} MMK`
  ).join('\n');

  const message = `
🛒 *NEW ORDER — ${process.env.SHOP_NAME}*
━━━━━━━━━━━━━━━━━━━━
🔖 Order ID: \`${order.orderId}\`
📅 Date: ${order.date}

👤 *Customer Info*
   Name: ${order.name}
   Phone: ${order.phone}
   City: ${order.city}
   Address: ${order.address || '—'}
   Note: ${order.note || '—'}

📦 *Items*
${itemsList}

━━━━━━━━━━━━━━━━━━━━
💰 *Total: ${order.total.toLocaleString()} MMK*
${paymentEmoji[order.payment] || '💳'} Payment: ${paymentInfo[order.payment] || order.payment}
━━━━━━━━━━━━━━━━━━━━
  `.trim();

  try {
    await bot.sendMessage(groupId, message, { parse_mode: 'Markdown' });
    console.log(`✅ Telegram notification sent for order ${order.orderId}`);
    return true;
  } catch (err) {
    console.error('❌ Telegram send error:', err.message);
    return false;
  }
};

module.exports = { initBot, sendOrderNotification };
