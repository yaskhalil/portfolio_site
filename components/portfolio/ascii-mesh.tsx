"use client"

import { useEffect, useRef, useCallback } from "react"

// ASCII charset ordered by brightness (dark to bright)
const ASCII_CHARS = " .'`^\":;+!?*#%@"

// Cycle: Nodes+Edges → Scatter→Star → Star→Square → Square→Circle → Circle→Nodes
const CYCLE_DURATION_MS = 17500

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function brightnessToChar(b: number): string {
  const idx = Math.floor(b * (ASCII_CHARS.length - 1))
  return ASCII_CHARS[Math.max(0, Math.min(idx, ASCII_CHARS.length - 1))]
}

// Draw a thick node (blob) at position
function addNode(grid: number[][], cols: number, rows: number, nx: number, ny: number, radius: number, brightness: number) {
  const r = Math.ceil(radius)
  const lightX = -0.62
  const lightY = -0.52
  const lightZ = 0.58
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const px = dx / radius
      const py = dy / (radius * 0.86)
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

// Draw thin edge between two nodes
function addEdge(grid: number[][], cols: number, rows: number, x1: number, y1: number, x2: number, y2: number, brightness: number) {
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

function addEdgeWide(
  grid: number[][],
  cols: number,
  rows: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  brightness: number,
  width: number
) {
  const vx = x2 - x1
  const vy = y2 - y1
  const mag = Math.hypot(vx, vy) || 1
  const nx = -vy / mag
  const ny = vx / mag
  const half = Math.max(1, Math.floor(width / 2))
  for (let d = -half; d <= half; d++) {
    const ox = (nx * d) / cols
    const oy = (ny * d) / rows
    const fade = 1 - Math.abs(d) / (half + 1)
    addEdge(grid, cols, rows, x1 + ox, y1 + oy, x2 + ox, y2 + oy, brightness * (0.82 + 0.18 * fade))
  }
}

// Nodes + edges: fixed star-topology graph for 6 nodes
function nodesAndEdges(cols: number, rows: number, nodePositions: [number, number][], pulse: number): number[][] {
  const grid: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(0))
  const nodeBrightness = 0.85 + 0.15 * pulse
  const edgeBrightness = 0.54 + 0.24 * pulse
  const nodeRadius = 0.07
  const n = nodePositions.length
  const centerIndex = n - 1
  const outerCount = Math.max(0, n - 1)

  // Add nodes with subtle depth cue: lower nodes are a touch brighter.
  for (let i = 0; i < n; i++) {
    const [nx, ny] = nodePositions[i]
    const depthBoost = 0.94 + ny * 0.18
    addNode(
      grid,
      cols,
      rows,
      nx,
      ny,
      nodeRadius * Math.min(cols, rows),
      Math.min(1, nodeBrightness * depthBoost)
    )
  }

  // "One outer node goes to the middle" + "middle connects to all outers":
  // this results in center-to-all spokes.
  for (let i = 0; i < outerCount; i++) {
    addEdge(
      grid,
      cols,
      rows,
      nodePositions[i][0],
      nodePositions[i][1],
      nodePositions[centerIndex][0],
      nodePositions[centerIndex][1],
      edgeBrightness
    )
  }

  // "Two outside nodes connect with each other" (pick a stable top pair).
  if (outerCount >= 2) {
    addEdge(
      grid,
      cols,
      rows,
      nodePositions[0][0],
      nodePositions[0][1],
      nodePositions[1][0],
      nodePositions[1][1],
      edgeBrightness * 0.95
    )
  }

  return grid
}

// Shared light direction for all 3D shapes
const LX = -0.52, LY = -0.58, LZ = 0.63
const LMAG = Math.hypot(LX, LY, LZ)

function lambertSpec(nx: number, ny: number, nz: number): number {
  const lambert = Math.max(0, (nx * LX + ny * LY + nz * LZ) / LMAG)
  const spec = Math.pow(lambert, 10) * 0.32
  const rim = Math.pow(Math.max(0, 1 - nz), 2.2) * 0.12
  return Math.min(1, 0.18 + lambert * 0.52 + spec + rim)
}

// Star: modulated torus with dual-axis 3D rotation (like the donut)
function starShape(cols: number, rows: number, rotation: number): number[][] {
  const grid: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(0))
  const cx = cols / 2
  const cy = rows / 2
  const baseR = Math.min(cols, rows) * 0.28
  const modulation = Math.min(cols, rows) * 0.10
  const tubeR = Math.min(cols, rows) * 0.075

  const A = rotation
  const B = rotation * 1.3
  const cosA = Math.cos(A), sinA = Math.sin(A)
  const cosB = Math.cos(B), sinB = Math.sin(B)

  const thetaSteps = 300
  const phiSteps = 60

  for (let ti = 0; ti < thetaSteps; ti++) {
    const theta = (ti / thetaSteps) * Math.PI * 2
    const cosT = Math.cos(theta)
    const sinT = Math.sin(theta)
    const R = baseR + modulation * Math.cos(5 * theta)

    for (let pi = 0; pi < phiSteps; pi++) {
      const phi = (pi / phiSteps) * Math.PI * 2
      const cosP = Math.cos(phi)
      const sinP = Math.sin(phi)

      const ox = (R + tubeR * cosP) * cosT
      const oy = (R + tubeR * cosP) * sinT
      const oz = tubeR * sinP

      const nx = cosP * cosT
      const ny = cosP * sinT
      const nz = sinP

      const py = oy * cosA - oz * sinA
      const ny1 = ny * cosA - nz * sinA
      const nz1 = ny * sinA + nz * cosA

      const px = ox * cosB - py * sinB
      const py2 = ox * sinB + py * cosB
      const nx1 = nx * cosB - ny1 * sinB
      const ny2 = nx * sinB + ny1 * cosB

      if (nz1 < 0) continue

      const sx = Math.round(cx + px)
      const sy = Math.round(cy + py2)
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

// 3D cube with filled faces + tube edges + vertex spheres
function squareShape(cols: number, rows: number, rotation: number): number[][] {
  const grid: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(0))
  const cx = cols / 2
  const cy = rows / 2
  const size = Math.min(cols, rows) * 0.19
  const cosR = Math.cos(rotation)
  const sinR = Math.sin(rotation)
  const tiltX = 0.48
  const cosTx = Math.cos(tiltX)
  const sinTx = Math.sin(tiltX)
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
    { idx: [0, 1, 2, 3], n: [0, 0, -1] },
    { idx: [5, 4, 7, 6], n: [0, 0, 1] },
    { idx: [4, 0, 3, 7], n: [-1, 0, 0] },
    { idx: [1, 5, 6, 2], n: [1, 0, 0] },
    { idx: [4, 5, 1, 0], n: [0, -1, 0] },
    { idx: [3, 2, 6, 7], n: [0, 1, 0] },
  ]

  for (const { idx, n } of faces) {
    const [rnx, rny, rnz] = transformNorm(n[0], n[1], n[2])
    if (rnz < 0.01) continue

    const brightness = lambertSpec(rnx, rny, rnz)

    const corners = idx.map(i => [projected[i][0], projected[i][1]])
    const xs = corners.map(c => c[0])
    const ys = corners.map(c => c[1])
    const minX = Math.max(0, Math.floor(Math.min(...xs)))
    const maxX = Math.min(cols - 1, Math.ceil(Math.max(...xs)))
    const minY = Math.max(0, Math.floor(Math.min(...ys)))
    const maxY = Math.min(rows - 1, Math.ceil(Math.max(...ys)))

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (pointInConvexQuad(x, y, corners)) {
          grid[y][x] = Math.max(grid[y][x], brightness)
        }
      }
    }
  }

  const edgeIdx: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ]

  for (const [i, j] of edgeIdx) {
    const [ax, ay] = rotated3D[i]
    const [bx, by] = rotated3D[j]
    const edx = bx - ax, edy = by - ay, edz = rotated3D[j][2] - rotated3D[i][2]
    const len = Math.hypot(edx, edy, edz) || 1
    const ex = edx / len, ey = edy / len, ez = edz / len

    let ux: number, uy: number, uz: number
    if (Math.abs(ez) < 0.9) {
      ux = ey; uy = -ex; uz = 0
    } else {
      ux = 0; uy = ez; uz = -ey
    }
    const umag = Math.hypot(ux, uy, uz) || 1
    ux /= umag; uy /= umag; uz /= umag

    const vx = ey * uz - ez * uy
    const vy = ez * ux - ex * uz
    const vz = ex * uy - ey * ux

    const lengthSteps = Math.max(30, Math.ceil(len * 2.5))
    const angleSteps = 16

    for (let li = 0; li <= lengthSteps; li++) {
      const lt = li / lengthSteps
      const pcx = ax + edx * lt
      const pcy = ay + edy * lt

      for (let ai = 0; ai < angleSteps; ai++) {
        const angle = (ai / angleSteps) * Math.PI * 2
        const cosAng = Math.cos(angle)
        const sinAng = Math.sin(angle)
        const tnx = cosAng * ux + sinAng * vx
        const tny = cosAng * uy + sinAng * vy
        const tnz = cosAng * uz + sinAng * vz
        if (tnz < 0) continue
        const sx = Math.round(cx + pcx + tubeR * tnx)
        const sy = Math.round(cy + pcy + tubeR * tny)
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
        const snx = Math.sin(phi) * Math.cos(theta)
        const sny = Math.sin(phi) * Math.sin(theta)
        const snz = Math.cos(phi)
        if (snz < 0) continue
        const sx = Math.round(cx + rx + tubeR * snx)
        const sy = Math.round(cy + ry + tubeR * sny)
        if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) continue
        grid[sy][sx] = Math.max(grid[sy][sx], lambertSpec(snx, sny, snz))
      }
    }
  }

  return grid
}

// Spinning torus via dual-axis rotation (donut.c technique)
function circleShape(cols: number, rows: number, rotation: number): number[][] {
  const grid: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(0))
  const cx = cols / 2
  const cy = rows / 2
  const R = Math.min(cols, rows) * 0.24
  const r = Math.min(cols, rows) * 0.095

  const A = rotation
  const B = rotation * 1.4
  const cosA = Math.cos(A), sinA = Math.sin(A)
  const cosB = Math.cos(B), sinB = Math.sin(B)

  const thetaSteps = 240
  const phiSteps = 80

  for (let ti = 0; ti < thetaSteps; ti++) {
    const theta = (ti / thetaSteps) * Math.PI * 2
    const cosT = Math.cos(theta)
    const sinT = Math.sin(theta)
    for (let pi = 0; pi < phiSteps; pi++) {
      const phi = (pi / phiSteps) * Math.PI * 2
      const cosP = Math.cos(phi)
      const sinP = Math.sin(phi)

      const ox = (R + r * cosP) * cosT
      const oy = (R + r * cosP) * sinT
      const oz = r * sinP

      let nx = cosP * cosT
      let ny = cosP * sinT
      let nz = sinP

      // Rotate around X by A
      const py = oy * cosA - oz * sinA
      const pz = oy * sinA + oz * cosA
      const ny1 = ny * cosA - nz * sinA
      const nz1 = ny * sinA + nz * cosA

      // Rotate around Z by B
      const px = ox * cosB - py * sinB
      const py2 = ox * sinB + py * cosB
      const nx1 = nx * cosB - ny1 * sinB
      const ny2 = nx * sinB + ny1 * cosB

      if (nz1 < 0) continue

      const sx = Math.round(cx + px)
      const sy = Math.round(cy + py2)
      if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) continue

      const brightness = lambertSpec(nx1, ny2, nz1)
      grid[sy][sx] = Math.max(grid[sy][sx], brightness)
    }
  }
  return grid
}

// Blend two grids
function blendGrids(a: number[][], b: number[][], t: number): number[][] {
  const eased = easeInOutCubic(t)
  return a.map((row, y) => row.map((v, x) => v * (1 - eased) + (b[y]?.[x] ?? 0) * eased))
}

function renderGridToCanvas(
  ctx: CanvasRenderingContext2D,
  grid: number[][],
  cols: number,
  rows: number,
  cellW: number,
  cellH: number,
  primaryColor: string,
  mutedColor: string
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const b = grid[y][x]
      const char = brightnessToChar(b)
      ctx.fillStyle = b > 0.5 ? primaryColor : mutedColor
      ctx.globalAlpha = 0.65 + b * 0.35
      const centerX = x * cellW + cellW / 2
      const centerY = y * cellH + cellH / 2
      ctx.fillText(char, centerX, centerY)
    }
  }
  ctx.globalAlpha = 1
}

export function AsciiMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const startTimeRef = useRef<number>(0)
  const animationRef = useRef<number | null>(null)

  const cols = 80
  const rows = 40

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = Math.max(1, Math.floor(rect.width * dpr))
    const h = Math.max(1, Math.floor(rect.height * dpr))

    if (rect.width === 0 || rect.height === 0) return

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }

    const cellW = w / cols
    const cellH = h / rows
    const cellSize = Math.min(cellW, cellH)
    const fontSize = Math.max(10, Math.floor(cellSize * 0.95))
    ctx.font = `${fontSize}px 'Geist Mono', 'JetBrains Mono', 'Consolas', monospace`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const primaryColor = "rgb(0, 255, 229)"
    const mutedColor = "rgba(138, 155, 174, 1)"

    const now = performance.now()
    if (startTimeRef.current === 0) startTimeRef.current = now
    const elapsed = now - startTimeRef.current
    const phase = (elapsed % CYCLE_DURATION_MS) / CYCLE_DURATION_MS

    const t = elapsed / 1000
    const pulse = 0.5 + 0.5 * Math.sin(t * 2)

    // Star point positions (normalized 0-1)
    const starPoints: [number, number][] = []
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2 + (t * 0.2)
      starPoints.push([0.5 + 0.35 * Math.cos(angle), 0.5 + 0.35 * Math.sin(angle)])
    }
    starPoints.push([0.5, 0.5])

    // Scatter: random but non-overlapping positions (each node on its own ray)
    const cycleCount = Math.floor(elapsed / CYCLE_DURATION_MS)
    const getScatterPositions = (seed: number): [number, number][] => {
      const positions: [number, number][] = []
      for (let i = 0; i < 5; i++) {
        const baseAngle = (i / 5) * Math.PI * 2
        const randomOffset = (Math.sin(seed + i * 11) * 0.5 + 0.5) * 0.5
        const angle = baseAngle + randomOffset * 0.6
        const radius = 0.18 + (Math.cos(seed + i * 17) * 0.5 + 0.5) * 0.08
        positions.push([0.5 + radius * Math.cos(angle), 0.5 + radius * Math.sin(angle)])
      }
      positions.push([0.5, 0.5])
      return positions
    }
    const scatterPositions = getScatterPositions(cycleCount * 7)
    const nextScatterPositions = getScatterPositions((cycleCount + 1) * 7)

    let grid: number[][]

    const phaseNodesHold = 0.10
    const phaseScatterToStar = 0.24
    const phaseNodesToStar = 0.32
    const phaseStarHold = 0.42
    const phaseStarToSquare = 0.52
    const phaseSquareHold = 0.62
    const phaseSquareToCircle = 0.72
    const phaseCircleHold = 0.82

    if (phase < phaseNodesHold) {
      const floatPositions: [number, number][] = scatterPositions.map((pos, i) => [
        pos[0] + Math.sin(t * 0.5 + i * 1.7) * 0.035,
        pos[1] + Math.cos(t * 0.4 + i * 2.3) * 0.03,
      ])
      grid = nodesAndEdges(cols, rows, floatPositions, pulse)
    } else if (phase < phaseScatterToStar) {
      const scatterT = (phase - phaseNodesHold) / (phaseScatterToStar - phaseNodesHold)
      const easedScatter = easeInOutCubic(scatterT)
      const floatStrength = 1 - easedScatter
      const nodePositions: [number, number][] = scatterPositions.map((start, i) => {
        const fx = Math.sin(t * 0.5 + i * 1.7) * 0.035 * floatStrength
        const fy = Math.cos(t * 0.4 + i * 2.3) * 0.03 * floatStrength
        return [
          start[0] + fx + (starPoints[i][0] - start[0]) * easedScatter,
          start[1] + fy + (starPoints[i][1] - start[1]) * easedScatter,
        ]
      })
      grid = nodesAndEdges(cols, rows, nodePositions, pulse)
    } else if (phase < phaseNodesToStar) {
      // Nodes → Star morph: blend from nodes at star positions into the round star shape
      const morphT = (phase - phaseScatterToStar) / (phaseNodesToStar - phaseScatterToStar)
      const nodesAtStar = nodesAndEdges(cols, rows, starPoints, pulse)
      const star = starShape(cols, rows, t * 0.3)
      grid = blendGrids(nodesAtStar, star, morphT)
    } else if (phase < phaseStarHold) {
      // Star held
      grid = starShape(cols, rows, t * 0.3)
    } else if (phase < phaseStarToSquare) {
      // Star → Square
      const morphT = (phase - phaseStarHold) / (phaseStarToSquare - phaseStarHold)
      const star = starShape(cols, rows, t * 0.3)
      const square = squareShape(cols, rows, t * 0.4)
      grid = blendGrids(star, square, morphT)
    } else if (phase < phaseSquareHold) {
      // Square held
      grid = squareShape(cols, rows, t * 0.4)
    } else if (phase < phaseSquareToCircle) {
      // Square → Circle
      const morphT = (phase - phaseSquareHold) / (phaseSquareToCircle - phaseSquareHold)
      const square = squareShape(cols, rows, t * 0.4)
      const circle = circleShape(cols, rows, t * 0.5)
      grid = blendGrids(square, circle, morphT)
    } else if (phase < phaseCircleHold) {
      // Circle held
      grid = circleShape(cols, rows, t * 0.5)
    } else {
      const morphT = (phase - phaseCircleHold) / (1 - phaseCircleHold)
      const circle = circleShape(cols, rows, t * 0.5)
      const floatStrength = easeInOutCubic(morphT)
      const floatPositions: [number, number][] = nextScatterPositions.map((pos, i) => [
        pos[0] + Math.sin(t * 0.5 + i * 1.7) * 0.035 * floatStrength,
        pos[1] + Math.cos(t * 0.4 + i * 2.3) * 0.03 * floatStrength,
      ])
      const nodes = nodesAndEdges(cols, rows, floatPositions, pulse)
      grid = blendGrids(circle, nodes, morphT)
    }

    renderGridToCanvas(ctx, grid, cols, rows, cellW, cellH, primaryColor, mutedColor)
  }, [])

  useEffect(() => {
    startTimeRef.current = 0
    const tick = () => {
      draw()
      animationRef.current = requestAnimationFrame(tick)
    }
    animationRef.current = requestAnimationFrame(tick)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [draw])

  return (
    <div className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: "pixelated" }}
        aria-hidden
      />
    </div>
  )
}
