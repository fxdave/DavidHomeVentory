import {styled} from "styled-system/jsx";
import {useEffect, useRef, useState} from "react";
import QRCode from "react-qr-code";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import SourceCodeProBold from "../../assets/SourceCodePro-Bold.ttf?url";
import {Plus, Trash2, Printer as PrinterIcon} from "lucide-react";
import {Navigation} from "modules/Common/Navigation";
import {Printer} from "@bcyesil/capacitor-plugin-printer";
import {Button, IconButton} from "@ui/Button";
import {TextField} from "@ui/Input";

const genName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
    style: "capital",
    separator: " ",
  });

const MARGIN_DIRECTIONS = ["top", "right", "bottom", "left"];

export default function StickerPage() {
  const [stickersPerRow, setStickersPerRow] = useState("5");
  const [numRows, setNumRows] = useState("3");
  const [margins, setMargins] = useState(["0mm", "22.66mm", "0mm", "22.66mm"]);
  const [size, setSize] = useState(["297mm", "210mm"]);
  const pageRef = useRef<HTMLDivElement>(null);
  const [previewScaleRatio, setPreviewScaleRatio] = useState(1);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const [list, setList] = useState(
    new Array(5 * 3).fill(1).map(() => genName()),
  );
  const settings = {
    numRows: parseInt(numRows),
    stickersPerRow: parseInt(stickersPerRow),
  };

  useEffect(() => {
    const listener = () => {
      const page = pageRef.current;
      const frame = page?.parentElement;
      if (!page || !frame) return;
      // Fit the sheet into its frame; offset sizes ignore the scale transform.
      const ratio = Math.min(1, frame.clientWidth / page.offsetWidth);
      setPreviewScaleRatio(ratio);
      setPreviewHeight(page.offsetHeight * ratio);
    };
    listener();
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [size]);

  function print() {
    const page = pageRef.current;
    if (!page) return;

    // For browsers:
    window.print();

    // For phone:
    Printer.print({
      name: "HomveVentory Stickers",
      orientation: "landscape",
      content: `<!DOCTYPE html>
      <html>
      <head>
      <style>
      @page {
        size: a4 landscape;
        margin: 0;
        font-family: SourceCodePro;
      },
      html, body {
        width: ${size[0]},
        height: ${size[1]},
      }
      </style>
      </head>
      <body>
        ${page.outerHTML}
      </body>
      </html>
      `,
    })
      .then(() => {
        console.log("all fine");
      })
      .catch(e => {
        console.error(e);
      });
  }

  return (
    <Container>
      <Navigation />
      <style>
        {`
          @font-face {
            font-family: "SourceCodePro";
            src: url("${SourceCodeProBold}");
          }
          @media print {
            @page {
              size: a4 landscape;
              margin: 0;
              font-family: SourceCodePro;
            }
            html, body {
              width: ${size[0]};
              height: ${size[1]};
            }
            form {
              display: none !important;
            }
          }
        `}
      </style>
      <Form onSubmit={e => e.preventDefault()}>
        <TitleRow>
          <Title>Print stickers</Title>
          <Button type="button" onClick={() => print()}>
            <PrinterIcon size={18} /> Print
          </Button>
        </TitleRow>

        <Section>
          <SectionTitle>Sheet</SectionTitle>
          <FieldGrid>
            <TextField
              value={size[0]}
              label="Width"
              onChange={e => setSize([e.target.value, size[1]])}
            />
            <TextField
              value={size[1]}
              label="Height"
              onChange={e => setSize([size[0], e.target.value])}
            />
            <TextField
              value={stickersPerRow}
              label="Per row"
              inputMode="numeric"
              onChange={e => setStickersPerRow(e.target.value)}
            />
            <TextField
              value={numRows}
              label="Rows"
              inputMode="numeric"
              onChange={e => setNumRows(e.target.value)}
            />
            {margins.map((margin, index) => (
              <TextField
                key={index}
                value={margin}
                label={`Margin ${MARGIN_DIRECTIONS[index]}`}
                onChange={e => {
                  setMargins([
                    ...margins.slice(0, index),
                    e.target.value,
                    ...margins.slice(index + 1, 4),
                  ]);
                }}
              />
            ))}
          </FieldGrid>
        </Section>

        <Section>
          <SectionTitle>Names</SectionTitle>
          <Hint>
            Each name becomes a box the first time its sticker is scanned.
          </Hint>
          <NameGrid>
            {list.map((item, index) => (
              <TextField
                key={index}
                aria-label={`Sticker ${index + 1}`}
                placeholder="Sticker name"
                value={item}
                onChange={e => {
                  setList([
                    ...list.slice(0, index),
                    e.target.value,
                    ...list.slice(index + 1, list.length),
                  ]);
                }}
                endAdornment={
                  <IconButton
                    type="button"
                    onClick={() =>
                      setList(list.filter((_, idx) => idx !== index))
                    }
                    aria-label="Remove sticker">
                    <Trash2 size={16} />
                  </IconButton>
                }
              />
            ))}
            <Button
              type="button"
              variant="outlined"
              disabled={
                settings.numRows * settings.stickersPerRow === list.length
              }
              onClick={() => setList([...list, genName()])}>
              <Plus size={18} /> Add sticker
            </Button>
          </NameGrid>
        </Section>

        <SectionTitle>Preview</SectionTitle>
      </Form>
      <PageContainer
        style={
          previewHeight === null
            ? {}
            : {["--preview-height" as string]: `${previewHeight}px`}
        }>
        {/** Inline styles are required for printing on mobile */}
        <Page
          ref={pageRef}
          style={{
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: `repeat(${stickersPerRow}, 1fr)`,
            gridTemplateRows: `repeat(${numRows}, 1fr)`,
            gridColumnGap: "0px",
            gridRowGap: "0px",
            width: size[0],
            height: size[1],
            overflow: "hidden",
            paddingTop: margins[0],
            paddingRight: margins[1],
            paddingBottom: margins[2],
            paddingLeft: margins[3],
            color: "black",
            transform: `scale(${previewScaleRatio})`,
          }}>
          {list.map(item => (
            <StickerContainer
              key={item}
              style={{
                containerType: "inline-size",
                contain: "strict",
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
                boxShadow: "inset 0 0 0 0.5px #535353, 0 0 0 0.5px #535353",
                overflow: "hidden",
              }}>
              <QrCodeContainer
                style={{
                  marginTop: "10cqw",
                  width: "80cqw",
                  height: "80cqw",
                }}>
                <QRCode
                  value={`davidhomeventory://${item}`}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </QrCodeContainer>
              <StickerNameContainer
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                <StickerName
                  style={{
                    fontFamily: "SourceCodePro",
                    fontSize: "10cqw",
                    padding: "5cqw 10cqw",
                    textAlign: "center",
                    wordBreak: "break-word",
                    hyphens: "auto",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {item}
                </StickerName>
              </StickerNameContainer>
            </StickerContainer>
          ))}
        </Page>
      </PageContainer>
    </Container>
  );
}

const Container = styled("div", {
  base: {
    width: "100%",
    minWidth: 0,
    maxWidth: "960px",
    margin: "0 auto",
    padding: "0 16px 32px",
    "@media print": {padding: 0, maxWidth: "none"},
  },
});

const Form = styled("form", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    paddingTop: "12px",
  },
});

const TitleRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
});

const Title = styled("h2", {
  base: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
  },
});

const Section = styled("section", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
});

const SectionTitle = styled("h3", {
  base: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 700,
    color: "text.primary",
  },
});

const Hint = styled("p", {
  base: {
    margin: 0,
    color: "text.secondary",
  },
});

const FieldGrid = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))",
    gap: "12px",
  },
});

const NameGrid = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "8px",
  },
});

const QrCodeContainer = styled("div", {
  base: {},
});

const StickerContainer = styled("div", {
  base: {},
});

const StickerNameContainer = styled("div", {
  base: {},
});

const StickerName = styled("div", {
  base: {},
});

const Page = styled("div", {
  base: {
    "@media print": {
      filter: "none",
      background: "none",
    },
    "@media not print": {
      background: "white",
      transformOrigin: "top left",
    },
  },
});

const PageContainer = styled("div", {
  base: {
    "@media not print": {
      marginTop: "10px",
      borderRadius: "8px",
      overflow: "hidden",
      height: "var(--preview-height, auto)",
    },
  },
});
