// Builds public/register.json by matching the page folders against pages.json.
// It never fails the build, so a page with missing details still publishes and shows as needing details.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = 'public/pages';
const STATUSES = ['draft', 'review', 'approved', 'with-walter', 'live', 'retired'];

const folders = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((name) => statSync(join(dir, name)).isDirectory()) : [];

let listed = [];
let problem = '';
try {
  const parsed = JSON.parse(readFileSync('pages.json', 'utf8'));
  if (Array.isArray(parsed)) listed = parsed;
  else problem = 'pages.json has to be a list.';
} catch (error) {
  problem = `pages.json could not be read: ${error.message}`;
}

const onDisk = folders(root).flatMap((funnel) =>
  folders(join(root, funnel))
    .filter((page) => existsSync(join(root, funnel, page, 'index.html')))
    .map((page) => `${funnel}/${page}`)
);

const byPath = new Map(listed.filter((entry) => entry && entry.path).map((entry) => [entry.path, entry]));

const rows = onDisk.map((path) => {
  const entry = byPath.get(path);
  const needsDetails = !entry || !entry.title || !STATUSES.includes(entry.status);
  return {
    path,
    url: `/pages/${path}/`,
    funnel: path.split('/')[0],
    title: entry?.title || path,
    status: STATUSES.includes(entry?.status) ? entry.status : 'draft',
    updated: entry?.updated || '',
    liveUrl: entry?.liveUrl || '',
    needsDetails,
    missingFolder: false,
  };
});

for (const [path, entry] of byPath) {
  if (!onDisk.includes(path)) {
    rows.push({
      path,
      url: '',
      funnel: path.split('/')[0],
      title: entry.title || path,
      status: STATUSES.includes(entry.status) ? entry.status : 'draft',
      updated: entry.updated || '',
      liveUrl: entry.liveUrl || '',
      needsDetails: false,
      missingFolder: true,
    });
  }
}

rows.sort((a, b) => a.funnel.localeCompare(b.funnel) || a.path.localeCompare(b.path));

mkdirSync('public', { recursive: true });
writeFileSync('public/register.json', JSON.stringify({ problem, rows }, null, 2));
console.log(`Register built with ${rows.length} page(s).${problem ? ` ${problem}` : ''}`);
