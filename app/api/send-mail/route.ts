import nodemailer from "nodemailer";

interface EmailRequestBody {
  recipients: string[];
  subject: string;
  message: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { recipients, subject, message }: EmailRequestBody = await req.json();

    if (!recipients || recipients.length === 0) {
      return Response.json({ error: "Alıcı listesi boş" }, { status: 400 });
    }

    if (!subject || !message) {
      return Response.json({ error: "Konu ve mesaj gerekli" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ----- PROFESYONEL, MARKALI HTML TEMPLATE -----
    const htmlTemplate = `
<div style="font-family: Arial, sans-serif; background: #f2f2f7; padding: 2px;">
  <div style="
    max-width: 720px;
    margin: auto;
    background: #ffffff;
    border-radius: 18px;
    padding: 0;
    overflow: hidden;
    border: 1px solid #e6e6e6;
    box-shadow: 0 20px 40px rgba(0,0,0,0.06);
  ">

    <!-- HEADER -->
    <div style="
      background: linear-gradient(135deg, #7B0323, #B3133C);
      padding: 40px 2px;
      text-align: center;
      color: #fff;
    ">
      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px;">
        MODA PERDE
      </h1>
      <p style="margin-top: 6px; font-size: 15px; opacity: 0.9;">
        Yaşam Alanlarınıza Şıklık Katan Dokunuşlar
      </p>
    </div>

    <!-- CONTENT -->
    <div style="padding: 40px 15px 30px;">
      <h2 style="color:#7B0323; font-size:24px; margin-bottom:18px; font-weight:600;">
        Yeni Bir Mesaj Aldınız 📩
      </h2>

      <p style="font-size: 15px; color:#555; margin-bottom: 25px; line-height:1.7;">
        Web sitenizden gönderilen yeni bir iletişim formu mesajı mevcut.
        Aşağıdaki bilgiler iletildi:
      </p>

      <div style="
        background: #fbfbfb;
        border: 1px solid #ececec;
        border-radius: 12px;
        padding: 25px 22px;
        line-height: 1.8;
        font-size: 15px;
        color: #333;
        white-space: pre-line;
      ">
        ${message}
      </div>

      <p style="margin-top: 30px; font-size: 14px; color:#666; line-height: 1.6;">
        Gönderilen mesajı inceledikten sonra en kısa sürede tarafınıza dönüş sağlanacaktır.
      </p>
    </div>

    <!-- FOOTER -->
    <div style="
      background: #fafafa;
      padding: 25px 20px;
      text-align: center;
      border-top: 1px solid #eee;
    ">
      <p style="margin: 5px 0; font-size: 14px; color:#333;"><strong>Moda Perde</strong></p>
      <p style="margin: 5px 0; font-size: 13px; color:#777;">Mustafa Kökmen Blv. 91, Gaziantep / Türkiye</p>
      <p style="margin: 5px 0; font-size: 13px; color:#777;">+90 533 387 40 74 • info@modaperde.com</p>

      <p style="margin-top:15px; font-size:12px; color:#999;">
        Bu e-posta otomatik oluşturulmuştur, lütfen yanıtlamayınız.
      </p>
    </div>

  </div>
</div>

    `;

    await transporter.sendMail({
      from: `"Moda Perde" <${process.env.EMAIL_USER}>`,
      to: recipients.join(", "),
      subject,
      text: message,
      html: htmlTemplate,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Mail gönderim hatası:", err);
    return Response.json({ error: "Mail gönderilemedi." }, { status: 500 });
  }
}
