import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1B3A5C 0%, #0F2440 100%)",
          borderRadius: "6px",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: 800,
            letterSpacing: "-1px",
            display: "flex",
          }}
        >
          <span style={{ color: "#C4A35A" }}>O</span>
          <span style={{ color: "#FFFFFF" }}>L</span>
        </span>
      </div>
    ),
    { ...size }
  );
}
