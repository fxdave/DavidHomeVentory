import {Global, css} from "@emotion/react";
import styled from "@emotion/styled";
import {useEffect, useRef, useState} from "react";
import QRCode from "react-qr-code";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import SourceCodeProBold from "../../assets/SourceCodePro-Bold.ttf?url";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {Add, Delete, Print} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {Navigation} from "modules/Common/Navigation";
import {Printer} from "@bcyesil/capacitor-plugin-printer";

const genName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
    style: "capital",
    separator: " ",
  });

const MARGIN_DIRECTIONS = ["top", "right", "bottom", "left"];

function formatAbsoluteLength(value: string): string | undefined {
  const pattern = new RegExp(/^\s*([0-9.])+\s*(cm|mm|Q|in|pt|pc|px)\s*/);
  const match = value.match(pattern);
  if (match) {
    return match[1] + match[2];
  }
}

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
      <Global
        styles={css({
          body: {
            color: "white",
            overflow: "auto",
          },
          "@media print": {
            "@page": {
              size: "a4 landscape",
              margin: 0,
              fontFamily: "SourceCodePro",
            },
            "html, body": {
              width: size[0],
              height: size[1],
            },
            form: {
              display: "none !important",
            },
          },
          "@font-face": {
            fontFamily: "SourceCodePro",
            src: `url("${SourceCodeProBold}")`,
          },
        })}
      />
      <Form>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Dashboard
        </Button>

        <Typography variant="h5" width="100%">
          Page Settings:
        </Typography>

        <TextField
          size="small"
          value={size[0]}
          label="Page width"
          error={formatAbsoluteLength(size[0]) === undefined}
          onChange={e => setSize([e.target.value, size[1]])}
        />
        <TextField
          size="small"
          value={size[1]}
          label="Page height"
          error={formatAbsoluteLength(size[1]) === undefined}
          onChange={e => setSize([size[0], e.target.value])}
        />
        <Separator />
        <TextField
          size="small"
          value={stickersPerRow}
          label="Stickers per row"
          onChange={e => setStickersPerRow(e.target.value)}
        />
        <TextField
          size="small"
          value={numRows}
          label="Number of rows"
          onChange={e => setNumRows(e.target.value)}
        />
        <Separator />
        {margins.map((margin, index) => (
          <TextField
            size="small"
            key={index}
            value={margin}
            label={`Margin ${MARGIN_DIRECTIONS[index]}`}
            error={formatAbsoluteLength(margin) === undefined}
            onChange={e => {
              setMargins([
                ...margins.slice(0, index),
                e.target.value,
                ...margins.slice(index + 1, 4),
              ]);
            }}
          />
        ))}
        <Typography variant="h5" width="100%">
          Stickers:
        </Typography>
        {list.map((item, index) => (
          <TextField
            size="small"
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setList(list.filter((_, idx) => idx !== index))
                    }>
                    <Delete />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ))}
        <IconButton
          disabled={settings.numRows * settings.stickersPerRow === list.length}
          onClick={() => setList([...list, genName()])}>
          <Add />
        </IconButton>

        <PreviewHeader>
          <Typography align="left" variant="h5" width="100%">
            Preview:
          </Typography>

          <Button
            variant="contained"
            onClick={() => print()}
            sx={{marginLeft: "auto"}}>
            <Print />
          </Button>
        </PreviewHeader>
      </Form>
      <PageContainer>
        {/** Inline styles are required for printing on mobile */}
        <Page
          ref={pageRef}
          previewScaleRatio={previewScaleRatio}
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
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </Container>
  );
}

const NavigationContainer = styled("div")({
  width: "100%",
  "@media print": {
    display: "none",
  },
});

const Separator = styled("div")({
  width: "100%",
});

const Container = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  padding: "0.5rem",
  alignItems: "flex-start",
  alignContent: "flex-start",
});

const Form = styled("form")({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  alignItems: "center",
  justifyContent: "stretch",
});

const QrCodeContainer = styled("div")({
  "@media print": {
    filter: "none",
  },
  "@media not print": {
    filter: "invert(1)",
  },
});

// 2100x1510
const StickerContainer = styled("div")({});

const StickerNameContainer = styled("div")({});
const StickerName = styled("div")({});

// 6300x8910
const Page = styled("div")<{
  previewScaleRatio: number;
}>(props => ({
  "@media print": {
    filter: "none",
    background: "none",
  },
  "@media not print": {
    filter: "invert(100%)",
    background: "#CFCFCF",
    transformOrigin: "top left",
    transform: `scale(${props.previewScaleRatio})`,
  },
}));
const PageContainer = styled("div")({
  "@media not print": {
    marginTop: "0.5rem",
    borderRadius: "0.5rem",
    border: "2px solid white",
    maxWidth: "calc(100vw - 1rem)",
    overflow: "auto",
  },
});

const PreviewHeader = styled("div")({
  display: "flex",
  width: "100%",
});
