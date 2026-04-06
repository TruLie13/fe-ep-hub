import { NextRequest, NextResponse } from "next/server";
import { LEGISTAR_EL_PASO_EVENTS } from "@/lib/legistar/el-paso-web-api";

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");

  if (!eventId || !/^\d+$/.test(eventId)) {
    return NextResponse.json(
      { error: "Missing or invalid eventId" },
      { status: 400 },
    );
  }

  const res = await fetch(`${LEGISTAR_EL_PASO_EVENTS}/${eventId}/eventitems`, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Upstream API error" },
      { status: 502 },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
