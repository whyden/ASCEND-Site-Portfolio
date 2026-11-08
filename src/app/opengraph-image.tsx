import { ImageResponse } from "next/og";
import { MARK } from "@/lib/logo";

export const alt = "ASCEND STUDIO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Preview picture for links in messengers.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="520" height="309" viewBox={`0 0 ${MARK.width} ${MARK.height}`} fill="#E8E8E6">
          <path d={MARK.long} />
          <path d={MARK.small} />
        </svg>
      </div>
    ),
    size,
  );
}
