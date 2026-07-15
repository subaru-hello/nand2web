// ---------------------------------------------------------------------------
// Coordinate
// ---------------------------------------------------------------------------

export interface Coord {
  readonly x: number;
  readonly y: number;
}

export function coordEq(a: Coord, b: Coord): boolean {
  return a.x === b.x && a.y === b.y;
}

export function coordKey(c: Coord): string {
  return `${c.x},${c.y}`;
}

// ---------------------------------------------------------------------------
// Grid model
// ---------------------------------------------------------------------------

export interface Grid {
  readonly width: number;
  readonly height: number;
  /**
   * Flat row-major array of booleans; true = wall (impassable).
   * Index = y * width + x.
   */
  readonly walls: readonly boolean[];
  readonly start: Coord;
  readonly goal: Coord;
}

export function createGrid(
  width: number,
  height: number,
  start: Coord,
  goal: Coord,
): Grid {
  const walls: boolean[] = new Array<boolean>(width * height).fill(false);
  return { width, height, walls, start, goal };
}

function toIndex(grid: Grid, c: Coord): number {
  return c.y * grid.width + c.x;
}

export function fromIndex(grid: Grid, index: number): Coord {
  return { x: index % grid.width, y: Math.floor(index / grid.width) };
}

export function inBounds(grid: Grid, c: Coord): boolean {
  return c.x >= 0 && c.x < grid.width && c.y >= 0 && c.y < grid.height;
}

export function isWall(grid: Grid, c: Coord): boolean {
  if (!inBounds(grid, c)) return true;
  return (grid.walls[toIndex(grid, c)] as boolean | undefined) ?? false;
}

export function toggleWall(grid: Grid, c: Coord): Grid {
  if (!inBounds(grid, c)) return grid;
  const walls = [...grid.walls];
  walls[toIndex(grid, c)] = !walls[toIndex(grid, c)];
  return { ...grid, walls };
}

export function setWall(grid: Grid, c: Coord, wall: boolean): Grid {
  if (!inBounds(grid, c)) return grid;
  const walls = [...grid.walls];
  walls[toIndex(grid, c)] = wall;
  return { ...grid, walls };
}

// 4-directional neighbors (no diagonals), in-bounds and passable only.
const DIRS: readonly Coord[] = [
  { x: 0, y: -1 }, // north
  { x: 1, y: 0 },  // east
  { x: 0, y: 1 },  // south
  { x: -1, y: 0 }, // west
];

export function neighbors(grid: Grid, c: Coord): Coord[] {
  const result: Coord[] = [];
  for (const d of DIRS) {
    const nb: Coord = { x: c.x + d.x, y: c.y + d.y };
    if (inBounds(grid, nb) && !isWall(grid, nb)) {
      result.push(nb);
    }
  }
  return result;
}

export function cloneGrid(grid: Grid): Grid {
  return { ...grid, walls: [...grid.walls] };
}

export function serializeGrid(grid: Grid): string {
  return JSON.stringify(grid);
}
