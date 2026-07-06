"use client"

import { useEffect, useRef, useCallback } from "react"

// ----- Responsive grid -----
const CELL_SIZE = 16  // px per cell — smaller = denser
function calcGrid(w: number, h: number) {
  const cols = Math.max(30, Math.floor(w / CELL_SIZE))
  const rows = Math.max(15, Math.floor(h / CELL_SIZE * 0.85))
  return { cols, rows }
}

// ----- ASCII charset -----
const ASCII_CHARS = " .'`^\":;+!*?8#%@"

function brightnessToChar(b: number): string {
  const idx = Math.floor(b * (ASCII_CHARS.length - 1))
  return ASCII_CHARS[Math.max(0, Math.min(idx, ASCII_CHARS.length - 1))]
}

// ----- Easing -----
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// ----- Mouse & scroll state -----
// (module-level refs so all functions see the latest values)
let gMouseX = 0.5
let gMouseY = 0.5
let gScrollSpeed = 0
let gScrollDecay = 0

// ----- Draw functions -----

function addNode(
  grid: number[][], cols: number, rows: number,
  nx: number, ny: number, radius: number, brightness: number,
  warpX = 0, warpY = 0
) {
  const r = Math.ceil(radius)
  const lightX = -0.62, lightY = -0.52, lightZ = 0.58
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const px = dx / radius + warpX * 0.03
      const py = dy / (radius * 0.86) + warpY * 0.03
      const dist = Math.hypot(px, py)
      if (dist <= 1) {
        const gx = Math.round(nx * cols + dx)
        const gy = Math.round(ny * rows + dy)
        if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
          const nz = Math.sqrt(Math.max(0, 1 - dist * dist))
          const lambert = Math.max(0, px * lightX + py * lightY + nz * lightZ)
          const specular = Math.pow(Math.max(0, lambert), 7) * 0.28
          const rim = Math.pow(1 - nz, 1.8) * 0.18
          const shading = 0.56 + lambert * 0.38 + specular + rim
          const falloff = 1 - dist * 0.42
          grid[gy][gx] = Math.max(grid[gy][gx], Math.min(1, brightness * falloff * shading))
        }
      }
    }
  }
}

function addEdge(
  grid: number[][], cols: number, rows: number,
  x1: number, y1: number, x2: number, y2: number, brightness: number
) {
  const steps = Math.max(30, Math.hypot((x2 - x1) * cols, (y2 - y1) * rows))
  for (let s = 0; s <= steps; s++) {
    const u = s / steps
    const x = x1 + (x2 - x1) * u
    const y = y1 + (y2 - y1) * u
    const gx = Math.round(x * cols)
    const gy = Math.round(y * rows)
    if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
      grid[gy][gx] = Math.max(grid[gy][gx], brightness)
    }
  }
}

// ----- Nodes + edges graph -----
function nodesAndEdges(
  cols: number, rows: number,
  nodePositions: [number, number][], pulse: number,
  warpX = 0, warpY = 0
): number[][] {
  const grid: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(0))
  const nodeBrightness = 0.85 + 0.15 * pulse
  const edgeBrightness = 0.54 + 0.24 * pulse
  const nodeRadius = 0.065
  const n = nodePositions.length
  const centerIndex = n - 1
  const outerCount = Math.max(0, n - 1)

  for (let i = 0; i < n; i++) {
    const [nx, ny] = nodePositions[i]
    const depthBoost = 0.94 + ny * 0.18
    addNode(grid, cols, rows, nx, ny, nodeRadius * Math.min(cols, rows),
      Math.min(1, nodeBrightness * depthBoost), warpX, warpY)
  }

  for (let i = 0; i < outerCount; i++) {
    addEdge(grid, cols, rows,
      nodePositions[i][0], nodePositions[i][1],
      nodePositions[centerIndex][0], nodePositions[centerIndex][1],
      edgeBrightness)
  }

  if (outerCount >= 2) {
    addEdge(grid, cols, rows,
      nodePositions[0][0], nodePositions[0][1],
      nodePositions[1][0], nodePositions[1][1],
      edgeBrightness * 0.95)
  }

  return grid
}

// ----- Lighting -----
const LX = -0.52, LY = -0.58, LZ = 0.63
const LMAG = Math.hypot(LX, LY, LZ)

function lambertSpec(nx: number, ny: number, nz: number): number {
  const lambert = Math.max(0, (nx * LX + ny * LY + nz * LZ) / LMAG)
  const spec = Math.pow(lambert, 10) * 0.32
  const rim = Math.pow(Math.max(0, 1 - nz), 2.2) * 0.12
  return Math.min(1, 0.18 + lambert * 0.52 + spec + rim)
}

// ----- Star (modulated torus) -----
function starShape(cols: number, rows: number, rotation: number, speedMul = 1): number[][] {
  const grid: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(0))
  const cx = cols / 2, cy = rows / 2
  const baseR = Math.min(cols, rows) * 0.28
  const modulation = Math.min(cols, rows) * 0.10
  const tubeR = Math.min(cols, rows) * 0.075
  const A = rotation * speedMul, B = rotation * 1.3 * speedMul
  const cosA = Math.cos(A), sinA = Math.sin(A)
  const cosB = Math.cos(B), sinB = Math.sin(B)
  const thetaSteps = 300, phiSteps = 60

  for (let ti = 0; ti < thetaSteps; ti++) {
    const theta = (ti / thetaSteps) * Math.PI * 2
    const cosT = Math.cos(theta), sinT = Math.sin(theta)
    const R = baseR + modulation * Math.cos(5 * theta)
    for (let pi = 0; pi < phiSteps; pi++) {
      const phi = (pi / phiSteps) * Math.PI * 2
      const cosP = Math.cos(phi), sinP = Math.sin(phi)

      const ox = (R + tubeR * cosP) * cosT
      const oy = (R + tubeR * cosP) * sinT
      const oz = tubeR * sinP
      const nx = cosP * cosT, ny = cosP * sinT, nz = sinP

      const py = oy * cosA - oz * sinA
      const ny1 = ny * cosA - nz * sinA
      const nz1 = ny * sinA + nz * cosA
      const px = ox * cosB - py * sinB
      const py2 = ox * sinB + py * cosB
      const nx1 = nx * cosB - ny1 * sinB
      const ny2 = nx * sinB + ny1 * cosB

      if (nz1 < 0) continue
      const sx = Math.round(cx + px), sy = Math.round(cy + py2)
      if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) continue
      const brightness = lambertSpec(nx1, ny2, nz1)
      grid[sy][sx] = Math.max(grid[sy][sx], brightness)
    }
  }
  return grid
}

function pointInConvexQuad(px: number, py: number, c: number[][]): boolean {
  let sign = 0
  for (let i = 0; i < 4; i++) {
    const [x1, y1] = c[i]
    const [x2, y2] = c[(i + 1) % 4]
    const cross = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1)
    if (cross > 0) { if (sign < 0) return false; sign = 1 }
    else if (cross < 0) { if (sign > 0) return false; sign = -1 }
  }
  return true
}

// ----- 3D cube -----
function squareShape(cols: number, rows: number, rotation: number, speedMul = 1): number[][] {
  const grid: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(0))
  const cx = cols / 2, cy = rows / 2
  const size = Math.min(cols, rows) * 0.19
  const rot = rotation * speedMul
  const cosR = Math.cos(rot), sinR = Math.sin(rot)
  const tiltX = 0.48
  const cosTx = Math.cos(tiltX), sinTx = Math.sin(tiltX)
  const tubeR = Math.min(cols, rows) * 0.045

  const verts: [number, number, number][] = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
  ]

  const rotateVert = (x: number, y: number, z: number): [number, number, number] => {
    const rx = x * cosR + z * sinR
    const rz = -x * sinR + z * cosR
    const ry = y * cosTx - rz * sinTx
    const rz2 = y * sinTx + rz * cosTx
    return [rx * size, ry * size, rz2]
  }

  const transformNorm = (nx: number, ny: number, nz: number): [number, number, number] => {
    const rnx = nx * cosR + nz * sinR
    const rnzMid = -nx * sinR + nz * cosR
    const rny = ny * cosTx - rnzMid * sinTx
    const rnz = ny * sinTx + rnzMid * cosTx
    return [rnx, rny, rnz]
  }

  const rotated3D = verts.map(([x, y, z]) => rotateVert(x, y, z))
  const projected = rotated3D.map(([x, y, z]) => [cx + x, cy + y, z] as [number, number, number])

  const faces: { idx: number[]; n: [number, number, number] }[] = [
    { idx: [0, 1, 2, 3], n: [0, 0, -1] }, { idx: [5, 4, 7, 6], n: [0, 0, 1] },
    { idx: [4, 0, 3, 7], n: [-1, 0, 0] }, { idx: [1, 5, 6, 2], n: [1, 0, 0] },
    { idx: [4, 5, 1, 0], n: [0, -1, 0] }, { idx: [3, 2, 6, 7], n: [0, 1, 0] },
  ]

  for (const { idx, n } of faces) {
    const [rnx, rny, rnz] = transformNorm(n[0], n[1], n[2])
    if (rnz < 0.01) continue
    const brightness = lambertSpec(rnx, rny, rnz)
    const corners = idx.map(i => [projected[i][0], projected[i][1]])
    const xs = corners.map(c => c[0]), ys = corners.map(c => c[1])
    const minX = Math.max(0, Math.floor(Math.min(...xs)))
    const maxX = Math.min(cols - 1, Math.ceil(Math.max(...xs)))
    const minY = Math.max(0, Math.floor(Math.min(...ys)))
    const maxY = Math.min(rows - 1, Math.ceil(Math.max(...ys)))
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (pointInConvexQuad(x, y, corners as number[][])) {
          grid[y][x] = Math.max(grid[y][x], brightness)
        }
      }
    }
  }

  // Cube edges + vertex spheres
  const edgeIdx: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ]

  for (const [i, j] of edgeIdx) {
    const [ax, ay] = rotated3D[i], [bx, by] = rotated3D[j]
    const edx = bx - ax, edy = by - ay, edz = rotated3D[j][2] - rotated3D[i][2]
    const len = Math.hypot(edx, edy, edz) || 1
    const ex = edx / len, ey = edy / len, ez = edz / len
    let ux: number, uy: number, uz: number
    if (Math.abs(ez) < 0.9) { ux = ey; uy = -ex; uz = 0 }
    else { ux = 0; uy = ez; uz = -ey }
    const umag = Math.hypot(ux, uy, uz) || 1
    ux /= umag; uy /= umag; uz /= umag
    const vx = ey * uz - ez * uy, vy = ez * ux - ex * uz, vz = ex * uy - ey * ux
    const lengthSteps = Math.max(30, Math.ceil(len * 2.5))
    const angleSteps = 16
    for (let li = 0; li <= lengthSteps; li++) {
      const lt = li / lengthSteps
      const pcx = ax + edx * lt, pcy = ay + edy * lt
      for (let ai = 0; ai < angleSteps; ai++) {
        const angle = (ai / angleSteps) * Math.PI * 2
        const cosAng = Math.cos(angle), sinAng = Math.sin(angle)
        const tnx = cosAng * ux + sinAng * vx, tny = cosAng * uy + sinAng * vy, tnz = cosAng * uz + sinAng * vz
        if (tnz < 0) continue
        const sx = Math.round(cx + pcx + tubeR * tnx), sy = Math.round(cy + pcy + tubeR * tny)
        if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) continue
        grid[sy][sx] = Math.max(grid[sy][sx], lambertSpec(tnx, tny, tnz))
      }
    }
  }

  for (let vi = 0; vi < rotated3D.length; vi++) {
    const [rx, ry] = rotated3D[vi]
    const sphereSteps = 16
    for (let ti = 0; ti < sphereSteps; ti++) {
      const theta = (ti / sphereSteps) * Math.PI * 2
      for (let pi = 0; pi <= sphereSteps / 2; pi++) {
        const phi = (pi / (sphereSteps / 2)) * Math.PI
        const snx = Math.sin(phi) * Math.cos(theta), sny = Math.sin(phi) * Math.sin(theta), snz = Math.cos(phi)
        if (snz < 0) continue
        const sx = Math.round(cx + rx + tubeR * snx), sy = Math.round(cy + ry + tubeR * sny)
        if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) continue
        grid[sy][sx] = Math.max(grid[sy][sx], lambertSpec(snx, sny, snz))
      }
    }
  }

  return grid
}

// ----- Torus (circle) -----
function circleShape(cols: number, rows: number, rotation: number, speedMul = 1): number[][] {
  const grid: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(0))
  const cx = cols / 2, cy = rows / 2
  const R = Math.min(cols, rows) * 0.24, r = Math.min(cols, rows) * 0.095
  const A = rotation * speedMul, B = rotation * 1.4 * speedMul
  const cosA = Math.cos(A), sinA = Math.sin(A)
  const cosB = Math.cos(B), sinB = Math.sin(B)
  const thetaSteps = 240, phiSteps = 80

  for (let ti = 0; ti < thetaSteps; ti++) {
    const theta = (ti / thetaSteps) * Math.PI * 2
    const cosT = Math.cos(theta), sinT = Math.sin(theta)
    for (let pi = 0; pi < phiSteps; pi++) {
      const phi = (pi / phiSteps) * Math.PI * 2
      const cosP = Math.cos(phi), sinP = Math.sin(phi)
      const ox = (R + r * cosP) * cosT, oy = (R + r * cosP) * sinT, oz = r * sinP
      let nx = cosP * cosT, ny = cosP * sinT, nz = sinP
      const py = oy * cosA - oz * sinA, pz = oy * sinA + oz * cosA
      const ny1 = ny * cosA - nz * sinA, nz1 = ny * sinA + nz * cosA
      const px = ox * cosB - py * sinB, py2 = ox * sinB + py * cosB
      const nx1 = nx * cosB - ny1 * sinB, ny2 = nx * sinB + ny1 * cosB
      if (nz1 < 0) continue
      const sx = Math.round(cx + px), sy = Math.round(cy + py2)
      if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) continue
      grid[sy][sx] = Math.max(grid[sy][sx], lambertSpec(nx1, ny2, nz1))
    }
  }
  return grid
}

// ----- Helpers -----
function blendGrids(a: number[][], b: number[][], t: number): number[][] {
  const eased = easeInOutCubic(t)
  return a.map((row, y) => row.map((v, x) => v * (1 - eased) + (b[y]?.[x] ?? 0) * eased))
}

function renderGridToCanvas(
  ctx: CanvasRenderingContext2D, grid: number[][],
  cols: number, rows: number, cellW: number, cellH: number,
  hue: number
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  const primary = `hsl(${hue}, 100%, 60%)`
  const muted = `hsla(${hue + 40}, 40%, 60%, 1)`

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const b = grid[y][x]
      if (b < 0.01) continue
      const char = brightnessToChar(b)
      ctx.fillStyle = b > 0.5 ? primary : muted
      ctx.globalAlpha = 0.65 + b * 0.35
      const cx = x * cellW + cellW / 2, cy = y * cellH + cellH / 2
      ctx.fillText(char, cx, cy)
    }
  }
  ctx.globalAlpha = 1
}

// ----- Block letter ASCII map -----
// Simple 5x7 bitmap for key letters
const ASCII_GLYPH: Record<string, number[]> = {
  Y: [0b01000, 0b01000, 0b00100, 0b00010, 0b00001, 0b00010, 0b00100],
  K: [0b01000, 0b01001, 0b01010, 0b01100, 0b01010, 0b01001, 0b01000],
  H: [0b01000, 0b01000, 0b01110, 0b01010, 0b01010, 0b01110, 0b01000],
  A: [0b00100, 0b01010, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  S: [0b01110, 0b10001, 0b10000, 0b01110, 0b00001, 0b10001, 0b01110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  I: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
}

function renderAsciiName(
  grid: number[][], cols: number, rows: number,
  text: string, offsetX: number, offsetY: number, brightness: number
) {
  const glyphW = 7, glyphH = 7, spacing = 9
  let x0 = Math.round(cols * offsetX) - (text.length * spacing) / 2
  const y0 = Math.round(rows * offsetY) - glyphH / 2
  for (let ci = 0; ci < text.length; ci++) {
    const ch = text[ci].toUpperCase()
    const glyph = ASCII_GLYPH[ch]
    if (!glyph) continue
    for (let row = 0; row < glyphH; row++) {
      for (let col = 0; col < glyphW; col++) {
        if ((glyph[row] >> (glyphW - 1 - col)) & 1) {
          const gx = x0 + ci * spacing + col, gy = y0 + row
          if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
            grid[gy][gx] = Math.max(grid[gy][gx], brightness)
          }
        }
      }
    }
  }
}

// ==================== COMPONENT ====================

export function AsciiMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef(0)
  const animRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const scrollRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = Math.max(1, Math.floor(rect.width * dpr))
    const h = Math.max(1, Math.floor(rect.height * dpr))

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }

    const { cols, rows } = calcGrid(w, h)
    const cellW = w / cols, cellH = h / rows
    const cellSize = Math.min(cellW, cellH)
    const fontSize = Math.max(10, Math.floor(cellSize * 0.95))
    ctx.font = `${fontSize}px 'Geist Mono', 'JetBrains Mono', 'Consolas', monospace`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const mx = mouseRef.current.x
    const my = mouseRef.current.y
    gMouseX = mx
    gMouseY = my

    // Scroll decay
    gScrollSpeed *= 0.96
    gScrollDecay = gScrollSpeed

    const speedMul = 1 + Math.abs(gScrollSpeed) * 0.3 + 0.5 * (1 - Math.hypot(mx - 0.5, my - 0.5) * 2)

    const now = performance.now()
    if (startTimeRef.current === 0) startTimeRef.current = now
    const elapsed = now - startTimeRef.current
    const t = elapsed / 1000

    // Color cycling
    const hue = (t * 8 + (mx - 0.5) * 30) % 360

    const CYCLE_DURATION = 17500
    const phase = (elapsed % CYCLE_DURATION) / CYCLE_DURATION
    const pulse = 0.5 + 0.5 * Math.sin(t * 2)

    // Warp: mouse offset from center, affects node positions
    const warpX = (mx - 0.5) * 2, warpY = (my - 0.5) * 2

    // Star positions
    const starPoints: [number, number][] = []
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2 + (t * 0.2 + warpX * 0.1)
      const rad = 0.35 + warpY * 0.04
      starPoints.push([0.5 + rad * Math.cos(angle), 0.5 + rad * Math.sin(angle)])
    }
    starPoints.push([0.5, 0.5])

    // Scatter positions
    const cycleCount = Math.floor(elapsed / CYCLE_DURATION)
    const getScatter = (seed: number): [number, number][] => {
      const pos: [number, number][] = []
      for (let i = 0; i < 5; i++) {
        const baseAngle = (i / 5) * Math.PI * 2
        const randomOffset = (Math.sin(seed + i * 11) * 0.5 + 0.5) * 0.5
        const angle = baseAngle + randomOffset * 0.6 + warpX * 0.08
        const radius = 0.18 + (Math.cos(seed + i * 17) * 0.5 + 0.5) * 0.08 + warpY * 0.02
        pos.push([0.5 + radius * Math.cos(angle), 0.5 + radius * Math.sin(angle)])
      }
      pos.push([0.5, 0.5])
      return pos
    }
    const scatterPos = getScatter(cycleCount * 7)
    const nextScatter = getScatter((cycleCount + 1) * 7)

    let grid: number[][]

    const PH_NODES = 0.10
    const PH_SCATTER_TO_STAR = 0.24
    const PH_NODES_TO_STAR = 0.32
    const PH_STAR = 0.42
    const PH_STAR_TO_SQ = 0.52
    const PH_SQ = 0.62
    const PH_SQ_TO_CIRC = 0.72
    const PH_CIRC = 0.82

    const scrollPhase = phase + gScrollSpeed * 2

    if (phase < PH_NODES) {
      const floatPos = scatterPos.map((p, i) => [
        p[0] + Math.sin(t * 0.5 + i * 1.7) * 0.035 + warpX * 0.015,
        p[1] + Math.cos(t * 0.4 + i * 2.3) * 0.03 + warpY * 0.015,
      ] as [number, number])
      grid = nodesAndEdges(cols, rows, floatPos, pulse, warpX, warpY)
      renderAsciiName(grid, cols, rows, "YK", 0.5, 0.88, 0.45)
    } else if (phase < PH_SCATTER_TO_STAR) {
      const scatterT = (phase - PH_NODES) / (PH_SCATTER_TO_STAR - PH_NODES)
      const eased = easeInOutCubic(scatterT)
      const floatStr = 1 - eased
      const nodePos = scatterPos.map((start, i) => [
        start[0] + Math.sin(t * 0.5 + i * 1.7) * 0.035 * floatStr + (starPoints[i][0] - start[0]) * eased + warpX * 0.015,
        start[1] + Math.cos(t * 0.4 + i * 2.3) * 0.03 * floatStr + (starPoints[i][1] - start[1]) * eased + warpY * 0.015,
      ] as [number, number])
      grid = nodesAndEdges(cols, rows, nodePos, pulse, warpX, warpY)
    } else if (phase < PH_NODES_TO_STAR) {
      const morphT = (phase - PH_SCATTER_TO_STAR) / (PH_NODES_TO_STAR - PH_SCATTER_TO_STAR)
      const nodes = nodesAndEdges(cols, rows, starPoints, pulse, warpX, warpY)
      const star = starShape(cols, rows, t * 0.3, speedMul)
      grid = blendGrids(nodes, star, morphT)
    } else if (phase < PH_STAR) {
      grid = starShape(cols, rows, t * 0.3, speedMul)
    } else if (phase < PH_STAR_TO_SQ) {
      const morphT = (phase - PH_STAR) / (PH_STAR_TO_SQ - PH_STAR)
      const star = starShape(cols, rows, t * 0.3, speedMul)
      const sq = squareShape(cols, rows, t * 0.4, speedMul)
      grid = blendGrids(star, sq, morphT)
    } else if (phase < PH_SQ) {
      grid = squareShape(cols, rows, t * 0.4, speedMul)
    } else if (phase < PH_SQ_TO_CIRC) {
      const morphT = (phase - PH_SQ) / (PH_SQ_TO_CIRC - PH_SQ)
      const sq = squareShape(cols, rows, t * 0.4, speedMul)
      const circ = circleShape(cols, rows, t * 0.5, speedMul)
      grid = blendGrids(sq, circ, morphT)
    } else if (phase < PH_CIRC) {
      grid = circleShape(cols, rows, t * 0.5, speedMul)
    } else {
      const morphT = (phase - PH_CIRC) / (1 - PH_CIRC)
      const circ = circleShape(cols, rows, t * 0.5, speedMul)
      const floatStr = easeInOutCubic(morphT)
      const floatPos = nextScatter.map((p, i) => [
        p[0] + Math.sin(t * 0.5 + i * 1.7) * 0.035 * floatStr + warpX * 0.015,
        p[1] + Math.cos(t * 0.4 + i * 2.3) * 0.03 * floatStr + warpY * 0.015,
      ] as [number, number])
      const nodes = nodesAndEdges(cols, rows, floatPos, pulse, warpX, warpY)
      grid = blendGrids(circ, nodes, morphT)
    }

    renderGridToCanvas(ctx, grid, cols, rows, cellW, cellH, hue)
  }, [])

  useEffect(() => {
    startTimeRef.current = 0
    const tick = () => {
      draw()
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)

    // Mouse tracking
    const onMouse = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      mouseRef.current = {
        x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
        y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
      }
    }
    window.addEventListener("mousemove", onMouse)

    // Scroll tracking
    const onScroll = () => {
      const sy = window.scrollY || window.pageYOffset || 0
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      scrollRef.current = sy / maxScroll
      gScrollSpeed = Math.min(5, Math.abs(sy - (window as any).__lastScroll || 0) / 100)
      ;(window as any).__lastScroll = sy
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener("mousemove", onMouse)
      window.removeEventListener("scroll", onScroll)
    }
  }, [draw])

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: "pixelated" }}
        aria-hidden
      />
    </div>
  )
}
