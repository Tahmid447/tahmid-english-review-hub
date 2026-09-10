// Owner maintenance helper. Uses the existing Supabase CLI login, never stores
// credentials in the repository and defaults to a read-only database query.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
const args = process.argv.slice(2);
const sqlFile = args.find(arg => arg.endsWith(".sql"));
if (!sqlFile) throw new Error("Usage: node scripts/admin-query.mjs query.sql [--write] [--out=result.json]");
let token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token && process.platform === "darwin") {
  for (const account of ["supabase", "access-token"]) {
    try { token = execFileSync("security", ["find-generic-password", "-s", "Supabase CLI", "-a", account, "-w"], {encoding:"utf8",stdio:["ignore","pipe","ignore"]}).trim(); } catch {}
    if (token?.startsWith("sbp_")) break;
    token = null;
  }
}
if (!token?.startsWith("sbp_")) throw new Error("Sign in using Supabase CLI, or provide SUPABASE_ACCESS_TOKEN in the environment.");
const response = await fetch("https://api.supabase.com/v1/projects/ycmybggetemkhorkhfnf/database/query", {
  method:"POST", headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},
  body:JSON.stringify({query:readFileSync(sqlFile,"utf8"),read_only:!args.includes("--write")}),
  signal:AbortSignal.timeout(45000),
});
const output = await response.text();
if (!response.ok) throw new Error(`Database query failed (${response.status}): ${output}`);
const outputFile = args.find(arg => arg.startsWith("--out="))?.slice(6);
if (outputFile) { writeFileSync(outputFile, output+"\n",{mode:0o600}); console.log("Query result saved."); }
else console.log(output);
