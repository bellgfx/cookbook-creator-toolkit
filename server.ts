import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ── ENDPOINT: Verify Password for Premium Access ──
app.post("/api/auth/verify", (req, res) => {
  const { password } = req.body;
  
  // Base list of passwords, pre-generating 20 secure, thematic premium keys you can give to customers.
  // The original "LetsCreate@2026" is kept for backwards compatibility.
  const defaultPasswords = [
    "LetsCreate@2026",
    "CookbookCreator-Premium-7521",
    "IndieAuthor-Elite-9430",
    "GourmetChef-Access-2281",
    "RecipeVibe-Special-5049",
    "CookbookAuthor-Gold-3312",
    "KitchenArtist-2026-8840",
    "CreativeFlavors-9137",
    "CulinaryIndie-Pro-4628",
    "EpicureanWriter-5591",
    "TasteMaker-Elite-6023",
    "PublishYourFlavors-3810",
    "GourmetAuthor-2026-1749",
    "SecretIngredient-4402",
    "PerfectPlating-Pro-9281",
    "SizzleAndWrite-3051",
    "TheArtOfCooking-8812",
    "ModernTable-Elite-2740",
    "HeirloomRecipes-2026-6619",
    "MasterclassAuthor-3394",
    "FeastAndPublish-7105"
  ];
  const customPasswordsEnv = process.env.CUSTOMER_PASSWORDS || "";
  const customPasswords = customPasswordsEnv
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
    
  const allValidPasswords = [...defaultPasswords, ...customPasswords];
  
  if (password && allValidPasswords.includes(password)) {
    return res.json({ success: true, token: "premium-session-token-2026" });
  } else {
    return res.json({ 
      success: false, 
      message: "Incorrect passkey. Please check with your administrator or input a valid premium tester key." 
    });
  }
});

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// ── RETRY HELPER FOR GEMINI API ──
async function callGeminiWithRetry(fn: () => Promise<any>, retries = 2, delay = 300): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i < retries - 1) {
        console.warn(`Gemini API call failed: ${error.message || error}. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
}

// ── LOCAL FALLBACK GENERATORS ──
function getLocalTitlesFallback(authorName: string, motivation: string, audience: any, themes: any, angles: any) {
  const author = authorName || "Anonymous";
  const themeList = Array.isArray(themes) ? themes : [themes || "Wholesome Cooking"];
  const t = themeList[0] || "Wholesome Cooking";
  const angleList = Array.isArray(angles) ? angles : [angles || "Daily Health"];
  const a = angleList[0] || "Nutritional Balance";
  const aud = Array.isArray(audience) ? audience[0] : (audience || "Wholesome Living");

  return [
    {
      title: `The ${t} Table`,
      subtitle: `Nurturing Recipes and Stories for ${aud}`,
      why: `Combines your focus on "${t}" with a warm, inviting approach tailored directly for your target audience.`
    },
    {
      title: `Nourished & Inspired`,
      subtitle: `Simple, Flavorful Dishes Rooted in ${a}`,
      why: `Leverages your unique angle of "${a}" to create a purposeful, wellness-focused brand.`
    },
    {
      title: `${author}'s Kitchen Companion`,
      subtitle: `Everyday ${t} Secrets for Vibrant Living`,
      why: `A personal, high-trust title that highlights your unique journey and authentic story.`
    },
    {
      title: `The Mindful Plate`,
      subtitle: `Empowering ${aud} Cookbooks with a Dash of Joy`,
      why: `Draws in readers seeking a sustainable lifestyle shift, making your motivation the heart of the book.`
    }
  ];
}

function getLocalNicheFallback(authorName: string, title: string, motivation: string, audience: any, themes: any, angles: any, scale: string, formats: any) {
  const t = title || "Your Beautiful Cookbook";
  const audStr = Array.isArray(audience) ? audience.join(", ") : (audience || "health-conscious food lovers");
  const themeStr = Array.isArray(themes) ? themes.join(" and ") : (themes || "nourishing meals");
  const angleStr = Array.isArray(angles) ? angles.join(", ") : (angles || "clean eating");

  return {
    primaryNiche: `A highly targeted lifestyle cookbook focusing on ${themeStr} with an emphasis on ${angleStr} for ${audStr}.`,
    amazonCategories: [
      "Books > Cookbooks, Food & Wine > Specialty Diet",
      "Books > Cookbooks, Food & Wine > Quick & Easy",
      "Books > Cookbooks, Food & Wine > Regional & International"
    ],
    keywords: [
      `${themeStr} recipes`,
      `${angleStr} diet cooking`,
      `easy meal planning for ${audStr}`,
      `${authorName || "author"} cookbooks`,
      `wholesome food lifestyle`,
      `gourmet healthy dining`
    ],
    strengths: [
      `Extremely clear focus on ${themeStr}, addressing a highly specific and passionate reader demographic.`,
      `Authentic storytelling angle ("${angleStr}") that fosters immediate trust with the reader.`,
      `Perfect alignment between the cookbook's core format and the busy daily routines of ${audStr}.`
    ],
    suggestions: [
      `Introduce a 'Starter Pantry Check' guide inside the introduction to help new readers transition easily.`,
      `Incorporate QR codes on key recipe pages linking to short, personal video tips from the author.`
    ]
  };
}

function getLocalDesignFallback(concept: string) {
  return {
    styleName: "Warm Organic Minimalist",
    styleTagline: "Earthy · Grounded · Serene",
    reasoning: "Utilizes soft earth tones and spacious layouts to highlight the wholesome and authentic spirit of your recipes, inviting readers in with a sense of calm.",
    palette: [
      { hex: "#F3EFE9", use: "Page background and light canvas borders" },
      { hex: "#4A584A", use: "Primary headings, category text, and line rules" },
      { hex: "#C88E72", use: "Accent icons, page numbers, and custom ribbon badges" },
      { hex: "#2C2C2C", use: "Body text and highly legible recipe instructions" },
      { hex: "#D6C7B3", use: "Secondary highlights and decorative backdrops" }
    ],
    headingFont: "Playfair Display",
    bodyFont: "Montserrat",
    fontReasoning: "The elegant, timeless serif of Playfair Display brings an artisanal editorial vibe, while Montserrat provides clean, contemporary legibility for ingredients.",
    coverConcept: "A clean split-grid cover. The top features a high-contrast circular hero plate image; the bottom uses structured white space with elegant serif title elements.",
    canvaTips: [
      "Set your page margins to exactly 0.75 inches for clean, standard borders.",
      "Use custom grid lines in Canva to perfectly align ingredient columns with your prep steps.",
      "Apply a subtle 5% background tint using custom color fills to avoid plain white pages.",
      "Utilize lowercase font tracking adjustments (+10%) for a modern, airy title vibe.",
      "Use free vector elements sparingly to let the food and recipes shine as the hero."
    ],
    elementsToSearch: [
      "watercolor leaves",
      "rustic line divider",
      "minimalist organic shape",
      "vintage botanical line art",
      "soft paint brush stroke"
    ],
    moodWords: ["Nourishing", "Artisanal", "Inviting", "Calm", "Organic", "Honest"]
  };
}

function getLocalCaptionFallback(platform: string, type: string, tone: string, detail: string) {
  const p = platform || "Instagram";
  const t = tone || "warm & inspiring";
  const d = detail || "wholesome culinary creations";
  
  if (p.toLowerCase().includes("instagram")) {
    return {
      caption: `✨ Welcome to a space of nourishment and joy! ✨\n\nThere is nothing quite like sharing a plate that is as good for your body as it is for your soul. Today, we are celebrating ${d} with a recipe that is near and dear to my heart.\n\nCrafted with wholesome, clean ingredients, it's perfect for your next table gathering. 🌿🍲\n\nHow do you love to bring mindfulness to your kitchen?\n\n#CookbookJourney #WholesomeLiving #MindfulEating #RecipeTeaser #FoodWithLove`
    };
  } else if (p.toLowerCase().includes("pinterest")) {
    return {
      caption: `Discover ${d} - Simple, healthy, and incredibly flavorful recipe inspiration. Perfect for weeknight dinners or cozy weekend gathers. Pin this to your healthy recipes board and follow along for more! 📌🥗`
    };
  } else {
    return {
      caption: `🍳 Let's make something amazing together! Today's focus is all about ${d}—simple, nourishing, and crafted with a lot of love. Sound like your kind of vibe? Hit that follow button and stay tuned for more! 💛 #WholesomeFoods #KitchenSecrets #Cookbook`
    };
  }
}

// ── ENDPOINT: Generate Title Ideas ──
app.post("/api/ai/generate-titles", async (req, res) => {
  const { authorName, motivation, audience, themes, angles } = req.body;

  try {
    const prompt = `You are a professional cookbook title specialist. Based on this cookbook planning details, generate exactly 4 creative and highly marketable cookbook title ideas.

      Author Name: ${authorName || "Anonymous"}
      Why writing/spark behind it: ${motivation || "Not specified"}
      Target audience: ${Array.isArray(audience) ? audience.join(", ") : (audience || "General")}
      Theme/Focus: ${Array.isArray(themes) ? themes.join(", ") : (themes || "General")}
      Unique Angle and survivor/health elements: ${Array.isArray(angles) ? angles.join(", ") : (angles || "Generic")}`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert editor who creates catchy, memorable, and emotional book titles. Each option must have a clear focus and feel aligned with the author's target audience.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A catchy, professional, and elegant title" },
              subtitle: { type: Type.STRING, description: "Descriptive and engaging subtitle highlighting key dietary/value points" },
              why: { type: Type.STRING, description: "One sentence explaining why this fits their profile" }
            },
            required: ["title", "subtitle", "why"]
          }
        }
      }
    }));

    const cleanText = response.text?.trim() || "[]";
    res.json(JSON.parse(cleanText));
  } catch (error: any) {
    console.warn("Generate titles API failed. Calling local fallback generator instead. Error was:", error.message || error);
    try {
      const fallback = getLocalTitlesFallback(authorName, motivation, audience, themes, angles);
      res.json(fallback);
    } catch (fallbackError) {
      console.error("Fallback generator error:", fallbackError);
      res.status(500).json({ error: "Failed to generate title suggestions", detail: error.message });
    }
  }
});

// ── ENDPOINT: Analyze Niche ──
app.post("/api/ai/analyze-niche", async (req, res) => {
  const { authorName, title, motivation, audience, themes, angles, scale, formats, finalNotes } = req.body;

  try {
    const prompt = `You are an expert cookbook publishing consultant. Analyze this custom cookbook concept and provide strategic niche positioning advice.

      Author: ${authorName || "Anonymous"}
      Title/Working Title: ${title || "TBD"}
      Motivation: ${motivation || "Not specified"}
      Audience: ${Array.isArray(audience) ? audience.join(", ") : (audience || "General")}
      Themes: ${Array.isArray(themes) ? themes.join(", ") : (themes || "General")}
      Unique Angle/Story: ${Array.isArray(angles) ? angles.join(", ") : (angles || "General")}
      Scale: ${scale || "Variable"}
      Formats: ${Array.isArray(formats) ? formats.join(", ") : (formats || "Digital / Print")}
      Additional Notes: ${finalNotes || "None"}`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional retail and self-publishing strategist. Highlight specific gaps, target audiences like Alpha-Gal Syndrome sufferers or cancer recovery patients, and construct highly specific keywords.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryNiche: { type: Type.STRING, description: "One strong, clear sentence defining the unique market position." },
            amazonCategories: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three highly accurate path categories to rank on Amazon Kindle/KDP"
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly six highly searched SEO keywords for Amazon KDP search boxes (max 50 chars each)"
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly three specific strengths of this cookbook concept"
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly two practical suggestions to make the cookbook stand out even more"
            }
          },
          required: ["primaryNiche", "amazonCategories", "keywords", "strengths", "suggestions"]
        }
      }
    }));

    const cleanText = response.text?.trim() || "{}";
    res.json(JSON.parse(cleanText));
  } catch (error: any) {
    console.warn("Analyze niche API failed. Calling local fallback generator instead. Error was:", error.message || error);
    try {
      const fallback = getLocalNicheFallback(authorName, title, motivation, audience, themes, angles, scale, formats);
      res.json(fallback);
    } catch (fallbackError) {
      console.error("Fallback generator error:", fallbackError);
      res.status(500).json({ error: "Failed to perform niche analysis", detail: error.message });
    }
  }
});

// ── ENDPOINT: Design Recommendation ──
app.post("/api/ai/design-recommendation", async (req, res) => {
  const { concept } = req.body;

  try {
    const prompt = `You are an veteran cookbook art director and graphic designer. Based on this cookbook's unique concept, provide a highly personalized design style recommendation for a Canva (free account) workflow.

      Cookbook details: ${concept || "A wholesome family recipe cookbook"}`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional graphic designer, styling books and cards of various kinds. Provide custom brand boards, font pairs, element search tags, and practical Canva free adjustments.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            styleName: { type: Type.STRING, description: "A unique, artistic name for this customized look (e.g. Wholesome Sage Sanctuary)" },
            styleTagline: { type: Type.STRING, description: "A three word descriptor focusing on vibe (e.g. Earthy · Healing · Clean)" },
            reasoning: { type: Type.STRING, description: "Two sentences explaining why this design style perfectly reinforces their target audience's emotions" },
            palette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hex: { type: Type.STRING, description: "An exact color hex code (e.g. #7A9E7E)" },
                  use: { type: Type.STRING, description: "What UI or printable element this color is best for (e.g. accent borders, head text)" }
                },
                required: ["hex", "use"]
              },
              description: "A beautifully curated five-color palette matching the theme"
            },
            headingFont: { type: Type.STRING, description: "A high-quality free Google font name available in Canva (e.g. Playfair Display, Oswald, Dancing Script)" },
            bodyFont: { type: Type.STRING, description: "A highly readable sans-serif Google font for body copy in Canva (e.g. Lato, Montserrat, Open Sans)" },
            fontReasoning: { type: Type.STRING, description: "One sentence explaining why this font pairing is ideal for their cookbook style" },
            coverConcept: { type: Type.STRING, description: "Two sentences describing the best cover layout (e.g. circular hero, split frame) and specific imagery tags to look for" },
            canvaTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly five hyper-specific, actionable design tips utilizing free-tier Canva features for recipe pages"
            },
            elementsToSearch: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly five specific search tags to find gorgeous free vector elements in Canva (e.g. watercolor leaves, rustic line dividers)"
            },
            moodWords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly six descriptive words framing the visual mood (e.g. Safe, Cozy, Organic, Fresh, Clean, Nurturing)"
            }
          },
          required: ["styleName", "styleTagline", "reasoning", "palette", "headingFont", "bodyFont", "fontReasoning", "coverConcept", "canvaTips", "elementsToSearch", "moodWords"]
        }
      }
    }));

    const cleanText = response.text?.trim() || "{}";
    res.json(JSON.parse(cleanText));
  } catch (error: any) {
    console.warn("Design recommendation API failed. Calling local fallback generator instead. Error was:", error.message || error);
    try {
      const fallback = getLocalDesignFallback(concept);
      res.json(fallback);
    } catch (fallbackError) {
      console.error("Fallback generator error:", fallbackError);
      res.status(500).json({ error: "Failed to compile design recommendation", detail: error.message });
    }
  }
});

// ── ENDPOINT: Write Social Media Caption with AI ──
app.post("/api/ai/generate-caption", async (req, res) => {
  const { platform, type, tone, detail } = req.body;

  try {
    const prompt = `Write a gorgeous, high-engagement social media caption for a cookbook author advertising their book.

      Platform: ${platform || "Instagram"}
      Post Type: ${type || "recipe teaser"}
      Tone: ${tone || "warm & personal"}
      Cookbook Description: ${detail || "specialty health recipes"}`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional social media manager and book marketer. Create high-engaging copy. Instagram must have structured line breaks, rich emojis, and 3-5 high-relevance hashtags. Pinterest must focus on search query terms with clear directions. TikTok must create a highly punchy top hook. Do not output anything other than the raw caption. Do not write intros or outros.",
      }
    }));

    const text = response.text?.trim() || "Could not generate caption.";
    res.json({ caption: text });
  } catch (error: any) {
    console.warn("Generate caption API failed. Calling local fallback generator instead. Error was:", error.message || error);
    try {
      const fallback = getLocalCaptionFallback(platform, type, tone, detail);
      res.json(fallback);
    } catch (fallbackError) {
      console.error("Fallback generator error:", fallbackError);
      res.status(500).json({ error: "Failed to generate caption", detail: error.message });
    }
  }
});

// ── VITE & STATIC FILES SERVING ──
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Cookbook Creator Toolkit] Server running on http://localhost:${PORT}`);
  });
}

startServer();
