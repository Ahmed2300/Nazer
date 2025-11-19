import { GoogleGenAI, Type } from "@google/genai";
import { Task, Forfeit } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

// --- THE JUDGEMENT SCENARIO ENGINE (HARDCORE EDITION) ---
const JUDGEMENT_SCENARIOS = [
  // --- SOCIAL SUICIDE (Social Media) ---
  {
    id: 'LINKEDIN_SHAME',
    theme: 'فضيحة لينكد إن (LinkedIn Suicide)',
    instruction: 'Force them to change their LinkedIn Headline to "Professional Procrastinator" or "Aspiring Failure" for 24 hours.'
  },
  {
    id: 'STORY_TEETH',
    theme: 'سيلفي السنان (Teeth Selfie)',
    instruction: 'Post a close-up photo of their teeth/gums on Instagram/WhatsApp Story with NO context. Just teeth.'
  },
  {
    id: 'UGLY_PROFILE_PIC',
    theme: 'بروفايل الرعب (The Ugly Angle)',
    instruction: 'Change their WhatsApp/Slack profile picture to a selfie taken from below the chin (double chin angle) for 48 hours.'
  },
  {
    id: 'FAMILY_GROUP_SCANDAL',
    theme: 'جروب العيلة (Family Panic)',
    instruction: 'Send a voice note to their Family WhatsApp Group saying "I have a disaster to confess..." then turn off the phone for 1 hour.'
  },
  {
    id: 'EX_CALL_DARE',
    theme: 'مكالمة الأكس (The Toxic Call)',
    instruction: 'Call an Ex (or a crush/best friend) and say "I dreamt about you, I think it\'s a sign" then hang up immediately.'
  },

  // --- FINANCIAL & PHYSICAL PAIN ---
  {
    id: 'FEED_THE_TEAM',
    theme: 'عزومة الندامة (Financial Penalty)',
    instruction: 'They must order coffee/dessert for the entire team (or transfer 200 EGP to the "Team Outing Fund").'
  },
  {
    id: 'GYM_SHAME',
    theme: 'تمرين الفضيحة (Public Workout)',
    instruction: 'Record a video doing 20 pushups in the middle of the street or office while shouting "I am weak and lazy!".'
  },

  // --- PUBLIC HUMILIATION ---
  {
    id: 'MAHRAGAN_SINGER',
    theme: 'نجم المهرجانات (Mahragan Audition)',
    instruction: 'Record a serious voice note singing a Mahragan (Autotune style) apologizing to the code. Must be sent to the "General" channel.'
  },
  {
    id: 'CRINGE_DANCE',
    theme: 'رقصة التيك توك (Cringe Dance)',
    instruction: 'Record a video doing a specific cringe TikTok dance (e.g., Skibidi style) and post it on the group.'
  },
  {
    id: 'LOVE_LETTER_TO_MANAGER',
    theme: 'جواب غرامي (Love Letter)',
    instruction: 'Write a poetic "Love Letter" to the Project Manager or Tech Lead, begging for forgiveness with excessive emojis.'
  },
  {
    id: 'CHILDHOOD_PHOTO',
    theme: 'أيام الكحرتة (Childhood Trauma)',
    instruction: 'Find the most embarrassing childhood photo (the one with the bad haircut/underwear) and make it their wallpaper/status.'
  },
  {
    id: 'APOLOGY_TO_LAPTOP',
    theme: 'اعتذار للجماد (Laptop Apology)',
    instruction: 'Record a video holding their laptop, stroking it gently, and apologizing for being an "Unworthy User".'
  },
  {
    id: 'WEAR_IT_WRONG',
    theme: 'اللبس المتشقلب (Fashion Disaster)',
    instruction: 'Attend the next daily meeting (or record a video) wearing their t-shirt/hoodie inside out or backwards.'
  },
  {
    id: 'STREET_BEGGAR',
    theme: 'شحاتة لايكات (Like Beggar)',
    instruction: 'Post a status saying: "I feel ugly today, please tell me I am pretty" and leave it for 3 hours.'
  }
];

const getRandomScenarios = (count: number) => {
  const shuffled = [...JUDGEMENT_SCENARIOS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generateJudgement = async (task: Task, assigneeName: string): Promise<Forfeit[]> => {
  // 1. Fallback for Missing API Key (Mode: Manual Ruthless)
  if (!apiKey) {
    console.warn("⚠️ API Key missing. Deploying backup sarcasm...");
    return [
      {
        id: 'mock-hard-1',
        title: 'عزومة "الغرامة"',
        description: 'هتطلب أكل (أو قهوة) للتيم كله دلوقتي حالاً على حسابك. عقاب فوري ومادي عشان الجيب بيوجع أكتر من القلب.',
        wittiness: 'عشان تتعلم إن "التأخير" ليه تمن.. والتمن ده "كاش".'
      },
      {
        id: 'mock-hard-2',
        title: 'بروفايل "البطاطا"',
        description: 'هتغير صورة بروفايلك (واتس/سلاك) لصورة "بطاطا" لمدة 48 ساعة، وتكتب الحالة: "أنا آسف يا جماعة، أنا بطاطا في الشغل".',
        wittiness: 'عشان نعرف مقامك الحقيقي لما تتأخر على التسليم.'
      }
    ];
  }

  // 2. Select 2 Random Scenarios
  const selectedScenarios = getRandomScenarios(2);
  const scenarioInstructions = selectedScenarios.map((s, i) => `Option ${i + 1} Theme: "${s.theme}" -> ${s.instruction}`).join('\n');

  // 3. The "El-Moftary" Persona Prompt
  const prompt = `
    You are "El-Nazir El-Moftary" (The Ruthless Tyrant). You are a sadistic Egyptian character who enjoys "Jarasah" (Public Scandal).
    
    Identity:
    - You are NOT here to joke. You are here to humiliate.
    - You speak in aggressive, dominant Egyptian Street Slang (لغة السرسجية البلطجية).
    - You use phrases like: "هخليك عبرة", "فضيحة بجلاجل", "يا مهزأ", "يا خيبتك", "ادفع يا وحش".
    
    The Mission:
    Issue a humiliatng sentence on the user named "${assigneeName}" (Detect Gender: "ya Dacar" vs "ya Abla") who failed task: "${task.title}".
    
    Task Severity: ${task.severity}.
    - IF CRITICAL/HIGH: The punishment must be PAINFUL (Financial or Extreme Social Shame).
    - IF LOW: It must be Cringe/Embarrassing.

    Constraint:
    You MUST generate forfeits based strictly on these HARDCORE themes:
    ${scenarioInstructions}

    Required Output:
    Generate 2 punishments in a strict JSON array format.
    
    Output Schema (JSON Only):
    [
      {
        "title": "A scary/funny slang title (e.g., غرامة مالية, فضيحة العيلة)",
        "description": "The specific action they must do (Must be actionable and hard).",
        "wittiness": "A savage roast (قصف جبهة) destroying their ego."
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        role: 'user',
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "اسم العقاب (مرعب ومضحك)" },
              description: { type: Type.STRING, description: "تفاصيل التنفيذ" },
              wittiness: { type: Type.STRING, description: "قصف جبهة" }
            },
            required: ["title", "description", "wittiness"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from Gemini");

    const parsed = JSON.parse(jsonText);
    
    return parsed.map((item: any, index: number) => ({
      id: `${task.id}-judge-${index}-${Date.now()}`,
      title: item.title,
      description: item.description,
      wittiness: item.wittiness
    }));

  } catch (error) {
    console.error("Gemini Judgement Failed:", error);
    return [
        {
            id: 'fallback-hard-1',
            title: 'لايف الاعتذار',
            description: 'تفتح لايف فيديو (أو تسجل فيديو) وتعتذر للابتوب بتاعك وبوسه، وقول "أنا مكنتش قد المسؤولية".',
            wittiness: 'عشان اللابتوب ده أنضف منك وبيشتغل أكتر منك.'
        }
    ];
  }
};
