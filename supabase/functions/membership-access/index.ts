import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://jocular-chaja-86e78d.netlify.app",
  "https://tahmid-english-review-hub-preview.netlify.app",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

const corsHeaders = (request: Request) => {
  const origin = request.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin)
      ? origin
      : "https://jocular-chaja-86e78d.netlify.app",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
};

const json = (request: Request, body: unknown, status = 200) => new Response(
  JSON.stringify(body),
  { status, headers: { ...corsHeaders(request), "Content-Type": "application/json" } },
);

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const secureCode = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const suffix = Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `TEC-${suffix.toUpperCase()}`;
};

const authenticatedUser = async (request: Request, supabaseUrl: string, anonKey: string) => {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.toLowerCase().startsWith("bearer ")) return null;
  const token = authorization.slice(7).trim();
  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await authClient.auth.getUser(token);
  return error ? null : data.user;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "Method not allowed." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return json(request, { error: "The membership service is not configured." }, 503);
  }

  try {
    const user = await authenticatedUser(request, supabaseUrl, anonKey);
    if (!user) return json(request, { error: "Please sign in first." }, 401);
    const body = await request.json();
    const action = String(body?.action || "");
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const teacherActions = new Set(["create", "update", "delete", "reissue", "learner-auth-status"]);
    if (teacherActions.has(action)) {
      const { data: teacher } = await admin
        .from("review_teachers")
        .select("user_id")
        .eq("user_id", user.id)
        .eq("active", true)
        .maybeSingle();
      if (!teacher) return json(request, { error: "Teacher authorisation is required." }, 403);
    }

    if (action === "create") {

      const label = String(body?.label || "").trim();
      const durationDays = Number(body?.durationDays || 0);
      const accessScope = ["general", "takiwaki", "both"].includes(body?.accessScope)
        ? body.accessScope
        : "general";
      const planTier = ["standard", "premium"].includes(body?.planTier)
        ? body.planTier
        : "standard";
      const maxUses = Number(body?.maxUses || 1);
      const validUntil = body?.validUntil ? new Date(String(body.validUntil)) : null;
      if (!label || label.length > 100) return json(request, { error: "Enter a plan label." }, 400);
      if (!Number.isInteger(durationDays) || durationDays < 1 || durationDays > 730) {
        return json(request, { error: "Duration must be between 1 and 730 days." }, 400);
      }
      if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 1000) {
        return json(request, { error: "Maximum uses must be between 1 and 1000." }, 400);
      }
      if (validUntil && Number.isNaN(validUntil.getTime())) {
        return json(request, { error: "Enter a valid code expiry date, or leave it blank." }, 400);
      }

      const accessCode = secureCode();
      const { data, error } = await admin.from("review_access_codes").insert({
        label,
        code_hash: await sha256(accessCode),
        code_last4: accessCode.slice(-4),
        duration_days: durationDays,
        access_scope: accessScope,
        plan_tier: planTier,
        max_uses: maxUses,
        valid_until: validUntil?.toISOString() || null,
        created_by: user.id,
      }).select("id").single();
      if (error) throw error;
      return json(request, { accessCode, codeId: data.id });
    }

    if (action === "learner-auth-status") {
      const learnerId = String(body?.learnerId || "").trim();
      if (!learnerId) return json(request, { error: "Choose a learner account." }, 400);
      const { data, error } = await admin.auth.admin.getUserById(learnerId);
      if (error) throw error;
      if (!data?.user) return json(request, { error: "Learner account not found." }, 404);
      const bannedUntil = data.user.banned_until || null;
      return json(request, {
        account: {
          createdAt: data.user.created_at || null,
          lastSignInAt: data.user.last_sign_in_at || null,
          emailConfirmedAt: data.user.email_confirmed_at || null,
          phoneConfirmedAt: data.user.phone_confirmed_at || null,
          bannedUntil,
          status: bannedUntil && new Date(bannedUntil).getTime() > Date.now() ? "banned" : "active",
        },
      });
    }

    if (action === "update") {
      const codeId = String(body?.codeId || "").trim();
      const label = String(body?.label || "").trim();
      const durationDays = Number(body?.durationDays || 0);
      const accessScope = ["general", "takiwaki", "both"].includes(body?.accessScope)
        ? body.accessScope
        : "general";
      const planTier = ["standard", "premium"].includes(body?.planTier)
        ? body.planTier
        : "standard";
      const maxUses = Number(body?.maxUses || 0);
      const validUntil = body?.validUntil ? new Date(String(body.validUntil)) : null;
      if (!codeId) return json(request, { error: "Choose an access code to edit." }, 400);
      if (!label || label.length > 100) return json(request, { error: "Enter a plan label." }, 400);
      if (!Number.isInteger(durationDays) || durationDays < 1 || durationDays > 730) {
        return json(request, { error: "Duration must be between 1 and 730 days." }, 400);
      }
      if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 1000) {
        return json(request, { error: "Maximum uses must be between 1 and 1000." }, 400);
      }
      if (validUntil && Number.isNaN(validUntil.getTime())) {
        return json(request, { error: "Enter a valid code expiry date, or leave it blank." }, 400);
      }
      const { data: current, error: currentError } = await admin
        .from("review_access_codes")
        .select("id,use_count")
        .eq("id", codeId)
        .maybeSingle();
      if (currentError) throw currentError;
      if (!current) return json(request, { error: "Access code not found." }, 404);
      if (maxUses < Number(current.use_count || 0)) {
        return json(request, { error: "Maximum uses cannot be lower than the number already used." }, 400);
      }
      const { data, error } = await admin.from("review_access_codes").update({
        label,
        duration_days: durationDays,
        access_scope: accessScope,
        plan_tier: planTier,
        max_uses: maxUses,
        valid_until: validUntil?.toISOString() || null,
        enabled: body?.enabled !== false,
      }).eq("id", codeId)
        .select("id,label,code_last4,duration_days,access_scope,plan_tier,max_uses,use_count,enabled,valid_until,created_at")
        .single();
      if (error) throw error;
      return json(request, { code: data });
    }

    if (action === "delete") {
      const codeId = String(body?.codeId || "").trim();
      if (!codeId) return json(request, { error: "Choose an access code to delete." }, 400);
      const { data: current, error: currentError } = await admin
        .from("review_access_codes")
        .select("id,use_count")
        .eq("id", codeId)
        .maybeSingle();
      if (currentError) throw currentError;
      if (!current) return json(request, { error: "Access code not found." }, 404);
      if (Number(current.use_count || 0) > 0) {
        const { error } = await admin.from("review_access_codes")
          .update({ enabled: false })
          .eq("id", codeId);
        if (error) throw error;
        return json(request, { disposition: "disabled", preservedHistory: true });
      }
      const { error } = await admin.from("review_access_codes").delete().eq("id", codeId);
      if (error) throw error;
      return json(request, { disposition: "deleted", preservedHistory: false });
    }

    if (action === "reissue") {
      const codeId = String(body?.codeId || "").trim();
      if (!codeId) return json(request, { error: "Choose an access code to reissue." }, 400);
      const { data: current, error: currentError } = await admin
        .from("review_access_codes")
        .select("label,duration_days,access_scope,plan_tier,max_uses,valid_until")
        .eq("id", codeId)
        .maybeSingle();
      if (currentError) throw currentError;
      if (!current) return json(request, { error: "Access code not found." }, 404);
      const accessCode = secureCode();
      const { data: replacement, error: insertError } = await admin
        .from("review_access_codes")
        .insert({
          ...current,
          label: `${current.label} (reissued)`.slice(0, 100),
          code_hash: await sha256(accessCode),
          code_last4: accessCode.slice(-4),
          use_count: 0,
          enabled: true,
          created_by: user.id,
        })
        .select("id")
        .single();
      if (insertError) throw insertError;
      const { error: disableError } = await admin.from("review_access_codes")
        .update({ enabled: false })
        .eq("id", codeId);
      if (disableError) {
        await admin.from("review_access_codes").delete().eq("id", replacement.id);
        throw disableError;
      }
      return json(request, { accessCode, codeId: replacement.id });
    }

    if (action === "redeem") {
      const rawCode = String(body?.code || "").trim().toUpperCase();
      if (!/^TEC-[A-F0-9]{12}$/.test(rawCode)) {
        return json(request, {
          error: "The code format is invalid. Enter the complete code beginning TEC-.",
          reason: "invalid_format",
        }, 400);
      }
      const { data: code, error: codeError } = await admin
        .from("review_access_codes")
        .select("*")
        .eq("code_hash", await sha256(rawCode))
        .maybeSingle();
      if (codeError) throw codeError;
      if (!code) {
        return json(request, { error: "This access code was not found.", reason: "not_found" }, 404);
      }
      const expired = code?.valid_until && new Date(code.valid_until).getTime() <= Date.now();
      if (!code.enabled) {
        return json(request, { error: "This access code has been disabled by the teacher.", reason: "disabled" }, 409);
      }
      if (expired) {
        return json(request, { error: "This access code has expired. Please ask the teacher for a new code.", reason: "expired" }, 410);
      }
      if (Number(code.use_count) >= Number(code.max_uses)) {
        return json(request, { error: "This access code has already reached its use limit.", reason: "used_up" }, 409);
      }
      const { data: usedAlready } = await admin
        .from("review_access_code_redemptions")
        .select("code_id")
        .eq("code_id", code.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (usedAlready) {
        return json(request, {
          error: "This account has already used this access code.",
          reason: "already_redeemed",
        }, 409);
      }

      const nextUseCount = Number(code.use_count) + 1;
      const { data: reserved, error: reserveError } = await admin
        .from("review_access_codes")
        .update({ use_count: nextUseCount })
        .eq("id", code.id)
        .eq("use_count", code.use_count)
        .lt("use_count", code.max_uses)
        .select("id")
        .maybeSingle();
      if (reserveError) throw reserveError;
      if (!reserved) {
        return json(request, {
          error: "This code has just reached its use limit. Please ask the teacher for another code.",
          reason: "used_up",
        }, 409);
      }

      const { error: redemptionError } = await admin.from("review_access_code_redemptions").insert({
        code_id: code.id,
        user_id: user.id,
      });
      if (redemptionError) {
        await admin.from("review_access_codes").update({ use_count: code.use_count }).eq("id", code.id);
        throw redemptionError;
      }

      const { data: existing } = await admin
        .from("review_memberships")
        .select("starts_at,expires_at")
        .eq("user_id", user.id)
        .maybeSingle();
      const baseTime = Math.max(Date.now(), new Date(existing?.expires_at || 0).getTime());
      const expiresAt = new Date(baseTime + Number(code.duration_days) * 86400000).toISOString();
      const startsAt = existing?.starts_at && new Date(existing.starts_at).getTime() <= Date.now()
        ? existing.starts_at
        : new Date().toISOString();
      const { error: membershipError } = await admin.from("review_memberships").upsert({
        user_id: user.id,
        status: "active",
        access_scope: code.access_scope,
        plan_tier: code.plan_tier || "standard",
        plan_label: code.label,
        starts_at: startsAt,
        expires_at: expiresAt,
        approval_source: "access_code",
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      if (membershipError) {
        await admin.from("review_access_code_redemptions").delete().eq("code_id", code.id).eq("user_id", user.id);
        await admin.from("review_access_codes").update({ use_count: code.use_count }).eq("id", code.id);
        throw membershipError;
      }
      if (["takiwaki", "both"].includes(code.access_scope)) {
        await admin.from("review_profiles").update({ access_scope: "takiwaki" }).eq("user_id", user.id);
      }
      return json(request, {
        membershipStatus: "active",
        membershipScope: code.access_scope,
        membershipPlan: code.plan_tier || "standard",
        membershipExpiresAt: expiresAt,
      });
    }

    return json(request, { error: "Unknown membership action." }, 400);
  } catch (error) {
    return json(request, { error: error instanceof Error ? error.message : "Membership request failed." }, 500);
  }
});
