import {Global, css} from "@emotion/react";
import styled from "@emotion/styled";
import {useState} from "react";
import QRCode from "react-qr-code";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import SourceCodeProBold from "../../assets/SourceCodePro-Bold.ttf?url";

const genName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
    style: "capital",
    separator: " ",
  });

export default function StickerPage() {
  const [list] = useState(new Array(5 * 3).fill(1).map(() => genName()));
  return (
    <Page>
      <Global
        styles={css({
          body: {
            background: "white",
            color: "black",
          },
          "@page": {
            size: "A4",
            margin: 0,
            fontFamily: "SourceCodePro",
          },
          "@media print": {
            "html, body": {
              width: "210mm",
              height: "297mm",
            },
          },
          "@font-face": {
            fontFamily: "SourceCodePro",
            src: `url("${SourceCodeProBold}")`,
          },
        })}
      />
      {list.map(item => (
        <StickerContainer key={item}>
          <StickerNameContainer>
            <StickerName>{item}</StickerName>
          </StickerNameContainer>
          <StyledQrCode value={`davidhomeventory://${item}`} />
        </StickerContainer>
      ))}
    </Page>
  );
}
const StyledQrCode = styled(QRCode)({
  width: "40mm",
  height: "40mm",
  margin: "5mm 5mm 5mm 0",
});

// 2100x1510
const StickerContainer = styled("div")({
  width: "70mm",
  overflow: "auto",
  display: "flex",
  alignItems: "center",
});
const StickerNameContainer = styled("div")({
  display: "flex",
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
});
const StickerName = styled("div")({
  writingMode: "vertical-rl",
  textOrientation: "sideways",
  fontFamily: "SourceCodePro",
  fontSize: "5mm",
  padding: "6mm",
  maxHeight: "40mm",
  textAlign: "center",
  wordBreak: "break-word",
  hyphens: "auto",
});

// 6300x8910
const Page = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(5, 1fr)",
  gridColumnGap: "0px",
  gridRowGap: "0px",
  width: "210mm",
  height: "297mm",
  overflow: "auto",
});
