import { Button, Card } from "@mui/material";
import { useRouter } from "next/router";

const BackButton = () => {
  const router = useRouter();

  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <Card sx={{ marginTop: "20px" }}>
      <Button
        variant="contained"
        sx={{ borderRadius: "4px", margin: "20px" }}
        size="medium"
        onClick={handleBackButtonClick}
      >
        Back
      </Button>
    </Card>
  );
};

export default BackButton;
