import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface CartItemRequestBody {
  productId: number;
  quantity?: number;
  note?: string | null;
  profile?: string;
  width?: number;
  height?: number;
  device?: string;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? Number(session.user.id) : null;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? Number(session.user.id) : null;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: CartItemRequestBody = await req.json();

    if (!body.productId)
      return NextResponse.json(
        { error: "ProductId is required" },
        { status: 400 }
      );

    const quantity = body.quantity ?? 1;
    const note = body.note ?? null;
    const profile = body.profile ?? "";
    const device = body.device ?? "vidali";
    const width = Number(body.width) || 0;
    const height = Number(body.height) || 0;
    const m2 = width && height ? Math.max(1, (width * height) / 10000) : 1;

    // Aynı ürün, profil, aparat ve not ile kontrol
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId: body.productId,
        profile,
        device,
        note,
      },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
      return NextResponse.json(updated);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId: body.productId,
        quantity,
        note,
        profile,
        width,
        height,
        m2,
        device,
      },
      include: { product: true },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? Number(session.user.id) : null;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.cartItem.deleteMany({ where: { userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete cart items" },
      { status: 500 }
    );
  }
}
