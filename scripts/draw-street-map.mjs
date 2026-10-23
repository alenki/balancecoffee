/**
 * Draws the street map in the visit section, once.
 *
 * Fetches the streets around the café from OpenStreetMap (Overpass API),
 * turns them so Pushkina Street runs level, clips them to the area the map
 * shows, simplifies them and writes src/data/streetMap.ts. The output is
 * committed, like the traced logo: the site never calls OpenStreetMap, and
 * the drawing only changes when this is rerun.
 *
 * Coordinates are metres from the café door, x east along Pushkina, y down
 * the page. The café's position is read from src/data/cafe.ts.
 *
 * Run via `npm run map`. `--from <file>` reads a saved Overpass response
 * instead of fetching; `--save <file>` keeps the one it fetched.
 *
 * Map data © OpenStreetMap contributors, under the ODbL. The section credits
 * them under the map.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT_FILE = join('src', 'data', 'streetMap.ts');
const CAFE_FILE = join('src', 'data', 'cafe.ts');

/** How far around the café to fetch, in metres. Covers the widest crop's corners. */
const FETCH_RADIUS = 900;

/** What the map keeps after turning, in metres: every crop fits inside. */
const EXTENT = { x0: -360, x1: 620, y0: -240, y1: 240 };

/** Douglas-Peucker tolerance, in metres. Well under a pixel at any crop. */
const SIMPLIFY = 0.6;

const MAJOR = new Set(['trunk', 'primary', 'secondary']);
const MINOR = new Set(['tertiary', 'residential', 'unclassified', 'living_street']);

/** The streets the map can label, by their OpenStreetMap names. */
const IDS = {
  'улица Пушкина': 'pushkina',
  'улица Чехова': 'chekhova',
  'улица Кешокова': 'keshokova',
  'проспект Ленина': 'lenina',
  'проспект Шогенцукова': 'shogentsukova',
  'улица Ногмова': 'nogmova',
};

/** The stop the directions name. */
const STOP_NAME = 'Городская администрация';

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};

async function cafeCoordinates() {
  const source = await readFile(CAFE_FILE, 'utf8');
  const match = source.match(/coordinates:\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/);
  if (!match) throw new Error(`No coordinates in ${CAFE_FILE}`);
  return [Number(match[1]), Number(match[2])];
}

async function fetchOverpass(lat, lon) {
  const highways = [...MAJOR, ...MINOR].join('|');
  const query = `[out:json][timeout:80];
(
  way(around:${FETCH_RADIUS},${lat},${lon})[highway~"^(${highways})$"];
  node(around:${FETCH_RADIUS},${lat},${lon})[highway=bus_stop];
);
out geom tags;`;

  // The public instance turns away anonymous clients and sheds load when busy.
  for (let attempt = 0, wait = 5; attempt < 5; attempt++, wait *= 2) {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'User-Agent': 'biblioteka-site/1.0 (one-off street map drawing for a café website)',
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ data: query }),
    });
    if (response.ok) return response.json();
    console.warn(`Overpass answered ${response.status}; retrying in ${wait}s`);
    await new Promise((resolve) => setTimeout(resolve, wait * 1000));
  }
  throw new Error('Overpass kept refusing; try again later or pass --from');
}

/** Perpendicular distance from p to the line through a and b. */
function offLine([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const length = Math.hypot(dx, dy);
  if (length === 0) return Math.hypot(px - ax, py - ay);
  return Math.abs(dy * px - dx * py + bx * ay - by * ax) / length;
}

function simplify(points, tolerance) {
  if (points.length < 3) return points;
  let worst = 0;
  let at = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = offLine(points[i], points[0], points[points.length - 1]);
    if (d > worst) {
      worst = d;
      at = i;
    }
  }
  if (worst <= tolerance) return [points[0], points[points.length - 1]];
  const left = simplify(points.slice(0, at + 1), tolerance);
  const right = simplify(points.slice(at), tolerance);
  return [...left.slice(0, -1), ...right];
}

/** Whether the segment's bounding box touches the extent. */
function touches([ax, ay], [bx, by]) {
  return (
    Math.max(ax, bx) >= EXTENT.x0 &&
    Math.min(ax, bx) <= EXTENT.x1 &&
    Math.max(ay, by) >= EXTENT.y0 &&
    Math.min(ay, by) <= EXTENT.y1
  );
}

/** Splits a line into the runs that pass through the extent. */
function clip(points) {
  const runs = [];
  let run = [];
  for (let i = 1; i < points.length; i++) {
    if (touches(points[i - 1], points[i])) {
      if (run.length === 0) run.push(points[i - 1]);
      run.push(points[i]);
    } else if (run.length) {
      runs.push(run);
      run = [];
    }
  }
  if (run.length) runs.push(run);
  return runs;
}

const round = (n) => Math.round(n * 10) / 10;

async function main() {
  const [lat0, lon0] = await cafeCoordinates();
  const from = option('--from');
  const data = from ? JSON.parse(await readFile(from, 'utf8')) : await fetchOverpass(lat0, lon0);
  const save = option('--save');
  if (save) await writeFile(save, JSON.stringify(data));

  const mLat = 111_320;
  const mLon = 111_320 * Math.cos((lat0 * Math.PI) / 180);
  const project = ({ lat, lon }) => [(lon - lon0) * mLon, -(lat - lat0) * mLat];

  const ways = data.elements.filter((e) => e.type === 'way' && e.geometry);

  // Turn the map so the stretch of Pushkina nearest the café runs level
  let nearest;
  for (const way of ways) {
    if (way.tags?.name !== 'улица Пушкина') continue;
    const points = way.geometry.map(project);
    for (let i = 1; i < points.length; i++) {
      const [a, b] = [points[i - 1], points[i]];
      const d = Math.hypot((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      if (!nearest || d < nearest.d) nearest = { d, a, b };
    }
  }
  if (!nearest) throw new Error('Pushkina Street is missing from the response');
  let turn = -Math.atan2(nearest.b[1] - nearest.a[1], nearest.b[0] - nearest.a[0]);
  // Read Pushkina west to east, so north stays in the top half
  if (Math.abs(turn) > Math.PI / 2) turn -= Math.sign(turn) * Math.PI;
  const [cos, sin] = [Math.cos(turn), Math.sin(turn)];
  const place = (node) => {
    const [x, y] = project(node);
    return [x * cos - y * sin, x * sin + y * cos];
  };

  const streets = [];
  for (const way of ways) {
    const highway = way.tags?.highway;
    const major = MAJOR.has(highway);
    if (!major && !MINOR.has(highway)) continue;
    const id = IDS[way.tags?.name];
    for (const run of clip(way.geometry.map(place))) {
      const points = simplify(run, SIMPLIFY).flatMap(([x, y]) => [round(x), round(y)]);
      streets.push({ id, major, points });
    }
  }
  // Majors last, so they draw over the side streets they cross
  streets.sort((a, b) => Number(a.major) - Number(b.major) || (a.id ?? '').localeCompare(b.id ?? ''));

  const stops = data.elements.filter(
    (e) => e.type === 'node' && e.tags?.highway === 'bus_stop' && e.tags?.name === STOP_NAME,
  );
  if (!stops.length) throw new Error(`No "${STOP_NAME}" stop in the response`);
  const stop = stops
    .map(place)
    .sort((a, b) => Math.hypot(...a) - Math.hypot(...b))[0]
    .map(round);

  const degrees = Math.round(((turn * 180) / Math.PI) * 10) / 10;
  const body = streets
    .map(({ id, major, points }) => {
      const key = id ? `id: '${id}', ` : '';
      return `  { ${key}major: ${major}, points: [${points.join(', ')}] },`;
    })
    .join('\n');

  const out = `/**
 * The streets around the café, drawn from OpenStreetMap by
 * scripts/draw-street-map.mjs (\`npm run map\`). Generated: edit the script,
 * not this file.
 *
 * Map data © OpenStreetMap contributors, under the ODbL.
 *
 * Metres from the café door, turned ${degrees}° clockwise from north so that
 * Pushkina Street runs level: x east along Pushkina, y down the page. Each
 * street is a flat run of x, y pairs.
 */

export type StreetId = ${Object.values(IDS)
    .map((id) => `'${id}'`)
    .join(' | ')};

export interface Street {
  id?: StreetId;
  /** The avenues and through roads, drawn heavier. */
  major: boolean;
  points: readonly number[];
}

/** How far the map is turned clockwise from north, in degrees. */
export const MAP_TURN = ${degrees};

/** The "${STOP_NAME}" stop nearest the door. */
export const BUS_STOP: readonly [number, number] = [${stop.join(', ')}];

export const STREETS: readonly Street[] = [
${body}
];
`;
  await writeFile(OUT_FILE, out);
  console.log(`Wrote ${OUT_FILE}: ${streets.length} lines, turned ${degrees}°, stop at ${stop.join(', ')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
