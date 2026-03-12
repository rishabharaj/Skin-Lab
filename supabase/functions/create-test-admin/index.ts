import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const { email, password } = await req.json();
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Create or get user
  let userId: string;
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u: any) => u.email === email);

  if (existing) {
    userId = existing.id;
    // Update password
    await supabaseAdmin.auth.admin.updateUserById(userId, { password, email_confirm: true });
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return new Response(JSON.stringify({ success: false, error: error.message }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    userId = data.user.id;
  }

  // Assign admin role
  const { error: roleError } = await supabaseAdmin
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

  return new Response(JSON.stringify({ success: true, user_id: userId, email, role_error: roleError }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
