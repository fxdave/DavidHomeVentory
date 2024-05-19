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
              width: "297mm",
              height: "210mm",
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
            onClick={() => window.print()}
            sx={{marginLeft: "auto"}}>
            <Print />
          </Button>
        </PreviewHeader>
      </Form>
      <PageContainer>
        <Page
          ref={pageRef}
          stickersPerRow={settings.stickersPerRow}
          numRows={settings.numRows}
          margin={margins}
          size={size}
          previewScaleRatio={previewScaleRatio}>
          {list.map(item => (
            <StickerContainer key={item}>
              <QrCodeContainer>
                <QRCode
                  value={`davidhomeventory://${item}`}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </QrCodeContainer>
              <StickerNameContainer>
                <StickerName>{item}</StickerName>
              </StickerNameContainer>
            </StickerContainer>
          ))}
        </Page>
      </PageContainer>
    </Container>
  );
}

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
  marginTop: "10cqw",
  width: "80cqw",
  height: "80cqw",
  filter: "invert(1)",
  "@media print": {
    filter: "none",
  },
});

// 2100x1510
const StickerContainer = styled("div")({
  containerType: "inline-size",
  contain: "strict",
  display: "flex",
  flexFlow: "column",
  alignItems: "center",
  boxShadow: "inset 0 0 0 0.5px #535353, 0 0 0 0.5px #535353",
  overflow: "hidden",

  "@media print": {
    border: "none",
  },
});

const StickerNameContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  textOverflow: "ellipsis",
});
const StickerName = styled("div")({
  fontFamily: "SourceCodePro",
  fontSize: "10cqw",
  padding: "5cqw 10cqw",
  textAlign: "center",
  wordBreak: "break-word",
  hyphens: "auto",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

// 6300x8910
const Page = styled("div")<{
  stickersPerRow: number;
  numRows: number;
  margin: string[];
  size: string[];
  previewScaleRatio: number;
}>(props => ({
  background: "#CFCFCF",
  boxSizing: "border-box",
  display: "grid",
  gridTemplateColumns: `repeat(${props.stickersPerRow}, 1fr)`,
  gridTemplateRows: `repeat(${props.numRows}, 1fr)`,
  gridColumnGap: "0px",
  gridRowGap: "0px",
  width: props.size[0],
  height: props.size[1],
  overflow: "hidden",
  paddingTop: props.margin[0],
  paddingRight: props.margin[1],
  paddingBottom: props.margin[2],
  paddingLeft: props.margin[3],
  filter: "invert(100%)",
  color: "black",

  "@media print": {
    filter: "none",
    background: "none",
    border: "none",
  },
  "@media not print": {
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
