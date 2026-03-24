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
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; border-radius: 16px; background: #ffffff;">
          <h2 style="color: #2563eb; text-align: center;">NEXA GLOBAL</h2>
          <div style="height: 1px; background: #eee; margin: 20px 0;"></div>
          <h3 style="color: #1a1a1a; margin-bottom: 5px;">Здравствуйте, ${name}!</h3>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-top: 5px;">${message}</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">ДЕТАЛИ ПОКУПКИ</p>
            
            <table style="width: 100%; border-collapse: collapse;">
               <tr>
                  <td style="padding: 5px 0; color: #64748b;">Модель:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: bold; color: #1e293b;">${productName || 'NexaBlade 16'}</td>
               </tr>
               <tr>
                  <td style="padding: 5px 0; color: #64748b;">Количество:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: bold; color: #1e293b;">1 шт.</td>
               </tr>
               <tr>
                  <td style="padding: 5px 0; color: #64748b;">Цена:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: bold; color: #2563eb; font-size: 18px;">$${amount}</td>
               </tr>
               <tr>
                  <td style="padding: 5px 0; color: #64748b;">Статус:</td>
                  <td style="padding: 5px 0; text-align: right;"><span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></td>
               </tr>
               <tr>
                  <td style="padding: 10px 0 0 0; color: #94a3b8; font-size: 11px;">ID заказа:</td>
                  <td style="padding: 10px 0 0 0; text-align: right; color: #94a3b8; font-size: 11px; font-family: monospace;">${orderId}</td>
               </tr>
            </table>
          </div>

          <p style="font-size: 14px; color: #94a3b8; text-align: center; margin-top: 20px;">Это автоматическое уведомление от NEXA Global Store.</p>
          
          <div style="text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
             <p style="font-weight: bold; color: #2563eb; margin: 0;">NEXA Global Support</p>
             <p style="font-size: 12px; color: #64748b; margin: 5px 0;">Premium High-Performance Laptops</p>
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
