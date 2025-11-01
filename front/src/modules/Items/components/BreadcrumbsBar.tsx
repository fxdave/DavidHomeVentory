import {styled} from "@macaron-css/react";
import {Navigation} from "../useNavigation";
import {Button} from "@ui/Button";
import {Breadcrumbs} from "@ui/Breadcrumbs";
import {colors} from "@ui/theme";

export function BreadcrumbsBar({nav}: {nav: Navigation}) {
  const breadcrumbItems = nav.path.map(segment => ({
    label: segment.name,
    onClick: () => nav.goBack(segment.id),
  }));

  return (
    <Container>
      <Breadcrumbs items={breadcrumbItems} />
      {nav.isDirty && (
        <ResetButton variant="outlined" onClick={() => nav.reset()}>
          RESET
        </ResetButton>
      )}
    </Container>
  );
}

const Container = styled("div", {
  base: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
});

const ResetButton = styled(Button, {
  base: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: colors.paper,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
    borderColor: colors.error,
    color: colors.error,
    "&:hover:not(:disabled)": {
      backgroundColor: `${colors.error}11`,
      borderColor: colors.errorHover,
    },
  },
});
