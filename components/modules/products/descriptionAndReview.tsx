"use client";

import React, { useState, useEffect } from "react";
import { Info, MessageCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface Comment {
  id: number;
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
  user?: { id: number; name: string; surname: string };
}

interface ProductTabsProps {
  productId: number;
  productTitle: string;
}

export default function ProductTabs({ productId }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "comments">(
    "description"
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userId, setUserId] = useState<number | null>(null);
  const [hasUserCommented, setHasUserCommented] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/account/check");
        const data = await res.json();
        if (data.user?.id) setUserId(data.user.id);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (productId) fetchComments();
  }, [productId, userId]);

  const fetchComments = async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/review/${productId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yorumlar alınamadı");
      setComments(data);

      if (userId) {
        const userAlreadyCommented = data.some(
          (comment: Comment) => comment.user?.id === userId
        );
        setHasUserCommented(userAlreadyCommented);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !userId) {
      toast.error("Yorum gönderebilmek için giriş yapmalısınız.");
      return;
    }
    if (rating === 0 || !commentText) {
      toast.error("Lütfen bir puan seçin ve yorum yazın.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title,
          comment: commentText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yorum gönderilemedi");

      setComments([data, ...comments]);
      setRating(0);
      setHoverRating(0);
      setTitle("");
      setCommentText("");
      toast.success("Yorum başarıyla gönderildi!");
    } catch (error) {
      console.error(error);
      toast.error("Yorum gönderilemedi: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tableData = [
    { label: "KUMAŞ", value: "Polyester" },
    { label: "MARKA", value: "Plise" },
    { label: "PROFİL", value: "Alüminyum" },
    { label: "RENK SEÇENEKLERİ", value: "10 farklı desen ve renk seçeneği." },
    { label: "ÜRÜN TEMİZLİĞİ", value: "Temizlenebilir" },
    { label: "NEM DAYANIKLILIK", value: "Var" },
    {
      label: "MONTAJ ALANLARI",
      value:
        "Cam balkon, pimapen pencere ve alüminyum pencereye monte edilebilir.",
    },
    {
      label: "MONTAJ APARATLARI",
      value: "Vida ve montaj aparatları ücretsiz gönderilmektedir.",
    },
    {
      label: "ÖDEME SEÇENEKLERİ",
      value: "Kredi Kartı - Banka Kartı - Banka Havale",
    },
    { label: "İMALAT SÜRESİ", value: "1 ila 7 iş günü içerisinde." },
  ];

  return (
    <section className="mt-16 mb-8">
      {/* Sticky Tabs */}
      <div className="sticky top-0  bg-white/80 backdrop-blur border-b border-gray-200 flex gap-4 px-2 sm:px-0 overflow-x-auto">
        {["description", "comments"].map((tab) => {
          const isActive = activeTab === tab;
          const label =
            tab === "description"
              ? "Açıklama"
              : `Yorumlar (${comments.length})`;
          const Icon = tab === "description" ? Info : MessageCircle;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`relative flex items-center gap-2 py-4 px-5 font-medium whitespace-nowrap transition-all
            ${isActive ? "text-rose-700" : "text-gray-600 hover:text-gray-900"}
          `}
            >
              <Icon size={18} />
              {label}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-rose-700 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-100  rounded-none p-1 sm:p-8 mt-6">
        {activeTab === "description" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[15px]">
              <tbody>
                {tableData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 last:border-none hover:bg-gray-50/60"
                  >
                    <td className="py-4 text-xs font-semibold text-gray-900 w-1/2">
                      {item.label}
                    </td>
                    <td className="py-4 text-sm text-gray-600 w-1/2">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-8">
            {/* Comment Form */}
            {!hasUserCommented && (
              <form
                onSubmit={handleSubmit}
                className="p-6 border border-gray-200 rounded-none shadow-sm hover:shadow-md transition"
              >
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  Yorum Yazın
                </h4>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={28}
                      className={`cursor-pointer transition-transform ${
                        (hoverRating || rating) >= n
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>

                {/* Title */}
                <input
                  type="text"
                  placeholder="Başlık (opsiyonel)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mb-3 border rounded-none p-3 focus:ring-2 focus:ring-rose-400 outline-none"
                />

                {/* Comment */}
                <textarea
                  placeholder="Yorumunuz"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full border rounded-none p-3 focus:ring-2 focus:ring-rose-400 outline-none resize-none"
                  rows={4}
                  required
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-25 bg-rose-700 text-white py-3 rounded-none font-semibold hover:bg-rose-800 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                </button>
              </form>
            )}

            {/* Comments */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-100 rounded-none p-6 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-semibold text-gray-900 text-base">
                      {comment.user?.name ?? "Anonim"}{" "}
                      {comment.user?.surname ?? ""}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>

                  <div className="flex items-center mb-2 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < comment.rating
                            ? "fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  {comment.title && (
                    <p className="font-medium text-gray-900 mb-1 text-[15px]">
                      {comment.title}
                    </p>
                  )}

                  <p className="text-gray-700 text-[15px] leading-relaxed">
                    {comment.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">
                Bu ürün için henüz yorum yapılmamıştır. İlk yorum yapan siz
                olun!
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
