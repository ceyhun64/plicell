// app/api/payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * İyzipay için HMAC-SHA256 signature oluşturur
 * Format: HMAC-SHA256(randomKey + uri + requestBody)
 */
function generateIyzicoSignature(
  randomKey: string,
  uri: string,
  requestBody: string,
  secretKey: string
): string {
  const dataToSign = randomKey + uri + requestBody;
  return crypto
    .createHmac("sha256", secretKey)
    .update(dataToSign)
    .digest("hex");
}

/**
 * İyzipay authorization header'ı oluşturur
 */
function createAuthorizationHeader(
  apiKey: string,
  secretKey: string,
  uri: string,
  requestBody: string
): {
  authorization: string;
  randomKey: string;
} {
  const randomKey = crypto.randomBytes(16).toString("hex");
  const signature = generateIyzicoSignature(
    randomKey,
    uri,
    requestBody,
    secretKey
  );

  const authString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  const authorization = `IYZWSv2 ${Buffer.from(authString).toString("base64")}`;

  return { authorization, randomKey };
}

/**
 * Tarihleri İyzipay formatına çevirir (YYYY-MM-DD HH:mm:ss)
 */
function formatDateForIyzipay(date: string | Date): string {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

/**
 * Fiyat hesaplama ve hizmet bedeli ekleme
 */
function calculatePricing(basketItems: BasketItem[]) {
  // Sepet toplamını hesapla
  const subtotal = basketItems.reduce((sum, item) => {
    const price =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    return sum + price;
  }, 0);

  // %10 hizmet bedeli ekle
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    serviceFee: parseFloat(serviceFee.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
}

// Tipler
interface PaymentCard {
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
}

interface Buyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  identityNumber: string;
  registrationDate: string;
  lastLoginDate: string;
  phone: string;
  city: string;
  country: string;
  zipCode: string;
  ip: string;
}

interface Address {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode: string;
}

interface BasketItem {
  id: string | number;
  name?: string;
  category1?: string;
  itemType?: string;
  price: number | string;
}

interface PaymentRequestBody {
  paymentCard: PaymentCard;
  buyer: Buyer;
  shippingAddress: Address;
  billingAddress: Address;
  basketItems: BasketItem[];
  currency?: string;
  basketId?: string;
}

/**
 * POST /api/payment
 * İyzipay ödeme işlemini gerçekleştirir
 */
export async function POST(req: NextRequest) {
  try {
    // Request body'yi parse et
    const body: PaymentRequestBody = await req.json();
    const {
      paymentCard,
      buyer,
      shippingAddress,
      billingAddress,
      basketItems,
      currency = "TRY",
      basketId,
    } = body;

    // Environment variables kontrolü
    const apiKey = process.env.IYZICO_API_KEY;
    const secretKey = process.env.IYZICO_SECRET_KEY;
    const baseUrl =
      process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

    if (!apiKey || !secretKey) {
      console.error("İyzipay API credentials eksik!");
      return NextResponse.json(
        {
          status: "error",
          error: "Payment configuration error. Please contact support.",
        },
        { status: 500 }
      );
    }

    // Buyer tarihlerini formatla
    const formattedBuyer = {
      ...buyer,
      registrationDate: formatDateForIyzipay(buyer.registrationDate),
      lastLoginDate: formatDateForIyzipay(buyer.lastLoginDate),
    };

    // Fiyat hesaplaması (%10 hizmet bedeli dahil)
    const pricing = calculatePricing(basketItems);

    // Sepet ürünleri (orijinal fiyatlarla)
    const formattedBasketItems = basketItems.map((item) => {
      const price =
        typeof item.price === "string" ? parseFloat(item.price) : item.price;
      return {
        id: item.id.toString(),
        name: item.name || "Ürün",
        category1: item.category1 || "Genel",
        itemType: item.itemType || "PHYSICAL",
        price: price.toFixed(2),
      };
    });

    // Hizmet bedeli ürün olarak ekle
    formattedBasketItems.push({
      id: "SERVICE_FEE",
      name: "Hizmet Bedeli",
      category1: "Hizmet",
      itemType: "VIRTUAL",
      price: pricing.serviceFee.toFixed(2),
    });

    // İyzipay ödeme request body'si
    const paymentRequest = {
      locale: "tr",
      conversationId: Date.now().toString(),
      price: pricing.total.toFixed(2),
      paidPrice: pricing.total.toFixed(2),
      currency,
      basketId: basketId || `B${Date.now()}`,
      paymentChannel: "WEB",
      paymentCard: {
        cardHolderName: paymentCard.cardHolderName,
        cardNumber: paymentCard.cardNumber.replace(/\s/g, ""),
        expireMonth: paymentCard.expireMonth,
        expireYear: paymentCard.expireYear,
        cvc: paymentCard.cvc,
        registerCard: 0,
      },
      buyer: formattedBuyer,
      shippingAddress: {
        contactName: shippingAddress.contactName,
        city: shippingAddress.city,
        country: shippingAddress.country,
        address: shippingAddress.address,
        zipCode: shippingAddress.zipCode,
      },
      billingAddress: {
        contactName: billingAddress.contactName,
        city: billingAddress.city,
        country: billingAddress.country,
        address: billingAddress.address,
        zipCode: billingAddress.zipCode,
      },
      basketItems: formattedBasketItems,
    };

    // Request body'yi JSON'a çevir
    const requestBody = JSON.stringify(paymentRequest);

    // Authorization header'ı oluştur
    const uri = "/payment/auth";
    const { authorization, randomKey } = createAuthorizationHeader(
      apiKey,
      secretKey,
      uri,
      requestBody
    );

    console.log("İyzipay ödeme isteği gönderiliyor...", {
      endpoint: `${baseUrl}${uri}`,
      subtotal: pricing.subtotal,
      serviceFee: pricing.serviceFee,
      total: pricing.total,
      itemCount: formattedBasketItems.length,
    });

    // İyzipay API'ye istek gönder
    const response = await fetch(`${baseUrl}${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        "x-iyzi-rnd": randomKey,
        Accept: "application/json",
      },
      body: requestBody,
    });

    // Response'u parse et
    const result = await response.json();

    // Başarılı ödeme kontrolü
    if (result.status === "success") {
      console.log("✅ İyzipay ödeme başarılı:", {
        paymentId: result.paymentId,
        conversationId: result.conversationId,
        amount: pricing.total,
      });

      return NextResponse.json({
        status: "success",
        paymentId: result.paymentId,
        conversationId: result.conversationId,
        fraudStatus: result.fraudStatus,
        pricing: {
          subtotal: pricing.subtotal,
          serviceFee: pricing.serviceFee,
          total: pricing.total,
        },
        ...result,
      });
    }

    // Hatalı ödeme
    console.error("❌ İyzipay ödeme hatası:", {
      errorCode: result.errorCode,
      errorMessage: result.errorMessage,
      errorGroup: result.errorGroup,
    });

    return NextResponse.json(
      {
        status: "error",
        error: result.errorMessage || "Ödeme işlemi başarısız oldu",
        errorCode: result.errorCode,
        errorGroup: result.errorGroup,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("💥 Payment API kritik hata:", error);

    return NextResponse.json(
      {
        status: "error",
        error: "Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
