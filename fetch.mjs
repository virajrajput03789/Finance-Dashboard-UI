import fs from 'fs';

async function run() {
  const items = {
    'stitch_dashboard.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzVlMTEzMzg5ZmQxYTQ2YmE5NjI0NGFjY2VkOGU4ZGI1EgsSBxDD1sSl5wQYAZIBIwoKcHJvamVjdF9pZBIVQhM1MjkwMzcyMDU4NTMyNDA1OTE0&filename=&opi=89354086',
    'stitch_insights.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzYwZmNmYWZlOWE0YTQwZGE5YzZlOGYxYmJkZmU0MTc5EgsSBxDD1sSl5wQYAZIBIwoKcHJvamVjdF9pZBIVQhM1MjkwMzcyMDU4NTMyNDA1OTE0&filename=&opi=89354086',
    'stitch_transactions.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2NkNGVhZmY4ZjhiNTRlZTM5NmQ1MjZhZjkyZjZlOGNmEgsSBxDD1sSl5wQYAZIBIwoKcHJvamVjdF9pZBIVQhM1MjkwMzcyMDU4NTMyNDA1OTE0&filename=&opi=89354086'
  };

  for (const [k, v] of Object.entries(items)) {
    console.log(`Fetching ${k}...`);
    try {
      const resp = await fetch(v);
      const text = await resp.text();
      fs.writeFileSync(k, text);
      console.log(`Saved ${text.length} bytes to ${k}`);
    } catch(e) {
      console.error(e);
    }
  }
}
run();
