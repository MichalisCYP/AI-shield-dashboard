import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch all profiles
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, monitoring_level");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH: Update monitoring level for all or individual profiles
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  if (body.global) {
    // Update all profiles
    // Get all profile ids
    const { data: allProfiles, error: fetchError } = await supabase
      .from("profiles")
      .select("id");
    if (fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    const ids = (allProfiles || []).map((p) => p.id);
    if (ids.length === 0) return NextResponse.json({ success: true });
    const { error } = await supabase
      .from("profiles")
      .update({ monitoring_level: body.monitoring_level })
      .in("id", ids);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } else {
    // Update individual profile
    const { id, monitoring_level } = body;
    const { error } = await supabase
      .from("profiles")
      .update({ monitoring_level })
      .eq("id", id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }
}
