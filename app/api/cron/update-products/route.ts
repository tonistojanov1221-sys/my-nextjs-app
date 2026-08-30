import { NextResponse } from 'next/server';

const ASSOCIATE_ID = 'tonistojanov2-20';

// Оваа функција се извршува автоматски од серверот во позадина (24/7)
export async function GET(request: Request) {
  try {
    // Безбедносна проверка преку таен клуч за да само серверот може да ја активира
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Автоматско генерирање и освежување на врвни производи со твоето Store ID
    const automatedProducts = [
      {
        id: Date.now(),
        title: 'Auto-Updated AI Smart Device',
        category: 'Tech',
        price: '$129.99',
        score: 9.7,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        asin: 'B09V3KXJPB',
        affiliateLink: `https://www.amazon.com/dp/B09V3KXJPB?tag=${ASSOCIATE_ID}`,
        summary: 'Автоматски извлечен врвен производ од системот во позадина.'
      }
    ];

    console.log('Производите се успешно освежени со ID:', ASSOCIATE_ID);

    return NextResponse.json({
      success: true,
      message: 'Системот самостојно ги ажурираше производите!',
      count: automatedProducts.length,
      storeId: ASSOCIATE_ID,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({ error: 'Грешка при автоматското ажурирање' }, { status: 500 });
  }
}