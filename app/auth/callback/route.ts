import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/login";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Logout session agar pengguna dapat melihat halaman login dengan email & sandi yang terisi otomatis
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}${next}?confirmed=true`);
    }
  }

  // Fallback arahkan langsung ke halaman login dengan status confirmed
  return NextResponse.redirect(`${origin}/login?confirmed=true`);
}
