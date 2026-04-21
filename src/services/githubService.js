const GITHUB_API = 'https://api.github.com';
const TOKEN  = 'import.meta.env.VITE_GITHUB_TOKEN';
const OWNER  = 'straintrack8-afk';
const REPO   = 'FarmWell';
const PATH   = 'public/data/announcements.json';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

export async function fetchAnnouncements() {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${PATH}`,
    { headers }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  const content = JSON.parse(atob(data.content.replace(/\n/g, '')));
  return { announcements: content, sha: data.sha };
}

export async function saveAnnouncements(announcements, sha) {
  const content = btoa(unescape(encodeURIComponent(
    JSON.stringify(announcements, null, 2)
  )));
  const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${PATH}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `[Admin] Update announcements — ${now} WIB`,
        content,
        sha,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to save');
  }
  return await res.json();
}
