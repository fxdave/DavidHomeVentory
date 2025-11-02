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
import {useNavigate} from "react-router-dom";
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
  const [list, setList] = useState(
    new Array(5 * 3).fill(1).map(() => genName()),
  );
  const settings = {
    numRows: parseInt(numRows),
    stickersPerRow: parseInt(stickersPerRow),
  };
  const navigate = useNavigate();

  useEffect(() => {
    const listener = () => {
      if (!pageRef.current) return;
      const ratio =
        window.document.body.clientWidth / pageRef.current.clientWidth;
      setPreviewScaleRatio(Math.min(1, ratio));
    };
    listener();
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

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
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
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
      <Form>
        <Button onClick={() => navigate("/")}>Dashboard</Button>

        <SectionTitle>Page Settings:</SectionTitle>

        <TextField
          value={size[0]}
          label="Page width"
          onChange={e => setSize([e.target.value, size[1]])}
        />
        <TextField
          value={size[1]}
          label="Page height"
          onChange={e => setSize([size[0], e.target.value])}
        />
        <Separator />
        <TextField
          value={stickersPerRow}
          label="Stickers per row"
          onChange={e => setStickersPerRow(e.target.value)}
        />
        <TextField
          value={numRows}
          label="Number of rows"
          onChange={e => setNumRows(e.target.value)}
        />
        <Separator />
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
        <SectionTitle>Stickers:</SectionTitle>
        {list.map((item, index) => (
          <TextField
            key={index}
            placeholder="Something"
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
                onClick={() => setList(list.filter((_, idx) => idx !== index))}
                aria-label="Remove sticker">
                <Trash2 size={20} />
              </IconButton>
            }
          />
        ))}
        <IconButton
          disabled={settings.numRows * settings.stickersPerRow === list.length}
          onClick={() => setList([...list, genName()])}
          aria-label="Add new sticker">
          <Plus size={20} />
        </IconButton>

        <PreviewHeader>
          <SectionTitle>Preview:</SectionTitle>

          <PrintButton onClick={() => print()} aria-label="Print stickers">
            <PrinterIcon size={20} />
          </PrintButton>
        </PreviewHeader>
      </Form>
      <PageContainer>
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

const NavigationContainer = styled("div", {
  base: {
    width: "100%",
    "@media print": {
      display: "none",
    },
  },
});

const Separator = styled("div", {
  base: {
    width: "100%",
  },
});

const Container = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    padding: "0.5rem",
    alignItems: "flex-start",
    alignContent: "flex-start",
    "@media (max-width: 600px)": {
      padding: "0.25rem",
    },
  },
});

const Form = styled("form", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    alignItems: "center",
    justifyContent: "stretch",
    width: "100%",
    "@media (max-width: 600px)": {
      gap: "0.25rem",
    },
  },
});

const SectionTitle = styled("h5", {
  base: {
    fontSize: "1.5rem",
    width: "100%",
    margin: 0,
    color: "#fff",
  },
});

const PrintButton = styled(Button, {
  base: {
    marginLeft: "auto",
  },
});

const QrCodeContainer = styled("div", {
  base: {
    "@media print": {
      filter: "none",
    },
    "@media not print": {
      filter: "invert(1)",
    },
  },
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
      filter: "invert(100%)",
      background: "#CFCFCF",
      transformOrigin: "top left",
    },
  },
});

const PageContainer = styled("div", {
  base: {
    "@media not print": {
      marginTop: "0.5rem",
      borderRadius: "0.5rem",
      border: "2px solid white",
      maxWidth: "calc(100vw - 1rem)",
      overflow: "auto",
    },
  },
});

const PreviewHeader = styled("div", {
  base: {
    display: "flex",
    width: "100%",
  },
});
