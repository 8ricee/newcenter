import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log("Email đăng ký nhận tin:", email);

    const gscriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!gscriptUrl) {
      return NextResponse.json(
        {
          status: "error",
          message: "Lỗi hệ thống",
        },
        { status: 500 }
      );
    }

    const response = await fetch(gscriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (result.status === "success") {
      return NextResponse.json(
        { status: "success", message: "Đăng ký nhận tin thành công!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: result.message || "Lỗi khi gửi đăng ký đến hệ thống",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Lỗi khi xử lý đăng ký nhận tin:", error);
    return NextResponse.json(
      { status: "error", message: "Đã xảy ra lỗi khi đăng ký nhận tin." },
      { status: 500 }
    );
  }
}
