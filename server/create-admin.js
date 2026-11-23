// Creates or resets an admin account:  npm run create-admin
import readline from 'node:readline';
import { init, getUsers, saveUsers } from './store.js';
import { hashPassword } from './auth.js';

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); };
    rl.question(question, (answer) => { rl.close(); if (hidden) process.stdout.write('\n'); resolve(answer.trim()); });
  });
}

await init();
const username = process.env.ADMIN_USER || (await ask('Admin username (for example: admin): '));
const password = process.env.ADMIN_PASSWORD || (await ask('Password (at least 10 characters): ', true));
if (!username || password.length < 10) { console.error('A username and a password of at least 10 characters are required.'); process.exit(1); }

const users = await getUsers();
const existing = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
const hash = await hashPassword(password);
if (existing) { existing.hash = hash; existing.pv = (existing.pv || 1) + 1; } else users.push({ username, hash, pv: 1 });
await saveUsers(users);
console.log(existing ? `Password updated for "${username}".` : `Admin "${username}" created. You can now sign in at /admin.`);
