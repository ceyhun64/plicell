// app/api/products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

interface ProductData {
  title: string;
  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
  description: string;
  pricePerM2: number;
  rating: number;
  reviewCount?: number;
  category: string;
  subCategory?: string;
  room?: string;
}

// GET /api/products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, subCategory: true, room: true },
      orderBy: { createdAt: "desc" },
    });

    const productsData: ProductData[] = products.map((p) => ({
      id: p.id,
      title: p.title,
      pricePerM2: p.pricePerM2,
      rating: p.rating,
      reviewCount: p.reviewCount ?? undefined, // null ise undefined yap
      description: p.description,
      mainImage: p.mainImage,
      subImage: p.subImage ?? undefined, // null ise undefined yap
      subImage2: p.subImage2 ?? undefined,
      subImage3: p.subImage3 ?? undefined,
      category: p.category.name,
      subCategory: p.subCategory?.name ?? undefined,
      room: p.room?.name  ?? undefined,
    }));

    return NextResponse.json({ products: productsData }, { status: 200 });
  } catch (error: any) {
    console.error("Prisma fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const mainFile = formData.get("file") as File | null;
    const subFile = formData.get("subImageFile") as File | null;
    const subFile2 = formData.get("subImage2File") as File | null;
    const subFile3 = formData.get("subImage3File") as File | null;

    if (!mainFile) {
      return NextResponse.json(
        { success: false, error: "Ürün ana görseli bulunamadı." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Görselleri yükleme fonksiyonu
    async function uploadFile(file: File, folder: string) {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("folderName", folder);

      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      return data.path as string;
    }

    const mainImagePath = await uploadFile(mainFile, "products");
    const subImagePath = subFile
      ? await uploadFile(subFile, "products")
      : undefined;
    const subImage2Path = subFile2
      ? await uploadFile(subFile2, "products")
      : undefined;
    const subImage3Path = subFile3
      ? await uploadFile(subFile3, "products")
      : undefined;

    const title = formData.get("title") as string;
    const pricePerM2 = parseFloat(formData.get("pricePerM2") as string);
    const description = formData.get("description") as string;
    const rating = parseFloat(formData.get("rating") as string);
    const reviewCount = formData.get("reviewCount")
      ? parseInt(formData.get("reviewCount") as string)
      : undefined;
    const mainCategoryName = formData.get("category") as string;
    const subCategoryName = formData.get("subCategory") as string | null;

    // Ana kategori bul
    const mainCategory = await prisma.category.findFirst({
      where: { name: mainCategoryName },
    });
    if (!mainCategory) {
      return NextResponse.json(
        { success: false, error: "Ana kategori bulunamadı." },
        { status: 404 }
      );
    }

    // Alt kategori bul
    let subCategoryId: number | undefined = undefined;
    if (subCategoryName) {
      const subCategory = await prisma.subCategory.findFirst({
        where: { name: subCategoryName, categoryId: mainCategory.id },
      });
      if (!subCategory) {
        return NextResponse.json(
          { success: false, error: "Alt kategori bulunamadı." },
          { status: 404 }
        );
      }
      subCategoryId = subCategory.id;
    }

    // Ürün oluştur
    const product = await prisma.product.create({
      data: {
        title,
        pricePerM2,
        rating,
        reviewCount,
        mainImage: mainImagePath,
        subImage: subImagePath,
        subImage2: subImage2Path,
        subImage3: subImage3Path,
        description: formData.get("description") as string,
        categoryId: mainCategory.id,
        subCategoryId,
      },
      include: { category: true, subCategory: true },
    });

    const productData: ProductData = {
      title: product.title,
      pricePerM2: product.pricePerM2,
      rating: product.rating,
      reviewCount: product.reviewCount ?? undefined,
      description: product.description ?? undefined,
      mainImage: product.mainImage,
      subImage: product.subImage ?? undefined,
      subImage2: product.subImage2 ?? undefined,
      subImage3: product.subImage3 ?? undefined,
      category: product.category.name,
      subCategory: product.subCategory?.name,
    };

    return NextResponse.json(
      { success: true, product: productData },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Ürün oluştururken hata:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
