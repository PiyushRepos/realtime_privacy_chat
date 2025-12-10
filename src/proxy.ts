import { redis } from "@/app/lib/redis";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  const roomMatch = pathname.match(/^\/room\/([^/]+)$/);
  if (!roomMatch)
    return NextResponse.redirect(new URL("/?error=invalid-room", req.url));

  const roomId = roomMatch[1];

  const meta = await redis.hgetall<{ connected: string[]; createdAt: string }>(
    `meta:${roomId}`
  );

  if (!meta)
    return NextResponse.redirect(new URL("/?error=room-not-found", req.url));

  const existingToken = req.cookies.get("x-auth-token")?.value;

  if (existingToken && meta.connected.includes(existingToken))
    return NextResponse.next();

  const userAgent = req.headers.get("user-agent") || "";
  const isBot =
    /bot|crawler|spider|crawling|WhatsApp|Telegram|facebook|twitter|linkedIn|slack/i.test(
      userAgent
    );

  if (isBot) return NextResponse.next();

  if (meta.connected.length >= 2)
    return NextResponse.redirect(new URL("/?error=room-full", req.url));

  const response = NextResponse.next();

  const token = nanoid();

  response.cookies.set("x-auth-token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  await redis.hset(`meta:${roomId}`, {
    connected: [...meta.connected, token],
  });

  return response;
};

export const config = {
  matcher: "/room/:path*",
};
