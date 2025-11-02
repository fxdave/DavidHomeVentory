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
      "Unable to access camera. Please ensure camera permissions are granted.",
    );
  };

  return (
    <Container>
      <Navigation />
      <ContentWrapper>
        <Header>
          <Title>QR Code Scanner</Title>
        </Header>

        <ScannerWrapper>
          <Scanner
            onScan={handleScan}
            onError={handleError}
            styles={{
              container: {
                width: "100%",
                margin: "0 auto",
              },
            }}
          />
        </ScannerWrapper>

        {error && <StyledAlert severity="error">{error}</StyledAlert>}

        {scannedData && (
          <ResultPaper>
            <ResultTitle>Scanned Result:</ResultTitle>
            <ResultText>{scannedData}</ResultText>
            {scannedData.startsWith("davidhomeventory://") && (
              <ItemInfo>
                HomeVentory Item:{" "}
                {scannedData.replace("davidhomeventory://", "")}
              </ItemInfo>
            )}
          </ResultPaper>
        )}

        <InstructionsBox>
          <InstructionText>
            Point your camera at a QR code to scan it. If scanning a HomeVentory
            box sticker, it will automatically detect and display the item
            information.
          </InstructionText>
        </InstructionsBox>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled("div", {
  base: {
    overflow: "auto",
    height: "100vh",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px",
    width: "100%",
    "@media (max-width: 600px)": {
      padding: "8px",
    },
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    paddingBottom: "2rem",
    "@media (max-width: 600px)": {
      gap: "0.5rem",
      paddingBottom: "1rem",
    },
  },
});

const Header = styled("div", {
  base: {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    "@media (max-width: 600px)": {
      padding: "0 0.25rem",
    },
  },
});

const Title = styled("h4", {
  base: {
    fontSize: "2.125rem",
    margin: "1rem 0",
    color: "#fff",
    fontWeight: 400,
    "@media (max-width: 600px)": {
      fontSize: "1.5rem",
      margin: "0.5rem 0",
    },
  },
});

const ScannerWrapper = styled("div", {
  base: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    "@media (max-width: 600px)": {
      maxWidth: "95vw",
      borderRadius: "4px",
    },
  },
});

const StyledAlert = styled(Alert, {
  base: {
    marginTop: "1rem",
    maxWidth: "500px",
    width: "100%",
    fontSize: "1rem",
    "@media (max-width: 600px)": {
      marginTop: "0.5rem",
      maxWidth: "95vw",
      fontSize: "0.875rem",
    },
  },
});

const ResultPaper = styled("div", {
  base: {
    padding: "1rem",
    marginTop: "1rem",
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#2c2c2c",
    color: "white",
    borderRadius: "4px",
    border: "1px solid #333",
    "@media (max-width: 600px)": {
      maxWidth: "95vw",
      padding: "0.75rem",
      marginTop: "0.5rem",
    },
  },
});

const ResultTitle = styled("h6", {
  base: {
    fontSize: "1.25rem",
    margin: "0 0 8px 0",
    fontWeight: 500,
    "@media (max-width: 600px)": {
      fontSize: "1rem",
    },
  },
});

const ResultText = styled("p", {
  base: {
    fontSize: "1rem",
    margin: 0,
    wordBreak: "break-all",
    "@media (max-width: 600px)": {
      fontSize: "0.875rem",
    },
  },
});

const ItemInfo = styled("p", {
  base: {
    fontSize: "0.875rem",
    margin: "1rem 0 0 0",
    color: "#90caf9",
    "@media (max-width: 600px)": {
      fontSize: "0.75rem",
      marginTop: "0.5rem",
    },
  },
});

const InstructionsBox = styled("div", {
  base: {
    marginTop: "1rem",
    padding: "1rem",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    "@media (max-width: 600px)": {
      maxWidth: "95vw",
      padding: "0.75rem",
      marginTop: "0.5rem",
    },
  },
});

const InstructionText = styled("p", {
  base: {
    fontSize: "0.875rem",
    margin: 0,
    color: "#b0b0b0",
    "@media (max-width: 600px)": {
      fontSize: "0.75rem",
    },
  },
});
