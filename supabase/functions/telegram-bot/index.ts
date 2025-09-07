import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Uzbek words for the game (sample words)
const UZBEK_WORDS = new Set([
  "kitob", "bola", "ata", "ana", "bosh", "qo'l", "ko'z", "quloq", "burun", "og'iz",
  "tish", "til", "bo'yin", "qorin", "oyoq", "barmaq", "tirnoq", "soch", "yuz", "qosh",
  "kirpi", "it", "mushuk", "ot", "sigir", "qo'y", "echki", "tovuq", "o'rdak", "g'oz",
  "baliq", "qush", "hasharot", "kapalak", "chumoli", "ari", "chivin", "pashsha", "o'rgimchak", "qurt",
  "daraxt", "gul", "barg", "meva", "sabzavot", "piyoz", "sarimsoq", "pomidor", "bodring", "karam",
  "kartoshka", "sabzi", "qazi", "ismaloq", "qovun", "tarvuz", "uzum", "olma", "nok", "behi",
  "shaftoli", "o'rik", "gilos", "olcha", "anjir", "yong'oq", "bodom", "pista", "charxpalak", "qovurilgan",
  "non", "osh", "sho'rva", "manta", "somsa", "lag'mon", "chuchvara", "palov", "kabob", "tandir",
  "choy", "qahva", "suv", "sharbat", "kompot", "airan", "qatiq", "suzma", "tvorog", "qo'shimcha"
]);

interface GameSession {
  chatId: number;
  currentWord: string;
  usedWords: Set<string>;
  playerScore: number;
  botScore: number;
  lastPlayer: 'user' | 'bot';
  isActive: boolean;
  startTime: number;
}

// In-memory game sessions (in production, use Supabase database)
const gameSessions = new Map<number, GameSession>();

// Helper functions
const sendMessage = async (chatId: number, text: string, replyMarkup?: any) => {
  const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: replyMarkup,
      parse_mode: 'HTML'
    }),
  });
  return response.json();
};

const getRandomWord = (): string => {
  const words = Array.from(UZBEK_WORDS);
  return words[Math.floor(Math.random() * words.length)];
};

const findWordStartingWith = (letter: string): string | null => {
  const words = Array.from(UZBEK_WORDS);
  const validWords = words.filter(word => 
    word.toLowerCase().startsWith(letter.toLowerCase())
  );
  return validWords.length > 0 ? validWords[Math.floor(Math.random() * validWords.length)] : null;
};

const isValidWord = (word: string): boolean => {
  return UZBEK_WORDS.has(word.toLowerCase());
};

const startNewGame = (chatId: number): GameSession => {
  const initialWord = getRandomWord();
  const session: GameSession = {
    chatId,
    currentWord: initialWord,
    usedWords: new Set([initialWord]),
    playerScore: 0,
    botScore: 0,
    lastPlayer: 'bot',
    isActive: true,
    startTime: Date.now()
  };
  gameSessions.set(chatId, session);
  return session;
};

const processUserWord = async (chatId: number, userWord: string) => {
  const session = gameSessions.get(chatId);
  if (!session || !session.isActive) {
    return await sendMessage(chatId, "❌ Hozirda faol o'yin yo'q. /start tugmasini bosing.");
  }

  const cleanWord = userWord.toLowerCase().trim();
  const currentWord = session.currentWord.toLowerCase();
  const lastLetter = currentWord.charAt(currentWord.length - 1);

  // Check if word starts with correct letter
  if (!cleanWord.startsWith(lastLetter)) {
    return await sendMessage(chatId, `❌ Xato! So'z "${lastLetter}" harfi bilan boshlanishi kerak.`);
  }

  // Check if word was already used
  if (session.usedWords.has(cleanWord)) {
    return await sendMessage(chatId, "❌ Bu so'z avval ishlatilgan. Boshqa so'z tanlang.");
  }

  // Check if word is valid
  if (!isValidWord(cleanWord)) {
    return await sendMessage(chatId, "❌ Bunday so'z mavjud emas. Boshqa so'z tanlang.");
  }

  // Valid word! Add to used words
  session.usedWords.add(cleanWord);
  session.currentWord = cleanWord;
  session.lastPlayer = 'user';
  session.playerScore++;

  // Bot's turn
  const userLastLetter = cleanWord.charAt(cleanWord.length - 1);
  const botWord = findWordStartingWith(userLastLetter);

  if (!botWord) {
    // Bot can't find a word - user wins!
    session.isActive = false;
    const gameTime = Math.floor((Date.now() - session.startTime) / 1000);
    return await sendMessage(chatId, 
      `🎉 <b>Tabriklaymiz! Siz g'olib bo'ldingiz!</b>\n\n` +
      `📊 <b>O'yin natijasi:</b>\n` +
      `👤 Siz: ${session.playerScore} so'z\n` +
      `🤖 Bot: ${session.botScore} so'z\n` +
      `⏱ Vaqt: ${gameTime} soniya\n` +
      `📝 Jami so'zlar: ${session.usedWords.size}\n\n` +
      `Yangi o'yin boshlash uchun /start tugmasini bosing.`
    );
  }

  // Bot found a word
  session.usedWords.add(botWord);
  session.currentWord = botWord;
  session.lastPlayer = 'bot';
  session.botScore++;

  const nextLetter = botWord.charAt(botWord.length - 1);
  
  return await sendMessage(chatId, 
    `✅ To'g'ri! <b>"${cleanWord}"</b>\n\n` +
    `🤖 Men: <b>"${botWord}"</b>\n\n` +
    `📝 Navbat sizda! <b>"${nextLetter}"</b> harfi bilan so'z yozing.\n\n` +
    `📊 Hisob: Siz ${session.playerScore} - ${session.botScore} Bot`
  );
};

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const body = await req.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    if (!body.message) {
      return new Response('OK', { status: 200 });
    }

    const { message } = body;
    const chatId = message.chat.id;
    const text = message.text;
    const firstName = message.from?.first_name || 'Foydalanuvchi';

    // Handle commands
    if (text === '/start') {
      const session = startNewGame(chatId);
      const nextLetter = session.currentWord.charAt(session.currentWord.length - 1);
      
      return await sendMessage(chatId, 
        `🎮 <b>So'z zanjiri o'yiniga xush kelibsiz, ${firstName}!</b>\n\n` +
        `📝 <b>Qoidalar:</b>\n` +
        `• Har bir so'z oldingi so'zning oxirgi harfi bilan boshlanishi kerak\n` +
        `• So'zlar takrorlanmasligi kerak\n` +
        `• Faqat o'zbek tilidagi so'zlar qabul qilinadi\n\n` +
        `🤖 Men <b>"${session.currentWord}"</b> so'zi bilan boshlayman.\n\n` +
        `📝 Navbat sizda! <b>"${nextLetter}"</b> harfi bilan so'z yozing.\n\n` +
        `💡 Yordam uchun /yordam, to'xtatish uchun /stop`
      );
    }

    if (text === '/stop') {
      const session = gameSessions.get(chatId);
      if (session) {
        session.isActive = false;
        gameSessions.delete(chatId);
        return await sendMessage(chatId, 
          `⏹ O'yin to'xtatildi.\n\n` +
          `📊 <b>Yakuniy natija:</b>\n` +
          `👤 Siz: ${session.playerScore} so'z\n` +
          `🤖 Bot: ${session.botScore} so'z\n\n` +
          `Yangi o'yin boshlash uchun /start tugmasini bosing.`
        );
      }
      return await sendMessage(chatId, "Hozirda faol o'yin yo'q.");
    }

    if (text === '/yordam') {
      return await sendMessage(chatId, 
        `📖 <b>So'z zanjiri o'yini qoidalari:</b>\n\n` +
        `1️⃣ Bot tasodifiy so'z bilan boshlar\n` +
        `2️⃣ Siz oldingi so'zning oxirgi harfi bilan boshlanadigan yangi so'z yozasiz\n` +
        `3️⃣ So'zlar takrorlanmasligi kerak\n` +
        `4️⃣ Faqat o'zbek tilidagi so'zlar qabul qilinadi\n\n` +
        `📝 <b>Buyruqlar:</b>\n` +
        `/start - O'yinni boshlash\n` +
        `/stop - O'yinni to'xtatish\n` +
        `/yordam - Bu yordam\n` +
        `/reyting - Eng yaxshi o'yinchilar\n\n` +
        `🎯 <b>Maqsad:</b> Botni "yengish" - ya'ni botni so'z topa olmaydigan holatga keltirish!`
      );
    }

    if (text === '/reyting') {
      // In production, this would fetch from database
      return await sendMessage(chatId, 
        `🏆 <b>Top 5 O'yinchilar:</b>\n\n` +
        `👑 1. Ali Karimov - 45 g'alaba\n` +
        `🥈 2. Malika Saidova - 38 g'alaba\n` +
        `🥉 3. Bobur Rahimov - 29 g'alaba\n` +
        `4️⃣ 4. Nodira Tosheva - 25 g'alaba\n` +
        `5️⃣ 5. Sardor Alimov - 22 g'alaba\n\n` +
        `💪 Sizning reytingingiz: Tez orada...`
      );
    }

    // Handle word input
    if (text && !text.startsWith('/')) {
      return await processUserWord(chatId, text);
    }

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});