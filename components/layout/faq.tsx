"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HelpCircle, Headset, ChevronDown } from "lucide-react"; // ChevronDown eklendi
import { motion } from "framer-motion";

/**
 * Modern Stil Sıkça Sorulan Sorular (FAQ) Bölümü
 */
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Tema rengi için sabit değişken
  const primaryColor = "#7B0323"; // Gül kırmızısının koyu tonu
  const lightColor = "text-rose-600";
  const hoverColor = "hover:text-rose-800";

  const faqs = [
    {
      question: "Üye Olmadan Sipariş Verebilir Miyim?",
      answer: (
        <>
          <p className="mb-2">
            Evet, Moda Perde'den üye olmadan da kolayca sipariş verebilirsiniz!
          </p>
          <p className="mb-2">
            Misafir kullanıcı olarak alışveriş yapmanıza olanak tanıyan
            sistemimiz sayesinde hızlı ve zahmetsiz bir şekilde siparişlerinizi
            tamamlayabilirsiniz.
          </p>
          <div>
            <strong className="text-rose-700">
              Ancak, üye olmanın avantajlarını da unutmayın!{" "}
            </strong>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-gray-600">
              <li>Siparişlerinizi kolayca takip edebilir,</li>
              <li>Geçmiş siparişlerinize hızlıca ulaşabilir,</li>
              <li>Kampanya ve indirimlerden ilk siz haberdar olabilirsiniz!</li>
            </ul>
          </div>
        </>
      ),
    },
    {
      question: "Siparişimin Durumunu Nasıl Takip Edebilirim?",
      answer: (
        <>
          <p className="mb-2">
            Web sitemizde yer alan Sipariş Sorgulama bölümüne giderek, sipariş
            numaranız ve e-posta adresinizi girmeniz yeterlidir.
          </p>
          <p className="mb-2">
            Siparişiniz kargoya verildiğinde, kargo takip numaranız da bu alanda
            yer alır. Böylece kargonuzu anlık olarak takip edebilirsiniz.
          </p>
          <p className="mt-4 p-3 bg-rose-50 border-l-4 border-rose-400 text-rose-800 rounded-lg font-sans">
            Herhangi bir sorunla karşılaşırsanız, müşteri hizmetlerimize
            ulaşmaktan çekinmeyin!
            <br />
            <span className="font-medium">+90 533 387 40 74</span> |{" "}
            <span className="font-medium">info@modaperde.com</span>
          </p>
        </>
      ),
    },
    {
      question: "Hangi Kargo Firmaları ile Çalışıyorsunuz?",
      answer: (
        <p>
          Türkiye'nin önde gelen güvenilir kargo firmaları ile iş birliği
          yapmaktayız. Siparişinizi oluştururken size en uygun olan kargo
          seçeneğini seçebilirsiniz. Tüm gönderilerimiz sigortalıdır.
        </p>
      ),
    },
    {
      question: "İade ve Değişim Şartlarınız Nelerdir?",
      answer: (
        <p>
          Özel ölçü ile üretilmeyen standart ürünlerde, teslimat tarihinden
          itibaren 14 gün içinde koşulsuz iade veya değişim yapabilirsiniz. Özel
          ölçülü dikilen perdelerde ise üretim hatası dışında iade kabul
          edilmemektedir. Detaylı bilgi için İade Politikası sayfamızı ziyaret
          edin.
        </p>
      ),
    },
  ];

  return (
    <div className="bg-white font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* ÜST BAŞLIK */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-base font-semibold tracking-widest uppercase text-rose-500">
            Yardım Merkezi
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">
            Aklınızdaki Tüm Sorular
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Moda Perde ile ilgili en sık sorulan soruları aşağıda
            bulabilirsiniz. Aradığınız cevabı bulamazsanız, bize ulaşmaktan
            çekinmeyin.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sol/Orta: FAQ AKORDİYON LİSTESİ */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-gray-50 border border-gray-100 rounded-xs shadow-lg transition-all duration-300 ${
                  openIndex === index
                    ? "shadow-rose-200/50 border-rose-300"
                    : "hover:shadow-xl hover:border-gray-200"
                }`}
              >
                {/* Soru Başlığı - Tıklanabilir Alan */}
                <button
                  className="w-full p-6 text-left focus:outline-none flex items-center justify-between"
                  onClick={() => toggleIndex(index)}
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle
                      className={`w-6 h-6 flex-shrink-0 ${
                        openIndex === index ? lightColor : "text-gray-500"
                      }`}
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 transition-transform duration-300 ${
                      openIndex === index
                        ? "rotate-180 text-rose-600"
                        : "rotate-0 text-gray-400"
                    }`}
                  />
                </button>

                {/* Cevap İçeriği - Akordiyon Kısmı */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index
                      ? "max-h-96 opacity-100 p-6 pt-0"
                      : "max-h-0 opacity-0 p-0"
                  }`}
                >
                  <div className="text-gray-700 text-base leading-relaxed border-t border-gray-200 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Sağ: Bize Ulaşın (Hizmet Kartı) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-1 flex flex-col justify-center items-center h-full min-h-[300px] 
                       bg-gradient-to-br from-rose-50 to-rose-200/50 p-10 rounded-xs shadow-2xl border border-rose-300/50"
          >
            <div className="flex flex-col items-center text-center">
              <Headset className="w-10 h-10 text-rose-700 mb-4" />
              <h3 className="text-3xl font-extrabold text-rose-900 mb-2">
                Canlı Destek
              </h3>
            </div>
            <p className="text-rose-800 mb-8 mt-4 text-lg">
              Aradığınız cevabı bulamadınız mı? Müşteri hizmetleri ekibimiz
              yardımcı olmaktan mutluluk duyar.
            </p>
            {/* Link yerine Button bileşeni kullanıldı */}
            <Link href="/contact">
              <Button
                style={{ backgroundColor: primaryColor }}
                className="rounded-full text-white px-8 py-3 h-auto text-lg font-semibold shadow-lg shadow-rose-900/40 transition-all 
               transform hover:scale-[1.03] hover:shadow-2xl hover:brightness-110"
              >
                <span className="flex items-center gap-2">
                  <Headset className="w-5 h-5" /> Bize Ulaşın
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
