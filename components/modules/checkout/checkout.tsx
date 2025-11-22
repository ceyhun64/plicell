// PaymentPage.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // 👈 Oturum açma için eklendi
import PaymentStepper from "@/components/modules/checkout/paymentStepper";
import StepAddress from "@/components/modules/checkout/stepAddress";
import StepPaymentCard from "@/components/modules/checkout/stepPayment";
import BasketSummaryCard from "@/components/modules/checkout/cartSummary";
import { AddressFormData } from "@/components/modules/profile/addressForm";
import { getCart, clearGuestCart, GuestCartItem } from "@/utils/cart";
import { Spinner } from "@/components/ui/spinner";

const cargoOptions = [
  { id: "standart", name: "Standart Kargo", fee: 0.0 }, // 👈 Ücret sıfırlandı
  { id: "express", name: "Hızlı Kargo", fee: 0.0 }, // 👈 Ücret sıfırlandı
];

interface Address {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  district: string;
  city: string;
  neighborhood?: string | null;
  zip?: string;
  phone?: string;
  country?: string;
  email?: string;
  tcno?: string;
}

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role?: string;
  phone?: string;
  addresses?: Address[];
}

interface Product {
  id: number;
  title: string;
  pricePerM2: number;
  mainImage: string;
  oldPrice?: number;
  category: string;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  note?: string | null;
  profile?: string;
  width?: number;
  height?: number;
  device?: string;
  m2?: number;
}

interface UserUser {
  user: User;
}

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<UserUser | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [step, setStep] = useState(1);
  const [selectedCargo, setSelectedCargo] = useState<string>(
    cargoOptions[0].id
  );

  // Kart bilgileri
  const [cardNumber, setCardNumber] = useState("");
  const [expireMonth, setExpireMonth] = useState("");
  const [expireYear, setExpireYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [holderName, setHolderName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  // Yeni adres formu (guest kullanıcı için de kullanılacak)
  const initialAddressForm: AddressFormData & { email?: string } = {
    title: "",
    firstName: "",
    lastName: "",
    email: "", // 👈 checkout formuna eklendi
    address: "",
    district: "",
    city: "",
    neighborhood: "",
    zip: "",
    phone: "",
    country: "Türkiye",
    tcno: "",
  };
  const [newAddressForm, setNewAddressForm] = useState(initialAddressForm);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Kullanıcı ve sepet verilerini çek
  const fetchData = async () => {
    // 👈 Dışarı taşıdık
    setLoading(true);
    try {
      // Kullanıcıyı çek
      const userRes = await fetch("/api/user", { credentials: "include" });
      let userData = null;
      if (userRes.ok) {
        userData = await userRes.json();
        setUser(userData);
      } else {
        setUser(null);
      }

      // Sepeti belirle
      if (userData?.user?.id) {
        // Login olmuş kullanıcı için backend cart
        const cartRes = await fetch("/api/cart", { credentials: "include" });
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCartItems(cartData);
        } else {
          setCartItems([]); // Hata durumunda sepeti temizle
        }
      } else {
        // Guest için localStorage cart
        const localCart = getCart(); // getCart() fonksiyonunu kullan (localStorage'dan çeker)
        if (localCart.length > 0) {
          // Sadece doluysa ayarla
          // Local storage'daki basit ürünleri API'dan detaylı ürün bilgisi ile çekmek gerekebilir.
          // Ancak mevcut yapıda, local cart'ın sadece ürün ID'leri yerine tam item yapısını
          // döndürdüğünü varsayarak sadece `getCart()`'ı çağırıp dönen veriyi kullanabiliriz.
          // Eğer `getCart()` sadece GuestCartItem[] döndürüyorsa, PaymentPage'in CartItem[] tipine dönüştürmelisiniz.
          // Mevcut kodunuzda localCart'ı doğrudan setCartItems'a atıyorsunuz, bu da `GuestCartItem[]`'ın `CartItem[]` olarak kullanılması anlamına geliyor.
          // UYUMLULUK SORUNU YAŞAMAMAK İÇİN:
          // Eğer `getCart()` GuestCartItem[] döndürüyorsa, aşağıdakini kullanın:
          // setCartItems(localCart as any as CartItem[]);
          // Eğer `getCart()` (veya localStorage) zaten CartItem[] formatına uygun veri tutuyorsa, mevcut haliyle devam edin:
          setCartItems(JSON.parse(localStorage.getItem("cart") || "[]"));
        } else {
          setCartItems([]);
        }
      }
    } catch (err) {
      console.error("Fetch hatası:", err);
      setUser(null);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // 👈 Sayfa

  // Subtotal ve total hesaplama
  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const area =
        item.width && item.height ? (item.width * item.height) / 10000 : 1;
      const itemPrice = item.product.pricePerM2 * area;
      return acc + itemPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  const selectedCargoFee = useMemo(() => {
    const cargo = cargoOptions.find((c) => c.id === selectedCargo);
    return cargo ? cargo.fee : 0;
  }, [selectedCargo]);

  const totalPrice = useMemo(() => {
    const baseTotal = subTotal + selectedCargoFee;
    // Yüzde 10'luk artışı ekle (1.1 ile çarp)
    const totalWithMarkup = baseTotal * 1.1;
    // Virgülden sonra iki basamak hassasiyeti için toFixed kullanabilirsiniz,
    // ancak useMemo'dan dönen değerin number olması önerilir.
    return totalWithMarkup;
  }, [subTotal, selectedCargoFee]);

  if (loading) return <Spinner />;
  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;

  // Adres kaydetme (login + guest kullanıcılar için)
  const handleSaveAddress = async () => {
    try {
      setIsSavingAddress(true);

      let userId = user?.user?.id;
      let passwordForLogin: string | undefined;

      // 🔹 Guest kullanıcı için register ve login
      if (!userId) {
        const guestEmail =
          newAddressForm.email || `guest_${Date.now()}@example.com`;
        const password = Math.random().toString(36).slice(-8);
        passwordForLogin = password;

        // Register
        const registerRes = await fetch("/api/account/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newAddressForm.firstName,
            surname: newAddressForm.lastName,
            email: guestEmail,
            password,
          }),
        });

        if (!registerRes.ok) {
          const text = await registerRes.text();
          throw new Error("Register failed: " + text);
        }

        const registerData = await registerRes.json();
        userId = registerData.user.id;
        setUser({ user: registerData.user });

        // Otomatik login
        if (passwordForLogin) {
          const signInResult = await signIn("credentials", {
            email: guestEmail,
            password: passwordForLogin,
            redirect: false,
          });
          if (signInResult?.error)
            console.error("Login error:", signInResult.error);

          // Session’in backend’e yansıması için kısa delay
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
      }

      // 🔹 Adres kaydet
      const addressRes = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAddressForm, userId, country: "Türkiye" }),
      });

      if (!addressRes.ok) {
        const text = await addressRes.text();
        throw new Error("Address save failed: " + text);
      }

      const addressData = await addressRes.json();
      setUser((prev) =>
        prev
          ? {
              ...prev,
              user: {
                ...prev.user,
                addresses: [
                  addressData.address,
                  ...(prev.user.addresses ?? []),
                ],
              },
            }
          : prev
      );

      // 🔹 Guest cart’dan backend’e aktar
      const guestCart: GuestCartItem[] = getCart();
      for (const item of guestCart) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity || 1,
            note: item.note || null,
            profile: item.profile || "",
            width: item.width || 0,
            height: item.height || 0,
            device: item.device || "vidali",
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Cart POST failed:", text);
          throw new Error("Cart item save failed: " + text);
        }
        console.log("Cart item saved:", item.productId);
      }

      // 🔹 Guest cart temizle
      clearGuestCart();
      await fetchData();
      setIsAddingNewAddress(false);
      setNewAddressForm(initialAddressForm);
      console.log("Address and cart saved successfully");
    } catch (err) {
      console.error("handleSaveAddress error:", err);
      alert(
        "Adres kaydedilemedi veya sepet aktarımı başarısız oldu. Konsolu kontrol edin."
      );
    } finally {
      setIsSavingAddress(false);
    }
  };

  // 🔹 Ödeme işlemi
  const handlePayment = async () => {
    let currentUser = user;
    let passwordForLogin: string | undefined = undefined; // Oturum açmak için parolayı tut

    // 🔹 Giriş yapılmamışsa guest user oluştur
    if (!currentUser) {
      try {
        const guestEmail =
          newAddressForm.email || `guest_${Date.now()}@example.com`;
        const password = Math.random().toString(36).slice(-8);
        passwordForLogin = password; // Parolayı kaydet ve kullan

        const registerRes = await fetch("/api/account/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newAddressForm.firstName,
            surname: newAddressForm.lastName,
            email: guestEmail,
            password,
          }),
        });

        if (!registerRes.ok) {
          return alert(
            "Kullanıcı oluşturulamadı, lütfen bilgilerinizi kontrol edin."
          );
        }

        const registerData = await registerRes.json();
        currentUser = { user: registerData.user };
        setUser(currentUser);

        // 🚨 OTOMATİK OTURUM AÇMA 🚨
        if (passwordForLogin) {
          const signInResult = await signIn("credentials", {
            email: guestEmail,
            password: passwordForLogin, // Kayıt sırasında oluşturulan parolayı kullan
            redirect: false,
          });

          if (signInResult?.error) {
            console.error(
              "Ödeme öncesi otomatik oturum açma başarısız oldu:",
              signInResult.error
            );
            // Hata olsa bile ödeme işlemine devam et
          }
        }
      } catch (err) {
        console.error("Register error:", err);
        return alert("Kullanıcı oluşturulurken hata oluştu.");
      }
    }

    const userId = Number(currentUser?.user?.id);
    if (isNaN(userId) || userId <= 0) {
      return alert("Geçersiz kullanıcı ID");
    }

    // Guest için adres formunu kullan
    const shippingAddr =
      currentUser.user.addresses?.[0] || (newAddressForm as Address);

    const buyer = {
      id: userId.toString(),
      buyerName: shippingAddr.firstName || "Adınız",
      buyerSurname: shippingAddr.lastName || "Soyadınız",
      email: currentUser.user.email ?? "",
      identityNumber: "11111111111",
      registrationDate: new Date().toISOString(),
      lastLoginDate: new Date().toISOString(),
      phone: shippingAddr.phone ?? "",
      city: shippingAddr.city ?? "",
      country: shippingAddr.country ?? "Türkiye",
      zipCode: shippingAddr.zip ?? "",
      ip: "127.0.0.1",
    };

    const shippingAddress = {
      contactName: `${shippingAddr.firstName ?? ""} ${
        shippingAddr.lastName ?? ""
      }`.trim(),
      city: shippingAddr.city ?? "",
      country: shippingAddr.country ?? "Türkiye",
      address: shippingAddr.address ?? "",
      zipCode: shippingAddr.zip ?? "",
    };

    const billingAddress = { ...shippingAddress };
    console.log("cartItems:", cartItems);

    const basketItemsFormatted = cartItems.map((item) => {
      const area =
        item.width && item.height ? (item.width * item.height) / 10000 : 1;
      const unitPrice = item.product.pricePerM2 * area;
      return {
        id: item.product.id.toString(),
        name: item.product.title,
        category1: item.product.category,
        itemType: "PHYSICAL",
        price: unitPrice.toFixed(2),
        quantity: item.quantity,
        profile: item.profile,
        width: item.width,
        height: item.height,
        m2: item.m2,
        device: item.device,
      };
    });

    console.log("basketItemsFormatted:", basketItemsFormatted);

    const paymentCardFormatted = {
      cardHolderName: holderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
    };

    const orderPayload = {
      userId,
      basketItems: basketItemsFormatted,
      shippingAddress,
      billingAddress,
      totalPrice,
      paidPrice: totalPrice,
      currency: "TRY",
      paymentMethod: "iyzipay",
      paymentCard: paymentCardFormatted,
      buyer,
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) return router.push("/checkout/unsuccess");

      const data = await res.json();
      if (data.status === "success") {
        // 🔥 Veritabanındaki her cartItem'ı sil
        for (const item of cartItems) {
          try {
            await fetch(`/api/cart/${item.id}`, {
              method: "DELETE",
            });
          } catch (err) {
            console.error("Cart item delete error:", err);
          }
        }

        // 🔥 Local sepeti temizle
        localStorage.removeItem("cart");

        router.push("/checkout/success");
      }
    } catch (err) {
      console.error("handlePayment fetch hatası:", err);
      router.push("/checkout/unsuccess");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Ödeme İşlemleri
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PaymentStepper currentStep={step} />

          {/* ✅ Guest kullanıcı da adres formunu görebilir */}
          {step === 1 && (
            <StepAddress
              addresses={user?.user.addresses ?? []}
              selectedAddress={selectedAddress}
              onSelectAddress={setSelectedAddress}
              onNext={() => setStep(2)}
              newAddressForm={newAddressForm}
              setNewAddressForm={setNewAddressForm}
              onSaveAddress={handleSaveAddress}
              isAddingNewAddress={isAddingNewAddress}
              setIsAddingNewAddress={setIsAddingNewAddress}
              isSavingAddress={isSavingAddress}
            />
          )}

          {step === 2 && (
            <StepPaymentCard
              holderName={holderName}
              setHolderName={setHolderName}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              formattedCardNumber={cardNumber}
              expireMonth={expireMonth}
              setExpireMonth={setExpireMonth}
              expireYear={expireYear}
              setExpireYear={setExpireYear}
              cvc={cvc}
              setCvc={setCvc}
              totalPrice={totalPrice}
              setStep={setStep}
              handlePayment={handlePayment}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="flex justify-center">
            <img
              src="/iyzico/iyzico_ile_ode_colored_horizontal.webp"
              alt="iyzico ile güvenli ödeme"
              className="h-10 md:h-12 object-contain mb-4"
              loading="lazy"
            />
          </div>
          <BasketSummaryCard
            basketItemsData={cartItems}
            subTotal={subTotal}
            selectedCargoFee={selectedCargoFee}
            totalPrice={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}
