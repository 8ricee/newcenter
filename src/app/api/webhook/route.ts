/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const enrollment = await db.enrollment.update({
      where: {
        id: session?.metadata?.enrollmentId,
      },
      data: {
        paymentStatus: "Đã thanh toán",
      },
    })

    // Update the current students count in the schedule
    await db.schedule.update({
      where: {
        id: enrollment.scheduleId,
      },
      data: {
        currentStudents: {
          increment: 1,
        },
      },
    })
  }

  return new NextResponse(null, { status: 200 })
}

