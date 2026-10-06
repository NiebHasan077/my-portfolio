import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

type Claim = {
  id: string;
  evidence: string;
  publicSafe: boolean;
  approved: boolean;
  lastVerified: string | null;
};
type RecordWithClaims = { id?: string; publish: boolean; claimIds: string[] };

const root = process.cwd();
const content = resolve(root, "apps/site/src/content");
const load = async <T>(name: string) =>
  JSON.parse(await readFile(resolve(content, name), "utf8")) as T;
const claims = await load<Claim[]>("claims.json");
const records = [
  await load<RecordWithClaims>("profile.json"),
  ...(await load<RecordWithClaims[]>("education.json")),
  ...(await load<RecordWithClaims[]>("experience.json")),
  ...(await load<RecordWithClaims[]>("news.json")),
  ...(await load<RecordWithClaims[]>("projects.json")),
  ...(await load<RecordWithClaims[]>("research.json")),
  ...(await load<RecordWithClaims[]>("publications.json")),
  ...(await load<RecordWithClaims[]>("highlights.json")),
  ...(await load<RecordWithClaims[]>("skills.json")),
];

const links =
  await load<Array<{ kind: string; available: boolean; claimIds: string[] }>>(
    "links.json",
  );
const byId = new Map(claims.map((claim) => [claim.id, claim]));
const errors: string[] = [];

for (const claim of claims) {
  if (!claim.id || !claim.evidence)
    errors.push(`Claim ${claim.id || "<missing>"} lacks evidence`);
  if (
    claim.approved &&
    (!claim.publicSafe ||
      !claim.lastVerified ||
      !/^\d{4}-\d{2}-\d{2}$/.test(claim.lastVerified))
  ) {
    errors.push(
      `Approved claim ${claim.id} is not public-safe and recently verifiable`,
    );
  }
}
for (const link of links) {
  for (const claimId of link.claimIds) {
    const claim = byId.get(claimId);
    if (!claim)
      errors.push(`Link ${link.kind} references missing claim ${claimId}`);
    if (link.available && (!claim?.approved || !claim.publicSafe))
      errors.push(
        `Available link ${link.kind} uses unapproved claim ${claimId}`,
      );
  }
}
for (const record of records) {
  for (const claimId of record.claimIds) {
    const claim = byId.get(claimId);
    if (!claim)
      errors.push(
        `Record ${record.id ?? "profile"} references missing claim ${claimId}`,
      );
    if (record.publish && (!claim?.approved || !claim.publicSafe))
      errors.push(
        `Published record ${record.id ?? "profile"} uses unapproved claim ${claimId}`,
      );
  }
}
if (errors.length)
  throw new Error(`Content validation failed:\n${errors.join("\n")}`);
console.log(
  `Validated ${records.length} records and ${claims.length} evidence-backed claims.`,
);
