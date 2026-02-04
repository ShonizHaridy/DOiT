I see the schema. The price field in your HeroSection model is indeed a Decimal?.

The reason you are seeing "price": "990" (a string) in your debug log, even though the schema says Decimal, is because of how Prisma 7 serializes Decimal fields to JSON during that console.log.

The DecimalError is triggered because class-transformer is trying to pass that string (or an undefined value) into the Prisma internal Decimal constructor during plainToInstance, and that constructor is failing.

Since we've already tried the decorators and it's still choking, we need to handle the conversion before the class-transformer logic touches it.

The Guaranteed Fix: Manual Mapping
In your ContentService, modify the getHomeContent method to explicitly convert the Decimal strings to Numbers before calling plainToInstance.

TypeScript
async getHomeContent(): Promise<HomeContentDto> {
  const [heroSectionsRaw, vendorsRaw, bannersRaw] = await Promise.all([
    this.prisma.heroSection.findMany({
      where: { status: true },
      orderBy: { order: 'asc' },
    }),
    this.prisma.vendor.findMany({
      where: { status: true },
      orderBy: { order: 'asc' },
    }),
    this.prisma.bannerAd.findMany({
      where: { status: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  // 1. Manually map the raw data to handle the Decimal string conversion
  // This removes any ambiguity before class-transformer starts its work.
  const mappedHeroSections = heroSectionsRaw.map(hero => ({
    ...hero,
    // Convert Prisma Decimal object/string to a plain JS number
    price: hero.price ? Number(hero.price) : undefined,
  }));

  // 2. Now transform the cleaned data
  const heroSections = plainToInstance(HeroSectionDto, mappedHeroSections);
  const banners = plainToInstance(BannerAdDto, bannersRaw);
  const vendors = plainToInstance(VendorDto, vendorsRaw);

  return {
    heroSections,
    vendors,
    banners,
  };
}
Why this is the "best" fix for Prisma 7:
Version 7 Strictness: Prisma 7's new engine-less runtime uses a different internal representation for Decimals that class-transformer doesn't natively "speak" yet.

Serialization: When Prisma returns a Decimal, it’s an object. When you pass it through plainToInstance, the transformer tries to re-instantiate it. If it sees a string "990", it tries to call new Decimal(undefined) internally at some point in the chain, causing your crash.

Performance: Number(hero.price) is extremely fast and happens before the expensive reflection-based transformation.

One Final Ritual Check
Since you are using a custom output path (../generated/prisma), make sure your schema.prisma is synced with your build:

npx prisma generate

npm run build

If you apply this manual mapping in the service, the error will stop because price will reach the HeroSectionDto as a plain number, and the Decimal2 constructor will never be called.

Would you like me to also check your PopupOffer service logic? It also uses a Decimal for the amount field and will likely run into the same issue.

now worked, there is no way other than manual mapping !!

I'm glad that worked! I know manual mapping feels like a "defeat" when you have a powerful tool like class-transformer, but there is actually a technical reason why this is happening with Prisma 7 specifically.

The "Why": The Prisma 7 "Engine-less" Shift
In Prisma 6 and below, Decimals were handled by a Rust engine and passed to Node.js as a specific Decimal.js class instance.

In Prisma 7, they switched to a purely TypeScript-based runtime. When you use a custom output path (../generated/prisma), class-transformer loses the metadata connection. It sees a field that should be a Decimal, looks into your node_modules, but finds the "wrong" Prisma runtime because your client is generated elsewhere. It then tries to "fix" the object by re-instantiating it, passing undefined into the internal Prisma constructor.

Is there a way without manual mapping?
Yes, but it requires a bit more "heavy lifting" in your configuration. Here are the two alternatives to manual mapping:

1. The Global Serializer Way (Recommended for Clean Code)
Instead of mapping in every service, you can use a Global Interceptor that handles Prisma Decimals application-wide. Since you're already using ClassSerializerInterceptor in main.ts, you can create a custom one:

TypeScript
// src/common/interceptors/prisma-decimal.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class PrismaDecimalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => this.recursiveConvert(data))
    );
  }

  private recursiveConvert(obj: any): any {
    if (Array.isArray(obj)) return obj.map(i => this.recursiveConvert(i));
    if (obj !== null && typeof obj === 'object') {
      // Prisma 7 Decimals often have a d, e, s, and constructor.name property
      if (obj.constructor?.name === 'Decimal' || obj.hasOwnProperty('d')) {
        return Number(obj);
      }
      for (const key in obj) {
        obj[key] = this.recursiveConvert(obj[key]);
      }
    }
    return obj;
  }
}
Then, add it to main.ts: app.useGlobalInterceptors(new PrismaDecimalInterceptor());

2. Change the Client Output (The "Standard" Way)
If you move your generator output back to the default node_modules/.prisma/client, class-transformer and reflect-metadata will usually recognize the internal types correctly, and your @ToNumber() decorator will start working again without crashing.

My Recommendation
Since you’ve already implemented the manual mapping and it's working: Keep it for now. It is "Type Safe" and explicit. In a 3-tier hierarchy like yours (Category -> Sub -> List), being explicit prevents the DecimalError from popping up in nested relations later (like in Order prices or Offer amounts).

One more thing...
Since you have many Decimal fields in your schema (Orders, Offers, Products), would you like me to help you create a generic DecimalMapper utility so you don't have to write .map() logic over and over in your services?