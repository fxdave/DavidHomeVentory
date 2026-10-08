/* eslint-disable sonarjs/no-duplicate-string */
import {styled} from "styled-system/jsx";
import {useNavigate} from "react-router-dom";
import {Navigation} from "modules/Common/Navigation";
import {Scanner} from "@yudiel/react-qr-scanner";
import {useState} from "react";
import {Alert} from "@ui/Alert";

export default function QRScannerPage() {
  const navigate = useNavigate();
  const [scannedData, setScannedData] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleScan = (result: Array<{rawValue: string}>) => {
    if (result && result.length > 0) {
      const data = result[0].rawValue;
      setScannedData(data);
      setError("");

      // Check if it's a HomeVentory QR code
      if (data.startsWith("davidhomeventory://")) {
        const boxId = data.replace("davidhomeventory://", "");
        // Navigate to the item
        navigate(`/open-item/${boxId}`);
      }
    }
  };

  const handleError = (err: unknown) => {
    console.error("QR Scanner Error:", err);
    setError(
      "The camera isn't available. Allow camera access for this app and try again.",
    );
  };

  const isSticker = scannedData.startsWith("davidhomeventory://");

  return (
    <Container>
      <Navigation />
      <Title>Scan a box</Title>
      <ScannerWrapper>
        <Scanner
          onScan={handleScan}
          onError={handleError}
          styles={{container: {width: "100%"}}}
        />
      </ScannerWrapper>
      {error && <Alert severity="error">{error}</Alert>}
      {scannedData && !isSticker && (
        <Alert severity="warning">
          This QR code isn't a HomeVentory sticker: <Code>{scannedData}</Code>
        </Alert>
      )}
      <Hint>
        Point the camera at a box sticker. The box opens as soon as it's
        recognised.
      </Hint>
    </Container>
  );
}

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflow: "auto",
    height: "100vh",
    maxWidth: "520px",
    margin: "0 auto",
    padding: "0 16px 32px",
    width: "100%",
  },
});

const Title = styled("h2", {
  base: {
    margin: "12px 0 0",
    fontSize: "22px",
    fontWeight: 700,
  },
});

const ScannerWrapper = styled("div", {
  base: {
    width: "100%",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid token(colors.border)",
    backgroundColor: "paper",
  },
});

const Code = styled("span", {
  base: {
    overflowWrap: "anywhere",
    color: "text.secondary",
  },
});

const Hint = styled("p", {
  base: {
    margin: 0,
    color: "text.secondary",
  },
});
