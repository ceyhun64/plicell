import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import AdresForm, {
  AddressFormData,
} from "@/components/modules/profile/addressForm";
import { Spinner } from "@/components/ui/spinner";
import {
  MapPin,
  Plus,
  CheckCircle2,
  Home,
  Building2,
  User,
  Phone,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

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
  tcno?: string;
}

interface StepAddressProps {
  addresses: Address[];
  selectedAddress: number | null;
  onSelectAddress: (id: number) => void;
  onNext: () => void;
  newAddressForm: AddressFormData & { email?: string };
  setNewAddressForm: React.Dispatch<
    React.SetStateAction<AddressFormData & { email?: string }>
  >;
  onSaveAddress: () => void;
  isAddingNewAddress: boolean;
  setIsAddingNewAddress: (v: boolean) => void;
  isSavingAddress: boolean;
}

export default function StepAddress({
  addresses,
  selectedAddress,
  onSelectAddress,
  onNext,
  newAddressForm,
  setNewAddressForm,
  onSaveAddress,
  isAddingNewAddress,
  setIsAddingNewAddress,
  isSavingAddress,
}: StepAddressProps) {
  const selected = addresses?.find((a) => a.id === selectedAddress);

  if (!addresses || !Array.isArray(addresses)) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  const getAddressIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("ev") || lowerTitle.includes("home")) {
      return <Home className="w-5 h-5 text-blue-600" />;
    }
    if (
      lowerTitle.includes("iş") ||
      lowerTitle.includes("ofis") ||
      lowerTitle.includes("work")
    ) {
      return <Building2 className="w-5 h-5 text-purple-600" />;
    }
    return <MapPin className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Bilgilendirme Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-blue-900 font-medium mb-1">Teslimat Adresi</p>
          <p className="text-blue-700">
            Siparişinizin teslim edileceği adresi seçin veya yeni bir adres
            ekleyin
          </p>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Teslimat Adresi
          </CardTitle>
          <CardDescription>
            Kaydedilmiş adreslerinizden birini seçin veya yeni adres ekleyin
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Kaydedilmiş Adresler */}
          {addresses.length > 0 && !isAddingNewAddress && (
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Home className="w-4 h-4" />
                Kayıtlı Adreslerim
              </Label>

              {/* Adres Kartları */}
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => {
                      onSelectAddress(addr.id);
                      setIsAddingNewAddress(false);
                    }}
                    className={`
                      relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${
                        selectedAddress === addr.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                      }
                    `}
                  >
                    {/* Seçili işareti */}
                    {selectedAddress === addr.id && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="w-6 h-6 text-blue-600 fill-blue-100" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      {/* İkon */}
                      <div className="flex-shrink-0 mt-1">
                        {getAddressIcon(addr.title)}
                      </div>

                      {/* Adres Bilgileri */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between pr-8">
                          <h4 className="font-semibold text-gray-900 text-base">
                            {addr.title}
                          </h4>
                        </div>

                        <div className="space-y-1.5 text-sm text-gray-600">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                            <span>
                              {addr.firstName} {addr.lastName}
                            </span>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                            <span className="line-clamp-2">
                              {addr.address}
                              {addr.neighborhood && `, ${addr.neighborhood}`}
                              {`, ${addr.district}/${addr.city}`}
                              {addr.zip && ` - ${addr.zip}`}
                            </span>
                          </div>

                          {addr.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                              <span>{addr.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alternatif Dropdown Seçici */}
              <div className="pt-2">
                <Label
                  htmlFor="address-select"
                  className="text-sm text-gray-600"
                >
                  veya hızlı seçim yapın:
                </Label>
                <Select
                  value={selectedAddress?.toString() || ""}
                  onValueChange={(val) => {
                    onSelectAddress(Number(val));
                    setIsAddingNewAddress(false);
                  }}
                >
                  <SelectTrigger id="address-select" className="mt-1 h-11">
                    <SelectValue
                      placeholder={
                        selected
                          ? `${selected.title} - ${selected.city}`
                          : "Adres Seçin"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((addr) => (
                      <SelectItem key={addr.id} value={addr.id.toString()}>
                        <div className="flex items-center gap-2">
                          {getAddressIcon(addr.title)}
                          <span>
                            {addr.title} - {addr.city}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Adres Yoksa Mesajı */}
          {addresses.length === 0 && !isAddingNewAddress && (
            <div className="text-center py-8 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">
                Henüz kayıtlı adresiniz bulunmuyor
              </p>
              <p className="text-sm text-gray-500">
                Devam etmek için lütfen bir adres ekleyin
              </p>
            </div>
          )}

          {/* Separator */}
          {addresses.length > 0 && !isAddingNewAddress && (
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-gray-500 font-medium">
                YA DA
              </span>
            </div>
          )}

          {/* Yeni Adres Ekleme Butonu */}
          {!isAddingNewAddress ? (
            <Button
              variant="outline"
              className="w-full h-12 border-2 border-dashed hover:border-blue-500 hover:bg-blue-50 transition-all group"
              onClick={() => {
                setIsAddingNewAddress(true);
                onSelectAddress(0);
              }}
            >
              <Plus className="w-5 h-5 mr-2 group-hover:text-blue-600" />
              <span className="font-medium">Yeni Adres Ekle</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={() => setIsAddingNewAddress(false)}
            >
              ← Kayıtlı Adreslere Dön
            </Button>
          )}

          {/* Yeni Adres Formu */}
          {isAddingNewAddress && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Yeni Adres Bilgileri
                </h4>
                <p className="text-sm text-gray-600">
                  Tüm alanları eksiksiz doldurun
                </p>
              </div>

              <div className="p-5 border-2 border-gray-200 rounded-lg bg-white">
                <AdresForm
                  formData={newAddressForm}
                  setFormData={setNewAddressForm}
                  onSave={onSaveAddress}
                />
              </div>

              {/* Kaydet Butonu */}
              <Button
                onClick={onSaveAddress}
                disabled={isSavingAddress}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {isSavingAddress ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner />
                    Kaydediliyor...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Adresi Kaydet ve Devam Et
                  </span>
                )}
              </Button>
            </div>
          )}
        </CardContent>

        {/* Footer - İleri Butonu */}
        {!isAddingNewAddress && (
          <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
            <div className="flex-1 text-sm text-gray-600">
              {selectedAddress ? (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Adres seçildi, devam edebilirsiniz</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Devam etmek için bir adres seçin</span>
                </div>
              )}
            </div>
            <Button
              onClick={onNext}
              disabled={!selectedAddress || isSavingAddress}
              className="w-full sm:w-auto h-12 bg-green-600 hover:bg-green-700 text-white font-semibold px-8"
              size="lg"
            >
              <span className="flex items-center gap-2">
                Ödeme Bilgilerine Geç
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Alt Bilgilendirme */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Teslimat Bilgileri
        </h4>
        <ul className="space-y-1.5 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span>Siparişiniz seçtiğiniz adrese teslim edilecektir</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span>Teslimat sırasında telefon numaranızdan ulaşılabilir</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span>
              Adres bilgilerinizi sonradan profilimden düzenleyebilirsiniz
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
