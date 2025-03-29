// app/api/contact/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log("API route /api/contact (App Router) nhận được request POST.");
    const formData = await request.json();
    console.log("Dữ liệu form nhận được:", formData);

    const gscriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    console.log("URL Google Apps Script:", gscriptUrl);

    if (!gscriptUrl) {
      console.error("Lỗi: Biến môi trường GOOGLE_APPS_SCRIPT_URL chưa được cấu hình.");
      return NextResponse.json({ status: 'error', message: 'Lỗi hệ thống.' }, { status: 500 });
    }

    console.log("Đang gửi request đến Google Apps Script...");
    const response = await fetch(gscriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    console.log("Response từ Google Apps Script:", response);
    const result = await response.json();
    console.log("Kết quả JSON từ Google Apps Script:", result);

    if (result.status === 'success') {
      console.log("Gửi đến Google Apps Script thành công.");
      return NextResponse.json({ status: 'success', message: 'Tin nhắn đã được gửi thành công!' }, { status: 200 });
    } else {
      console.error("Lỗi khi gửi đến Google Sheets:", result.message);
      return NextResponse.json({ status: 'error', message: result.message || 'Lỗi khi gửi yêu cầu.' }, { status: 500 });
    }

  } catch (error) {
    console.error("Lỗi trong API route (App Router):", error);
    return NextResponse.json({ status: 'error', message: 'Đã xảy ra lỗi khi xử lý tin nhắn.' }, { status: 500 });
  }
}