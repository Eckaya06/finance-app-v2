// src/services/aiService.js

const GEMINI_API_KEY = "AIzaSyB_bINiWmZA1Rsdedwg-6krFbR6_CwWL1Y"; 

// ✅ En güncel v1beta endpoint'i
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const getAiResponse = async (userPrompt, transactions) => {
  // Finansal verileri metne döküyoruz
  const financeContext = transactions.length > 0 
    ? transactions.map(t => `- ${new Date(t.id).toLocaleDateString()}: ${t.category}, ${t.amount} TL, ${t.type}`).join('\n')
    : "Henüz harcama kaydı yok.";

  const systemInstruction = `
    Sen Muhammed Enes'in finans asistanısın. 
    İsmim Gemini 3 Flash altyapısına dayanıyor. 
    Lütfen sadece Türkçe cevap ver ve Muhammed Enes'e ismiyle hitap et.
    Veriler:
    ${financeContext}
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemInstruction + "\n\nSoru: " + userPrompt }]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // 404 hatası alırsak konsola detaylıca neyin bulunamadığını yazalım
      console.error("Hata Detayı:", data);
      throw new Error(data.error?.message || "Model bulunamadı.");
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Bağlantı Hatası:", error);
    return "Muhammed Enes, şu an API kapısında bir sorun var gibi görünüyor. Model ismi veya API versiyonuyla ilgili bir uyumsuzluk yaşıyoruz.";
  }
};