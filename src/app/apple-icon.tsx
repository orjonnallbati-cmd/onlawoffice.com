import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1C1C21 0%, #0D0D10 100%)",
          borderRadius: "32px",
        }}
      >
        <span
          style={{
            fontSize: "90px",
            fontWeight: 800,
            letterSpacing: "-4px",
            display: "flex",
          }}
        >
          <span style={{ color: "#B85F6D" }}>O</span>
          <span style={{ color: "#FFFFFF" }}>L</span>
        </span>
        <span
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#B85F6D",
            letterSpacing: "6px",
            marginTop: "-4px",
            opacity: 0.8,
          }}
        >
          OFFICE
        </span>
      </div>
    ),
    { ...size }
  );
}
