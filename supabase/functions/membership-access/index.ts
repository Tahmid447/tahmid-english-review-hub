import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://jocular-chaja-86e78d.netlify.app",
  "https://tahmid-english-review-hub-preview.netlify.app",
  "https://tahmid-english-review-hub-v9-preview.netlify.app",
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
  if (!supabaseUrl || !anonKey) {
    return json(request, { error: "The membership service is not configured." }, 503);
  }

  try {
    const user = await authenticatedUser(request, supabaseUrl, anonKey);
    if (!user) return json(request, { error: "Please sign in first." }, 401);
    const authorization = request.headers.get("authorization") || "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const body = await request.json();
    const action = String(body?.action || "");
    const teacherAdmin = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
      : null;

    // Reissue is authorised inside its SECURITY DEFINER SQL function and does
    // not need the service-role client. The remaining actions still use the
    // admin client and retain this explicit active-teacher check.
    const serviceRoleTeacherActions = new Set(["create", "update", "delete", "learner-auth-status"]);
    if (serviceRoleTeacherActions.has(action)) {
      if (!teacherAdmin) return json(request, { error: "Teacher membership actions are not configured." }, 503);
      const { data: teacher } = await teacherAdmin
        .from("review_teachers")
        .select("user_id")
        .eq("user_id", user.id)
        .eq("active", true)
        .maybeSingle();
      if (!teacher) return json(request, { error: "Teacher authorisation is required." }, 403);
    }

    if (action === "create") {
      if (!teacherAdmin) return json(request, { error: "Teacher membership actions are not configured." }, 503);

      const label = String(body?.label || "").trim();
      const durationDays = Number(body?.durationDays || 0);
      const accessScope = ["general", "takiwaki", "both"].includes(body?.accessScope)
        ? body.accessScope
        : "general";
      const planTier = ["standard", "premium", "premium_plus"].includes(body?.planTier)
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
      const { data, error } = await teacherAdmin.from("review_access_codes").insert({
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
      if (!teacherAdmin) return json(request, { error: "Teacher membership actions are not configured." }, 503);
      const learnerId = String(body?.learnerId || "").trim();
      if (!learnerId) return json(request, { error: "Choose a learner account." }, 400);
      const { data, error } = await teacherAdmin.auth.admin.getUserById(learnerId);
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
      if (!teacherAdmin) return json(request, { error: "Teacher membership actions are not configured." }, 503);
      const codeId = String(body?.codeId || "").trim();
      const label = String(body?.label || "").trim();
      const durationDays = Number(body?.durationDays || 0);
      const accessScope = ["general", "takiwaki", "both"].includes(body?.accessScope)
        ? body.accessScope
        : "general";
      const planTier = ["standard", "premium", "premium_plus"].includes(body?.planTier)
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
      const { data: current, error: currentError } = await teacherAdmin
        .from("review_access_codes")
        .select("id,use_count")
        .eq("id", codeId)
        .maybeSingle();
      if (currentError) throw currentError;
      if (!current) return json(request, { error: "Access code not found." }, 404);
      if (maxUses < Number(current.use_count || 0)) {
        return json(request, { error: "Maximum uses cannot be lower than the number already used." }, 400);
      }
      const { data, error } = await teacherAdmin.from("review_access_codes").update({
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
      if (!teacherAdmin) return json(request, { error: "Teacher membership actions are not configured." }, 503);
      const codeId = String(body?.codeId || "").trim();
      if (!codeId) return json(request, { error: "Choose an access code to delete." }, 400);
      const { data: current, error: currentError } = await teacherAdmin
        .from("review_access_codes")
        .select("id,use_count")
        .eq("id", codeId)
        .maybeSingle();
      if (currentError) throw currentError;
      if (!current) return json(request, { error: "Access code not found." }, 404);
      if (Number(current.use_count || 0) > 0) {
        const { error } = await teacherAdmin.from("review_access_codes")
          .update({ enabled: false })
          .eq("id", codeId);
        if (error) throw error;
        return json(request, { disposition: "disabled", preservedHistory: true });
      }
      const { error } = await teacherAdmin.from("review_access_codes").delete().eq("id", codeId);
      if (error) throw error;
      return json(request, { disposition: "deleted", preservedHistory: false });
    }

    if (action === "reissue") {
      const codeId = String(body?.codeId || "").trim();
      if (!codeId) return json(request, { error: "Choose an access code to reissue." }, 400);
      const { data: replacementRows, error: reissueError } = await userClient.rpc(
        "review_reissue_access_code",
        { target_code: codeId },
      );
      if (reissueError) {
        const message = String(reissueError.message || "");
        if (/not found/i.test(message)) {
          return json(request, { error: "Access code not found." }, 404);
        }
        if (/already disabled|reissued/i.test(message)) {
          return json(request, { error: "This access code is already disabled or has been reissued." }, 409);
        }
        if (/teacher authorisation/i.test(message)) {
          return json(request, { error: "Teacher authorisation is required." }, 403);
        }
        throw reissueError;
      }
      const replacement = Array.isArray(replacementRows)
        ? replacementRows[0]
        : replacementRows;
      if (!replacement?.access_code || !replacement?.code_id) {
        throw new Error("The access-code reissue transaction returned no replacement.");
      }
      return json(request, {
        accessCode: replacement.access_code,
        codeId: replacement.code_id,
      });
    }

    if (action === "redeem") {
      const rawCode = String(body?.code || "").trim().toUpperCase();
      if (!/^TEC-[A-F0-9]{12}$/.test(rawCode)) {
        return json(request, {
          error: "The code format is invalid. Enter the complete code beginning TEC-.",
          reason: "invalid_format",
        }, 400);
      }
      // The SQL function owns the row locks, use-count reservation, redemption
      // history and membership update in one transaction. Calling it with the
      // learner's JWT preserves auth.uid() and avoids service-role partial writes.
      const { data: redemptionRows, error: redemptionError } = await userClient.rpc(
        "review_redeem_access_code",
        { raw_code: rawCode },
      );
      if (redemptionError) {
        const message = String(redemptionError.message || "");
        const known = [
          ["not found", "This access code was not found.", "not_found", 404],
          ["disabled", "This access code has been disabled by the teacher.", "disabled", 409],
          ["expired", "This access code has expired. Please ask the teacher for a new code.", "expired", 410],
          ["used up", "This access code has already reached its use limit.", "used_up", 409],
          ["already redeemed", "This account has already used this access code.", "already_redeemed", 409],
          ["conflicts with the active membership", "This code has a different plan or lesson scope from the active membership. Ask the teacher to issue a compatible code or change the current access first.", "active_membership_conflict", 409],
          ["complete the learner profile", "Complete the learner profile before using an access code.", "profile_required", 409],
        ] as const;
        const match = known.find(([needle]) => message.toLowerCase().includes(needle));
        if (match) return json(request, { error: match[1], reason: match[2] }, match[3]);
        throw redemptionError;
      }
      const redemption = Array.isArray(redemptionRows) ? redemptionRows[0] : redemptionRows;
      return json(request, {
        membershipStatus: redemption?.membership_status || "active",
        membershipScope: redemption?.membership_scope || "general",
        membershipPlan: redemption?.membership_plan || "standard",
        membershipExpiresAt: redemption?.membership_expires_at || null,
      });
    }

    return json(request, { error: "Unknown membership action." }, 400);
  } catch (error) {
    // Unexpected database/runtime details belong in server logs, not in a
    // learner-facing response. Known validation errors are mapped above.
    console.error("membership-access unexpected failure", error);
    return json(request, { error: "Membership request failed. Please refresh and try again." }, 500);
  }
});
