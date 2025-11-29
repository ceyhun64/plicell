"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/modules/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DefaultPagination from "@/components/layout/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

// ---- Tipler ----
interface Subscriber {
  id: number;
  email: string;
}

export default function Subscribers() {
  const isMobile = useIsMobile();

  const [users, setUsers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mailSubject, setMailSubject] = useState<string>("");
  const [mailMessage, setMailMessage] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // ---- Abone çekme ----
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/subscribe");
        const data: Subscriber[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p className="text-white p-4">Loading...</p>;

  // ---- Filtreleme ----
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  // ---- Tek kullanıcı sil ----
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/subscribe/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Silme başarısız");

      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Abone silinirken bir hata oluştu.");
    }
  };

  // ---- Toplu silme ----
  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedIds) {
        const res = await fetch(`/api/subscribe/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Silme başarısız");
      }

      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Bulk delete failed:", err);
      toast.error("Seçilen aboneler silinirken bir hata oluştu.");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // ---- Mail Gönder ----
  const handleSendMail = async () => {
    const recipients =
      selectedIds.length > 0
        ? users.filter((u) => selectedIds.includes(u.id)).map((u) => u.email)
        : users.map((u) => u.email);

    if (!mailSubject || !mailMessage) {
      toast.warning("Lütfen konu ve mesaj alanlarını doldurun.");
      return;
    }

    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject: mailSubject,
          message: mailMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Mail gönderilemedi.");
        return;
      }

      toast.success(`Mail başarıyla gönderildi! (${recipients.length} kişi)`);
      setMailSubject("");
      setMailMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Mail gönderilirken bir hata oluştu.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar />
      <main className={`flex-1 p-4 md:p-8 ${isMobile ? "" : "ml-64"}`}>
        <div className="flex flex-col sm:flex-row justify-center md:justify-between md:items-start items-center mb-6 mt-3 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#001e59]">
            {" "}
            Aboneler
          </h1>
        </div>

        {/* ---- Mail Gönderme ---- */}
        <div className="mb-8 p-6 bg-white rounded-xs shadow-md border border-gray-200 w-full md:w-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Abonelere Mail Gönder
          </h2>

          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Konu"
              value={mailSubject}
              onChange={(e) => setMailSubject(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
            />

            <Textarea
              placeholder="Mesajınızı yazın..."
              value={mailMessage}
              onChange={(e) => setMailMessage(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500 min-h-[120px]"
            />

            <Button
              onClick={handleSendMail}
              className="bg-rose-800 hover:bg-rose-900 text-white"
            >
              Mail Gönder
            </Button>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {selectedIds.length > 0
              ? `Seçilen ${selectedIds.length} kullanıcıya gönderilecek.`
              : "Tüm abonelere gönderilecek."}
          </p>
        </div>

        {/* Arama & silme */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <Button
            className={`w-full md:w-auto ${
              selectedIds.length > 0
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={selectedIds.length === 0}
            onClick={handleDeleteSelected}
          >
            Seçilenleri Sil ({selectedIds.length})
          </Button>

          <Input
            type="text"
            placeholder="Email ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* ---- Mobil kart görünümü ---- */}
        {isMobile ? (
          <div className="flex flex-col gap-4">
            {paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">
                    {user.email} (#{user.id})
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 hover:bg-red-500 text-white"
                  >
                    Sil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ---- Masaüstü tablo ---- */
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-300 rounded-xl bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b border-gray-300">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === paginatedUsers.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-gray-800">
                    ID
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-gray-800">
                    Email
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-gray-800">
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b border-gray-200">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => handleSelectOne(user.id)}
                      />
                    </td>

                    <td className="px-4 py-2 border-b border-gray-200 text-gray-800">
                      {user.id}
                    </td>

                    <td className="px-4 py-2 border-b border-gray-200 text-gray-800">
                      {user.email}
                    </td>

                    <td className="px-4 py-2 border-b border-gray-200 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 hover:bg-red-500 text-white"
                      >
                        Sil
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---- Pagination ---- */}
        <div className="mt-4">
          <DefaultPagination
            totalItems={filteredUsers.length}
            itemsPerPage={15}
            currentPage={currentPage}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      </main>
    </div>
  );
}
