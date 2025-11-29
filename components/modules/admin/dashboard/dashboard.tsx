"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/modules/admin/sideBar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import {
  Package,
  ShoppingCart,
  Users,
  FileText,
  Loader,
  CheckCircle,
  Truck,
  XCircle,
  UserPlus,
} from "lucide-react";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface KPI {
  id: string;
  title: string;
  stat: number;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export default function AdminDashboard() {
  const isMobile = useIsMobile();
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusBadge = (status: string) => {
    const tr: Record<string, any> = {
      pending: [
        "Ödeme Bekleniyor",
        "bg-yellow-500",
        <Loader className="w-3 h-3 animate-spin" />,
      ],
      paid: [
        "Ödeme Başarılı",
        "bg-blue-600",
        <CheckCircle className="w-3 h-3" />,
      ],
      shipped: [
        "Kargoya Verildi",
        "bg-amber-600",
        <Truck className="w-3 h-3" />,
      ],
      delivered: [
        "Teslim Edildi",
        "bg-green-600",
        <Package className="w-3 h-3" />,
      ],
      cancelled: [
        "İptal Edildi",
        "bg-red-700",
        <XCircle className="w-3 h-3" />,
      ],
    };

    const [label, color, icon] = tr[status] || [
      "Bilinmiyor",
      "bg-gray-400",
      null,
    ];

    return (
      <Badge
        className={`${color} flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium`}
      >
        {icon} {label}
      </Badge>
    );
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productRes, orderRes, userRes, blogRes, subsRes] =
        await Promise.all([
          fetch("/api/products"),
          fetch("/api/order"),
          fetch("/api/user/all"),
          fetch("/api/blog"),
          fetch("/api/subscribe"),
        ]);

      const products = await productRes.json();
      const orders = await orderRes.json();
      const users = await userRes.json();
      const blogs = await blogRes.json();
      const subscribers = await subsRes.json();

      setKpiData([
        {
          id: "products",
          title: "Ürünler",
          stat: products.products?.length || 0,
          description: "Ürünleri yönet",
          icon: <Package size={24} className="text-blue-500" />,
          href: "/admin/products",
        },
        {
          id: "orders",
          title: "Siparişler",
          stat: orders.orders?.length || 0,
          description: "Siparişleri yönet",
          icon: <ShoppingCart size={24} className="text-emerald-500" />,
          href: "/admin/orders",
        },
        {
          id: "users",
          title: "Kullanıcılar",
          stat: users.users?.length || 0,
          description: "Kullanıcıları yönet",
          icon: <Users size={24} className="text-violet-500" />,
          href: "/admin/users",
        },
        {
          id: "blogs",
          title: "Bloglar",
          stat: blogs.blogs?.length || 0,
          description: "Blog listesini görüntüle",
          icon: <FileText size={24} className="text-yellow-500" />,
          href: "/admin/blogs",
        },
        {
          id: "subscribers",
          title: "Aboneler",
          stat: Array.isArray(subscribers) ? subscribers.length : 0,
          description: "Aboneleri yönet",
          icon: <UserPlus size={24} className="text-teal-500" />,
          href: "/admin/subscribers",
        },
      ]);

      const latestOrders =
        orders.orders
          ?.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5) || [];

      const userMap: Record<number, any> = {};
      users.users?.forEach((u: any) => (userMap[u.id] = u));
      latestOrders.forEach(
        (o: any) =>
          (o.user = userMap[o.userId] || {
            name: "Bilinmiyor",
            surname: "",
            email: "-",
          })
      );

      setRecentOrders(latestOrders);
    } catch (err) {
      console.error("API hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar />
      <main className={`flex-1 p-4 md:p-8 ${isMobile ? "" : "md:ml-64"}`}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-3 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#001e59]">
            Yönetim Paneli
          </h1>
        </div>

        {/* KPI CARDS */}
        <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kpiData.map((card) => (
            <Link key={card.id} href={card.href}>
              <Card className="bg-white border hover:shadow-lg hover:scale-[1.03] transition-transform duration-300 cursor-pointer">
                <CardHeader className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-md">{card.icon}</div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-2xl font-bold text-gray-900">
                      {card.stat}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-500">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* LAST ORDERS */}
        <Card className="bg-white border rounded-md shadow-md overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Son Siparişler
            </CardTitle>
            <Separator className="mt-2 bg-gray-200" />
          </CardHeader>

          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-6">
                Henüz sipariş bulunmamaktadır.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-separate border-spacing-0">
                  <thead className="bg-gray-100 text-[#001e59] font-semibold">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Müşteri</th>
                      <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                      <th className="px-4 py-3">Ürünler</th>
                      <th className="px-4 py-3 hidden md:table-cell">Tutar</th>
                      <th className="px-4 py-3 hidden lg:table-cell">Durum</th>
                      <th className="px-4 py-3 hidden md:table-cell">Tarih</th>
                      <th className="px-4 py-3">Detay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">{order.id}</td>
                        <td className="px-4 py-3 font-medium">
                          {order.user.name} {order.user.surname}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {order.user.email}
                        </td>
                        <td className="px-4 py-3 truncate max-w-xs">
                          {(order.items || [])
                            .map((i: any) => i.product?.title)
                            .join(", ")}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-emerald-600 font-semibold">
                          {order.paidPrice?.toLocaleString("tr-TR")} ₺
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString(
                            "tr-TR"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/orders?orderId=${order.id}`}>
                            <Button size="sm" variant="outline">
                              Gör
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
