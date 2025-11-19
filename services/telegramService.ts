
import { Task, User, Forfeit } from '../types';

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';
const TELEGRAM_FILE_BASE = 'https://api.telegram.org/file/bot';

// Helper to escape HTML characters to prevent Telegram API errors
const escapeHtml = (text: string) => {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const sendMessage = async (token: string, chatId: string, text: string) => {
  try {
    if (!token || !chatId) {
        // console.warn('Missing Token or Chat ID'); 
        return;
    }

    const params = new URLSearchParams();
    params.append('chat_id', chatId);
    params.append('text', text);
    params.append('parse_mode', 'HTML');
    params.append('disable_web_page_preview', 'true');

    await fetch(`${TELEGRAM_API_BASE}${token}/sendMessage`, {
      method: 'POST',
      mode: 'no-cors', 
      body: params
    });
    
  } catch (error) {
    console.error('Telegram Notification Failed (Check Bot Token/Network):', error);
  }
};

export const getTelegramUpdates = async (token: string, offset: number) => {
  try {
    if (!token) return [];
    const response = await fetch(`${TELEGRAM_API_BASE}${token}/getUpdates?offset=${offset}&timeout=1`, {
      method: 'GET',
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (data.ok) return data.result;
    return [];
  } catch (error) {
    return [];
  }
};

export const getTelegramPhotoUrl = async (token: string, userId: string): Promise<string | null> => {
  try {
    if (!token || !userId) return null;

    // 1. Get User Profile Photos
    const photosResponse = await fetch(`${TELEGRAM_API_BASE}${token}/getUserProfilePhotos?user_id=${userId}&limit=1`);
    
    if (!photosResponse.ok) return null;
    const photosData = await photosResponse.json();

    if (!photosData.ok || photosData.result.total_count === 0) {
      return null;
    }

    // Get the largest photo variant
    const photoArray = photosData.result.photos[0];
    const bestPhoto = photoArray[photoArray.length - 1];
    const fileId = bestPhoto.file_id;

    // 2. Get File Path
    const fileResponse = await fetch(`${TELEGRAM_API_BASE}${token}/getFile?file_id=${fileId}`);
    if (!fileResponse.ok) return null;
    const fileData = await fileResponse.json();

    if (!fileData.ok) return null;

    const filePath = fileData.result.file_path;

    // 3. Return Direct URL
    return `${TELEGRAM_FILE_BASE}${token}/${filePath}`;
    
  } catch (error) {
    console.warn('Failed to fetch Telegram photo:', error);
    return null;
  }
};

export const notifyNewTask = async (token: string, chatId: string, task: Task, assignee?: User, isPrivate: boolean = false) => {
  const assigneeName = assignee ? `${assignee.name} (@${assignee.telegramHandle.replace('@', '')})` : 'مجهول';
  const deadline = new Date(task.deadline).toLocaleDateString('ar-EG', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
  
  let messageTitle = isPrivate 
    ? `👋 <b>اصحى للكلام يا ${escapeHtml(assignee?.name || 'بطل')}، عندك مصلحة جديدة!</b>`
    : `📢 <b>بلاغ رقم (1) لسنة 2025</b>`;

  const message = `
${messageTitle}

📌 <b>المهمة المطلوبة:</b> ${escapeHtml(task.title)}
👤 <b>المتهم (المسؤول):</b> ${escapeHtml(assigneeName)}
📅 <b>آخر ميعاد (عشان متزعلش):</b> ${deadline}
🔥 <b>مستوى المصيبة:</b> ${task.severity}

💬 <b>التفاصيل:</b>
${escapeHtml(task.description)}

👁️ <i>"الناظر عينيه عليك.. بلاش مرقعة!"</i>
  `;
  await sendMessage(token, chatId, message);
};

export const notifyJudgementCandidates = async (token: string, chatId: string, task: Task, forfeits: Forfeit[], assignee?: User) => {
  const assigneeName = assignee ? `${assignee.name} (@${assignee.telegramHandle.replace('@', '')})` : 'المتخاذل';
  
  let optionsList = '';
  forfeits.forEach((f, idx) => {
    optionsList += `
🔹 <b>الخيار (${idx + 1}): ${escapeHtml(f.title)}</b>
📜 <i>${escapeHtml(f.description)}</i>
💣 قصف جبهة: "${escapeHtml(f.wittiness)}"
`;
  });

  const message = `
⚖️ <b>جلسة استماع (المجلس التأديبي)</b> ⚖️

المتهم: <b>${escapeHtml(assigneeName)}</b>
الجريمة: تأخير تسليم "<b>${escapeHtml(task.title)}</b>"

الناظر (AI) اقترح العقوبات دي.. والجمهور (أو الأدمن) هيختار الأنسب:

${optionsList}
━━━━━━━━━━━━━━━━━━━━
👇 <b>عشان تختار، ابعت رقم العقاب (1 أو 2) في رسالة دلوقتي!</b>
👀 <b>القرار النهائي سيصدر قريباً..</b>
  `;
  await sendMessage(token, chatId, message);
};

export const notifyJudgement = async (token: string, chatId: string, task: Task, forfeit: Forfeit, assignee?: User) => {
  const assigneeName = assignee ? `${assignee.name} (@${assignee.telegramHandle.replace('@', '')})` : 'المتخاذل';
  
  const message = `
🚨 <b>عـــاجـــل: فرمان إداري وتجريس علني</b> 🚨

قررت إدارة الناظر توقيع أقصى عقوبة على الزميل المتخاذل:
🛑 <b>${escapeHtml(assigneeName)}</b>

بسبب ارتكابه جريمة التأخير في تسليم:
📉 <b>"${escapeHtml(task.title)}"</b>

⚖️ <b>ومنطوق الحكم هو (العقاب المختار):</b>

🔥 <b>${escapeHtml(forfeit.title)}</b>
━━━━━━━━━━━━━━━━━━━━
📝 <i>${escapeHtml(forfeit.description)}</i>
━━━━━━━━━━━━━━━━━━━━

🎤 <b>تعليق الناظر (قصف جبهة):</b>
"${escapeHtml(forfeit.wittiness)}"

📸 <b>مطلوب من السادة الزملاء:</b>
تجهيز الموبايلات وتوثيق لحظة التنفيذ. الفضيحة لازم تبقى بجلاجل!

#الناظر_لا_يرحم #فضيحة_علنية #لا_للتخاذل
  `;
  await sendMessage(token, chatId, message);
};

export const notifyResolution = async (token: string, chatId: string, task: Task, assignee?: User) => {
   const assigneeName = assignee ? `${assignee.name}` : 'الموظف';
   
   const message = `
✅ <b>إشعار إبراء ذمة (مؤقتاً)</b>

نحيطكم علماً بأن الزميل: <b>${escapeHtml(assigneeName)}</b>
قد قام بتنفيذ العقاب المقرر عليه بخصوص مهمة: <b>${escapeHtml(task.title)}</b>

📂 <b>تم إغلاق المحضر وحفظ الكرامة المتبقية.</b>

👮‍♂️ <i>"نتمنى أن يكون الدرس قد وصل.. الشغل مش لعب عيال."</i>
   `;
   await sendMessage(token, chatId, message);
};

export const notifyScoreChange = async (token: string, chatId: string, user: User, points: number, reason: string) => {
  const emoji = points > 0 ? '📈' : '📉';
  const action = points > 0 ? 'منح مكافأة سمعة' : 'خصم نقاط سمعة';
  
  const message = `
${emoji} <b>تحديث في بورصة الناظر</b>

تم ${action} للزميل: <b>${escapeHtml(user.name)}</b>
السبب: ${escapeHtml(reason)}

الرصيد: <b>${points > 0 ? '+' : ''}${points} نقطة</b>
السمعة الحالية: <b>${user.reputationScore}</b>

#بورصة_الكرامة
  `;
  await sendMessage(token, chatId, message);
};

export const notifyInvalidSelection = async (token: string, chatId: string) => {
  const message = `
🚫 <b>يا فهلوي يا ناصح!</b>

ابعت رقم (1) أو (2) بس عشان تختار العقاب.
بلاش شغل "الهبد" والمساومة دة.. الناظر مبيتضحكش عليه.
  `;
  await sendMessage(token, chatId, message);
};
