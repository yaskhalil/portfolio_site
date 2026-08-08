import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Yaseen Khalil — Computational Modeler & ML Systems Architect"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0E17",
          color: "#F0F0F0",
          fontFamily: "monospace",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#8A9BAE" }}>$ cat ./about.txt</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -2,
            }}
          >
            <span style={{ color: "#00FFE5" }}>[</span>
            <span>Yaseen Khalil</span>
            <span style={{ color: "#00FFE5" }}>]</span>
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#8A9BAE", marginTop: 20 }}>
            Computational Modeler &amp; ML Systems Architect
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#4ADE80",
          }}
        >
          <span>yaseenkhalil.com</span>
          <span style={{ color: "#8A9BAE" }}>// precision data brutalism</span>
        </div>
      </div>
    ),
    size,
  )
}
