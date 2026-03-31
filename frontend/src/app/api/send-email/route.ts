import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, orderId, amount, name, statusUpdate, productName } = await request.json();

    // Генерация текста письма в зависимости от цели
    let subject = `Ваш NEXA уже ждет вас! 🚀`;
    let statusColor = '#10b981';
    let statusText = 'Оплачено';
    let message = `Ваш заказ на ${productName || 'ноутбук NEXA'} успешно оформлен и уже находится в обработке.`;

    if (statusUpdate === 'processing') {
      subject = `Ваш ${productName || 'заказ'} передан в работу! 🚀`;
      statusText = 'В обработке';
      statusColor = '#f59e0b';
      message = `Наш отдел сборки уже приступил к подготовке вашего ${productName || 'устройства'}. Мы сообщим вам, как только ноутбук будет готов к отправке!`;
    } else if (statusUpdate === 'shipped') {
      subject = `Ваш ${productName || 'NEXA'} уже в пути! 📦`;
      statusText = 'Отправлен';
      statusColor = '#8b5cf6';
      message = 'Отличные новости! Ваш заказ передан курьерской службе. Приготовьтесь к встрече с вашим новым устройством.';
    } else if (statusUpdate === 'delivered') {
      subject = `Ваш ${productName || 'NEXA'} доставлен! ✨`;
      statusText = 'Доставлен';
      statusColor = '#22c55e';
      message = 'Поздравляем с покупкой! Мы надеемся, что ваш новый NEXA оправдает все ожидания. Будем рады вашему отзыву!';
    } else if (statusUpdate === 'cancelled') {
      subject = `Обновление по заказу ${productName || 'NEXA'} ❌`;
      statusText = 'Отменён';
      statusColor = '#ef4444';
      message = 'К сожалению, ваш заказ был отменен. Если у вас возникли вопросы, пожалуйста, свяжитесь с нашей службой поддержки.';
    }

    const smtpEmail = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpEmail || !smtpPass) {
      console.error('SMTP settings missing in .env');
      return NextResponse.json({ error: 'Сервер не настроен для отправки писем' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"NEXA Global" <${smtpEmail}>`,
      to,
      subject,
      html: `
        <div style="background-color: #020617; color: #f8fafc; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
            
            <!-- Header Glow -->
            <div style="height: 4px; background: linear-gradient(90deg, #3b82f6, #0ea5e9, #3b82f6);"></div>
            
            <div style="padding: 40px;">
              <!-- Logo -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.05em; color: #ffffff;">NEXA <span style="color: #3b82f6;">GLOBAL</span></h1>
                <p style="margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #64748b;">Premium Tech Experience</p>
              </div>

              <div style="height: 1px; background: rgba(255,255,255,0.05); margin-bottom: 30px;"></div>

              <h2 style="font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 15px;">Приветствуем, ${name}!</h2>
              <p style="font-size: 16px; color: #94a3b8; margin-bottom: 25px;">${message}</p>

              <!-- Order Card -->
              <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 25px; margin-bottom: 30px;">
                <p style="margin: 0 0 15px 0; font-size: 11px; font-weight: 900; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.1em;">ДЕТАЛИ ЗАКАЗА</p>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Номер заказа:</td>
                    <td style="padding: 8px 0; text-align: right; color: #ffffff; font-weight: bold; font-family: monospace;">${orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Модель:</td>
                    <td style="padding: 8px 0; text-align: right; color: #ffffff; font-weight: bold;">${productName || 'Устройство NEXA'}</td>
                  </tr>
                  <tr>
                     <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Метод оплаты:</td>
                     <td style="padding: 8px 0; text-align: right; color: #ffffff; font-weight: bold;">Банковская карта</td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 0 0 0; border-top: 1px solid rgba(255,255,255,0.05); color: #ffffff; font-weight: bold;">Итог:</td>
                    <td style="padding: 20px 0 0 0; border-top: 1px solid rgba(255,255,255,0.05); text-align: right; color: #3b82f6; font-size: 22px; font-weight: 900;">$${amount}</td>
                  </tr>
                </table>
              </div>

              <!-- Action button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://nexa.ai'}/profile" style="background-color: #3b82f6; color: #ffffff; padding: 16px 32px; border-radius: 14px; text-decoration: none; font-weight: 800; font-size: 14px; display: inline-block; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.25);">УПРАВЛЯТЬ ЗАКАЗОМ</a>
              </div>

              <!-- Footer info -->
              <p style="font-size: 12px; color: #475569; text-align: center; line-height: 1.8;">
                Этот заказ будет обработан в течение 24-48 часов. Мы отправим вам номер для отслеживания, как только ваш новый NEXA покинет наш склад.<br><br>
                С уважением,<br>
                <strong style="color: #ffffff;">Команда NEXA Global Support</strong>
              </p>
            </div>

            <!-- Bottom Note -->
            <div style="background-color: rgba(0,0,0,0.2); padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.03);">
              <p style="margin: 0; font-size: 11px; color: #475569;">© 2026 NEXA Global Store. Future of Computing.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Не удалось отправить письмо' }, { status: 500 });
  }
}
