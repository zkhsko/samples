// */1 * * * * curl -x http://192.168.1.89:1087 'https://probe.dongpo-li.workers.dev/api/hit?id=3c4d91a7-3886-4d5f-ab8e-41cb6232e99e'
// https://probe.dongpo-li.workers.dev/status
const MINUTE_MS = 60 * 1000;
const WINDOW_HOURS = 3;

function nowMinute() {
  return Math.floor(Date.now() / MINUTE_MS);
}

async function recordHit(id, env) {
  const m = nowMinute();
  await env.d1_db
    .prepare("INSERT OR IGNORE INTO hits (id, minute) VALUES (?, ?)")
    .bind(id, m)
    .run();
}

function formatMinute(minute) {
  const d = new Date(minute * MINUTE_MS);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function renderStatusHtml(filterId, hitsById, start, now) {
  let ids = Array.from(hitsById.keys());
  if (filterId) {
    ids = [filterId];
  }
  ids.sort();

  const sections = [];

  if (!ids.length) {
    sections.push(
      `<div class="empty">暂无数据，请先调用 /api/hit?id=YOUR_ID</div>`
    );
  } else {
    for (const id of ids) {
      const list = hitsById.get(id) || [];
      let idx = 0;
      while (idx < list.length && list[idx] < start) {
        idx++;
      }

      let cells = "";
      for (let minute = start; minute <= now; minute++) {
        const hit = idx < list.length && list[idx] === minute;
        if (hit) {
          idx++;
        }
        const colorClass = hit ? "hit" : "miss";
        const label = formatMinute(minute);
        cells += `<div class="cell ${colorClass}" title="${label}"></div>`;
      }

      sections.push(
        `<section class="id-section">
  <h2>${id}</h2>
  <div class="grid">
    ${cells}
  </div>
</section>`
      );
    }
  }

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Probe</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #0b1020;
      color: #e5e7eb;
      margin: 0;
      padding: 16px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 18px;
    }
    h2 {
      margin: 16px 0 8px;
      font-size: 15px;
    }
    .subtitle {
      margin-bottom: 16px;
      font-size: 13px;
      color: #9ca3af;
    }
    .id-section:first-of-type h2 {
      margin-top: 8px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(4px, 1fr));
      gap: 3px;
    }
    .cell {
      width: 100%;
      aspect-ratio: 1 / 4;
      border-radius: 3px;
      box-sizing: border-box;
    }
    .cell.hit {
      background: #10b981;
      color: #022c22;
    }
    .cell.miss {
      background: #b91c1c;
      color: #fee2e2;
    }
    .legend {
      margin-top: 12px;
      font-size: 12px;
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }
    .legend-color.hit {
      background: #10b981;
    }
    .legend-color.miss {
      background: #b91c1c;
    }
    .empty {
      margin-top: 16px;
      font-size: 13px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <h1>Probe</h1>
  <div class="subtitle">最近 ${WINDOW_HOURS} 小时的分钟级探针状态（绿色=有请求，红色=无请求）</div>
  ${sections.join("\n")}
  <div class="legend">
    <div class="legend-item">
      <div class="legend-color hit"></div>
      <span>有请求</span>
    </div>
    <div class="legend-item">
      <div class="legend-color miss"></div>
      <span>无请求</span>
    </div>
  </div>
</body>
</html>`;
  return html;
}

async function handleHit(request, env) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await recordHit(id, env);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleStatus(request, env) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || null;

  const now = nowMinute();
  const start = now - WINDOW_HOURS * 60;

  let query =
    "SELECT id, minute FROM hits WHERE minute BETWEEN ? AND ? ORDER BY id, minute";
  let stmt = env.d1_db.prepare(query).bind(start, now);

  if (id) {
    query =
      "SELECT id, minute FROM hits WHERE id = ? AND minute BETWEEN ? AND ? ORDER BY id, minute";
    stmt = env.d1_db.prepare(query).bind(id, start, now);
  }

  const { results } = await stmt.all();

  const hitsById = new Map();
  for (const row of results || []) {
    const key = row.id;
    const minute = row.minute;
    if (key == null || minute == null) continue;
    let list = hitsById.get(key);
    if (!list) {
      list = [];
      hitsById.set(key, list);
    }
    list.push(minute);
  }

  const html = renderStatusHtml(id, hitsById, start, now);
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/api/hit") {
      return handleHit(request, env);
    }

    if (path === "/status") {
      return handleStatus(request, env);
    }

    if (path === "/") {
      return new Response(
        'OK. Use /api/hit?id=YOUR_ID and /status (optional ?id=YOUR_ID)',
        { status: 200 }
      );
    }

    return new Response("Not found", { status: 404 });
  },
};
