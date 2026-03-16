import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OnLaw Office — Studio Ligjore, Av. Orjon Nallbati";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #1B3A5C 0%, #0F2440 100%)",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Gold accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #C4A35A, #D4B366, #C4A35A)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #C4A35A, #D4B366)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 800,
              color: "#1B3A5C",
            }}
          >
            OL
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#C4A35A",
              letterSpacing: "2px",
            }}
          >
            ONLAW OFFICE
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: "52px",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Studio Ligjore Profesionale
          </h1>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 400,
              color: "#C4A35A",
              margin: "16px 0 0 0",
            }}
          >
            Av. Orjon Nallbati
          </h2>
        </div>

        {/* Bottom info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)" }}>
              E Drejta Civile | Tregtare | Administrative | Kushtetuese
            </span>
            <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)" }}>
              Mbrojtja e te Dhenave Personale | DPO
            </span>
          </div>
          <span
            style={{
              fontSize: "20px",
              color: "#C4A35A",
              fontWeight: 600,
            }}
          >
            onlawoffice.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
