/** Scan the index by default; --worktree checks tracked contents for CI. Never prints suspected secret values. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const worktree = process.argv.includes('--worktree');
const names = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
assert.ok(names.length, 'Stage the intended repository files before scanning.');
const findings = [];
const secretRules = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,})\b/],
  ['API secret', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,}\b/],
  ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['credential assignment', /(?:password|api_key|client_secret|access_token)\s*[:=]\s*["'][A-Za-z0-9/+_.-]{16,}["']/i],
  ['private home path', /\/(?:home|Users)\/[a-z][a-z0-9_-]*\//i],
  ['private network address', /\b192\.168\.\d{1,3}\.\d{1,3}\b/]
];
let totalBytes = 0, largest = { file: '', bytes: 0 }, glbs = 0;
for (const file of names) {
  if (/^(?:node_modules|dist|\.local|public\/models\/original)\//.test(file) || /(?:^|\/)\.env(?:\.|$)/.test(file) && file !== '.env.example' || /\.(?:pem|key|p12|pfx|y4m|log|pyc)$/.test(file)) findings.push({ file, rule: 'excluded file in repository' });
  const data = worktree ? await fs.readFile(file) : execFileSync('git', ['show', `:${file}`], { maxBuffer: 110 * 1024 * 1024 });
  totalBytes += data.length;
  if (data.length > largest.bytes) largest = { file, bytes: data.length };
  if (data.length >= 50 * 1024 * 1024) findings.push({ file, rule: 'large binary needs explicit storage review' });
  let source;
  if (file.endsWith('.glb')) {
    glbs++;
    assert.equal(data.readUInt32LE(0), 0x46546c67, `Invalid GLB: ${file}`);
    source = data.subarray(20, 20 + data.readUInt32LE(12)).toString('utf8');
  } else if (file.endsWith('.png') && file.startsWith('reports/thumbnails/')) {
    let offset=8;while(offset<data.length){const size=data.readUInt32BE(offset),type=data.subarray(offset+4,offset+8).toString();if(['tEXt','zTXt','iTXt','eXIf'].includes(type))findings.push({file,rule:'generated thumbnail metadata needs sanitization'});offset+=size+12;}
  } else if (!/\.(?:png|jpe?g|webp|mind)$/.test(file)) source = data.toString('utf8');
  if (source) {
    for (const [rule, pattern] of secretRules) if (pattern.test(source)) findings.push({ file, rule });
    const emails = source.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
    // npm lockfile deprecation notices contain a reviewed public maintainer contact.
    const reviewedEmails=emails.filter(email=>!(file==='package-lock.json'&&/@izs\.me$/i.test(email)));
    if (reviewedEmails.some(email => !/@(?:users\.noreply\.github\.com|example\.(?:com|org))$/i.test(email))) findings.push({ file, rule: 'email address needs manual review' });
  }
}
const result = { checkedFiles: names.length, optimizedGLBs: glbs, totalMiB: totalBytes / 1048576, largest, findings };
console.log(JSON.stringify(result, null, 2));
assert.equal(findings.length, 0, 'Resolve findings before committing or publishing.');
