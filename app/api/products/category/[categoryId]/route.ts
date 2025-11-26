// /app/api/products/category/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface ProductData {
  id: number;
  title: string;
  pricePerM2: number;
  rating?: number;
  reviewCount?: number;
  description?: string;
  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
  category: string;
  subCategory?: string;
  room?: string;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await context.params;

    const products = await prisma.product.findMany({
      where: { categoryId: Number(categoryId) },
      include: { category: true, subCategory: true, room: true },
      orderBy: { createdAt: "desc" },
    });

    const productsData: ProductData[] = products.map((p) => ({
      id: p.id,
      title: p.title,
      pricePerM2: p.pricePerM2,
      rating: p.rating,
      reviewCount: p.reviewCount ?? undefined,
      description: p.description,
      mainImage: p.mainImage,
      subImage: p.subImage ?? undefined,
      subImage2: p.subImage2 ?? undefined,
      subImage3: p.subImage3 ?? undefined,
      category: p.category.name,
      subCategory: p.subCategory?.name ?? undefined,
      room: p.room?.name ?? undefined,
    }));

    return NextResponse.json({ products: productsData }, { status: 200 });
  } catch (error: any) {
    console.error("Kategoriye göre ürünler çekilemedi:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
