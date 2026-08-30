import { NextResponse } from "next/server";

const STORE_ID = "tonistojanov2-20";

// Понуди кои ботот ротирачки ќе ги објавува 24/7
const FEATURED_DEALS = [
  {
    title: "🔥 Најдобра понуда: Sony WH-1000XM5 Headphones",
    query: "sony wh 1000xm5",
    desc: "Врвно поништување на бучава и премиум звук на попуст на Amazon!",
  },
  {
    title: "💻 Трендинг: Apple MacBook Air M3",
    query: "macbook air m3",
    desc: "Ултра брз лаптоп со целодневен век на батеријата.",
  },
  {
    title: "☕ Топ попуст: Breville Barista Touch",
    query: "breville barista touch",
    desc: "Уживај во совршено еспресо секој ден директно во твојот дом.",
  },
  {
    title: "🎮 Гејминг понуда: PlayStation 5 Slim",
    query: "playstation 5 slim",
    desc: "Најновата генерација на гејминг со брза испорака.",
  },
];

export async function GET() {
  try {
    const FB_PAGE_ID = process.env.FB_PAGE_ID;
    const FB_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

    // Избираме случаен производ за објава
    const deal = FEATURED_DEALS[Math.floor(Math.random() * FEATURED_DEALS.length)];
    const affiliateUrl = `https://www.amazon.com/s?k=${encodeURIComponent(deal.query)}&tag=${STORE_ID}`;

    const message = `${deal.title}\n\n${deal.desc}\n\n👉 Провери ги цените и попустите овде: ${affiliateUrl}\n\n#AmazonDeals #SmartPick #Shopping #Tech`;

    if (!FB_PAGE_ID || !FB_ACCESS_TOKEN) {
      return NextResponse.json({
        status: "Тест успешност (Потребни се FB Environment променливи за живо објавување)",
        generatedMessage: message,
      });
    }

    // Автоматско испраќање објава до Facebook Graph API
    const fbRes = await fetch(`https://graph.facebook.com/v19.0/${FB_PAGE_ID}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        link: affiliateUrl,
        access_token: FB_ACCESS_TOKEN,
      }),
    });

    const data = await fbRes.json();
    return NextResponse.json({ success: true, fb_response: data });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}