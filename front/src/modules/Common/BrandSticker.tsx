import {styled} from "styled-system/jsx";
import {QrCode} from "lucide-react";

/** The app's name printed on a box sticker, like the ones from the sticker page. */
export function BrandSticker({size = "small"}: {size?: "small" | "large"}) {
  return (
    <Sticker data-size={size}>
      <QrCode size={size === "large" ? 28 : 16} />
      HomeVentory
    </Sticker>
  );
}

const Sticker = styled("span", {
  base: {
    "--fold": "9px",
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "5px 14px 5px 7px",
    borderRadius: "3px",
    backgroundColor: "#efeee9",
    color: "#15171c",
    fontFamily: "label",
    fontSize: "15px",
    letterSpacing: "0.02em",
    lineHeight: 1.2,
    transform: "rotate(-2deg)",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
    // The top right corner is peeling off.
    clipPath:
      "polygon(0 0, calc(100% - var(--fold)) 0, 100% var(--fold), 100% 100%, 0 100%)",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      width: "var(--fold)",
      height: "var(--fold)",
      borderBottomLeftRadius: "2px",
      background: "linear-gradient(225deg, transparent 50%, #cfcdc6 50%)",
    },
    "&[data-size='large']": {
      "--fold": "14px",
      gap: "10px",
      padding: "8px 24px 8px 12px",
      fontSize: "26px",
    },
  },
});
