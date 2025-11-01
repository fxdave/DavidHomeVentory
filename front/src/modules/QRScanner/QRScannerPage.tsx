/* eslint-disable sonarjs/no-duplicate-string */
import styled from "@emotion/styled";
import {Button, Typography, Paper, Alert} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {Navigation} from "modules/Common/Navigation";
import {Scanner} from "@yudiel/react-qr-scanner";
import {useState} from "react";

export default function QRScannerPage() {
  const navigate = useNavigate();
  const [scannedData, setScannedData] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleScan = (result: any) => {
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

  const handleError = (err: any) => {
    console.error("QR Scanner Error:", err);
    setError(
      "Unable to access camera. Please ensure camera permissions are granted.",
    );
  };

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{
              fontSize: {xs: "0.75rem", sm: "0.875rem"},
              padding: {xs: "0.4rem 0.8rem", sm: "0.5rem 1rem"},
            }}>
            Dashboard
          </Button>
          <Typography
            variant="h4"
            sx={{
              marginTop: {xs: "0.5rem", sm: "1rem"},
              marginBottom: {xs: "0.5rem", sm: "1rem"},
              fontSize: {xs: "1.5rem", sm: "2.125rem"},
            }}>
            QR Code Scanner
          </Typography>
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

        {error && (
          <Alert
            severity="error"
            sx={{
              marginTop: {xs: "0.5rem", sm: "1rem"},
              maxWidth: {xs: "95vw", sm: "500px"},
              width: "100%",
              fontSize: {xs: "0.875rem", sm: "1rem"},
            }}>
            {error}
          </Alert>
        )}

        {scannedData && (
          <ResultPaper elevation={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{fontSize: {xs: "1rem", sm: "1.25rem"}}}>
              Scanned Result:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-all",
                fontSize: {xs: "0.875rem", sm: "1rem"},
              }}>
              {scannedData}
            </Typography>
            {scannedData.startsWith("davidhomeventory://") && (
              <Typography
                variant="body2"
                color="primary"
                sx={{
                  marginTop: {xs: "0.5rem", sm: "1rem"},
                  fontSize: {xs: "0.75rem", sm: "0.875rem"},
                }}>
                HomeVentory Item:{" "}
                {scannedData.replace("davidhomeventory://", "")}
              </Typography>
            )}
          </ResultPaper>
        )}

        <InstructionsBox>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>
            Point your camera at a QR code to scan it. If scanning a HomeVentory
            box sticker, it will automatically detect and display the item
            information.
          </Typography>
        </InstructionsBox>
      </ContentWrapper>

      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </Container>
  );
}

const Container = styled("div")(({theme}: any) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  padding: "0.5rem",
  color: "white",
  "@media (max-width: 600px)": {
    padding: "0.25rem",
  },
}));

const ContentWrapper = styled("div")(({theme}: any) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  paddingBottom: "2rem",
  "@media (max-width: 600px)": {
    gap: "0.5rem",
    paddingBottom: "1rem",
  },
}));

const Header = styled("div")(({theme}: any) => ({
  width: "100%",
  maxWidth: "500px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  "@media (max-width: 600px)": {
    padding: "0 0.25rem",
  },
}));

const ScannerWrapper = styled("div")(({theme}: any) => ({
  width: "100%",
  maxWidth: "500px",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  "@media (max-width: 600px)": {
    maxWidth: "95vw",
    borderRadius: "4px",
  },
}));

const ResultPaper = styled(Paper)(({theme}: any) => ({
  padding: "1rem",
  marginTop: "1rem",
  width: "100%",
  maxWidth: "500px",
  backgroundColor: "#2c2c2c",
  color: "white",
  "@media (max-width: 600px)": {
    maxWidth: "95vw",
    padding: "0.75rem",
    marginTop: "0.5rem",
  },
}));

const InstructionsBox = styled("div")(({theme}: any) => ({
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
}));

const NavigationContainer = styled("div")(({theme}: any) => ({
  width: "100%",
  marginTop: "2rem",
  "@media (max-width: 600px)": {
    marginTop: "1rem",
  },
}));
