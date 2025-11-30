import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, CreditCard, Calendar, Shield } from "lucide-react";

interface StepPaymentCardProps {
  holderName: string;
  setHolderName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  formattedCardNumber: string;
  expireMonth: string;
  setExpireMonth: (value: string) => void;
  expireYear: string;
  setExpireYear: (value: string) => void;
  cvc: string;
  setCvc: (value: string) => void;
  handlePayment: () => Promise<void>;
  totalPrice: number;
  setStep: (step: number) => void;
  isProcessing?: boolean;
}

export default function StepPaymentCard({
  holderName,
  setHolderName,
  cardNumber,
  setCardNumber,
  formattedCardNumber,
  expireMonth,
  setExpireMonth,
  expireYear,
  setExpireYear,
  cvc,
  setCvc,
  handlePayment,
  totalPrice,
  setStep,
  isProcessing: externalProcessing,
}: StepPaymentCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const processing = externalProcessing || isProcessing;

  // Kart numarası formatlama (4'lü gruplar)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted;
  };

  // Kart tipi algılama
  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    return "unknown";
  };

  const cardType = getCardType(cardNumber);

  // Form validasyonları
  const validateCardNumber = (num: string) => {
    const cleaned = num.replace(/\s/g, "");
    return cleaned.length === 16;
  };

  const validateExpiry = (month: string, year: string) => {
    if (!month || !year) return false;
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (monthNum < 1 || monthNum > 12) return false;
    
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;
    
    return true;
  };

  const validateCVC = (cvcValue: string) => {
    return cvcValue.length === 3;
  };

  const isFormValid =
    holderName.trim().length >= 3 &&
    validateCardNumber(cardNumber) &&
    validateExpiry(expireMonth, expireYear) &&
    validateCVC(cvc);

  const onClickPayment = async () => {
    if (!isFormValid || processing) return;
    setIsProcessing(true);
    try {
      await handlePayment();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Güvenlik Bildirimi */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-blue-900 font-medium mb-1">Güvenli Ödeme</p>
          <p className="text-blue-700">
            Kart bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. 
            Bilgileriniz asla saklanmaz veya paylaşılmaz.
          </p>
        </div>
      </div>

      {/* Ödeme Kartı */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              Kart Bilgileri
            </CardTitle>
            <div className="flex gap-2">
              {/* Kart logoları */}
              <img 
                src="/cards/visa.svg" 
                alt="Visa" 
                className={`h-8 ${cardType === 'visa' ? 'opacity-100' : 'opacity-30'} transition-opacity`}
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
              <img 
                src="/cards/mastercard.svg" 
                alt="Mastercard" 
                className={`h-8 ${cardType === 'mastercard' ? 'opacity-100' : 'opacity-30'} transition-opacity`}
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          </div>
          <CardDescription>
            Ödeme bilgilerinizi güvenli bir şekilde girin
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Kart Sahibi */}
          <div className="space-y-2">
            <Label htmlFor="holderName" className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Kart Sahibinin Adı Soyadı
            </Label>
            <Input
              id="holderName"
              placeholder="AD SOYAD"
              value={holderName}
              autoComplete="cc-name"
              disabled={processing}
              className={`h-12 text-base ${
                focusedField === "holderName" ? "ring-2 ring-blue-500" : ""
              }`}
              onFocus={() => setFocusedField("holderName")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                // Sadece harfler ve boşluk
                if (/^[A-ZİĞÜŞÖÇ\s]*$/.test(value)) {
                  setHolderName(value);
                }
              }}
            />
            {holderName && holderName.length < 3 && (
              <p className="text-xs text-amber-600">
                En az 3 karakter giriniz
              </p>
            )}
          </div>

          {/* Kart Numarası */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-sm font-medium">
              Kart Numarası
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={formatCardNumber(cardNumber)}
                autoComplete="cc-number"
                disabled={processing}
                className={`h-12 text-base pl-4 pr-12 ${
                  focusedField === "cardNumber" ? "ring-2 ring-blue-500" : ""
                }`}
                onFocus={() => setFocusedField("cardNumber")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 16) {
                    setCardNumber(value);
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {cardNumber && !validateCardNumber(cardNumber) && (
              <p className="text-xs text-amber-600">
                16 haneli kart numaranızı giriniz
              </p>
            )}
          </div>

          {/* Son Kullanma Tarihi ve CVC */}
          <div className="grid grid-cols-2 gap-4">
            {/* Son Kullanma Tarihi */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Son Kullanma Tarihi
              </Label>
              <div className="flex gap-2">
                <Input
                  id="expireMonth"
                  placeholder="AA"
                  maxLength={2}
                  value={expireMonth}
                  autoComplete="cc-exp-month"
                  disabled={processing}
                  className={`h-12 text-base text-center ${
                    focusedField === "expireMonth" ? "ring-2 ring-blue-500" : ""
                  }`}
                  onFocus={() => setFocusedField("expireMonth")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 2) {
                      const monthNum = parseInt(value);
                      if (value === "" || (monthNum >= 0 && monthNum <= 12)) {
                        setExpireMonth(value);
                      }
                    }
                  }}
                />
                <span className="flex items-center text-gray-400 font-bold">/</span>
                <Input
                  id="expireYear"
                  placeholder="YY"
                  maxLength={2}
                  value={expireYear}
                  autoComplete="cc-exp-year"
                  disabled={processing}
                  className={`h-12 text-base text-center ${
                    focusedField === "expireYear" ? "ring-2 ring-blue-500" : ""
                  }`}
                  onFocus={() => setFocusedField("expireYear")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 2) {
                      setExpireYear(value);
                    }
                  }}
                />
              </div>
              {expireMonth && expireYear && !validateExpiry(expireMonth, expireYear) && (
                <p className="text-xs text-red-600">
                  Geçersiz tarih
                </p>
              )}
            </div>

            {/* CVC */}
            <div className="space-y-2">
              <Label htmlFor="cvc" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                CVC/CVV
              </Label>
              <div className="relative">
                <Input
                  id="cvc"
                  type="password"
                  placeholder="•••"
                  maxLength={3}
                  value={cvc}
                  autoComplete="cc-csc"
                  disabled={processing}
                  className={`h-12 text-base text-center ${
                    focusedField === "cvc" ? "ring-2 ring-blue-500" : ""
                  }`}
                  onFocus={() => setFocusedField("cvc")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 3) {
                      setCvc(value);
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Kartınızın arkasındaki 3 haneli kod
              </p>
            </div>
          </div>

          {/* Ödeme Özeti */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ödenecek Tutar:</span>
              <span className="text-2xl font-bold text-gray-900">
                ₺{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            disabled={processing}
            className="w-full sm:w-auto h-12"
          >
            ← Geri Dön
          </Button>
          <Button
            onClick={onClickPayment}
            disabled={!isFormValid || processing}
            className="w-full sm:flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Ödeme İşleniyor...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                {`₺${totalPrice.toFixed(2)} Öde`}
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Alt Bilgilendirme */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-gray-900 text-sm">
          Güvenli Ödeme Garantisi
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <span>Tüm ödemeler PCI DSS standartlarına uygun olarak işlenir</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <span>Kart bilgileriniz hiçbir şekilde saklanmaz</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <span>3D Secure ile ekstra güvenlik katmanı</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <span>Ödeme başarısız olursa paranız anında iade edilir</span>
          </li>
        </ul>
      </div>
    </div>
  );
}