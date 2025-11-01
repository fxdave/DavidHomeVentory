import {styled} from "@macaron-css/react";
import {Navigation} from "../useNavigation";
import {Button} from "@ui/Button";
import {Breadcrumbs} from "@ui/Breadcrumbs";

export function BreadcrumbsBar({nav}: {nav: Navigation}) {
  return (
    <Container>
      <StyledBreadcrumbs>
        {nav.path.map(segment => (
          <Button
            key={segment.id}
            onClick={() => {
              nav.goBack(segment.id);
            }}>
            {segment.name}
          </Button>
        ))}
      </StyledBreadcrumbs>
      {nav.isDirty && (
        <ResetButton
          onClick={() => {
            nav.reset();
          }}>
          RESET
        </ResetButton>
      )}
    </Container>
  );
}

const Container = styled("div", {
  base: {
    display: "flex",
  },
});

const StyledBreadcrumbs = styled(Breadcrumbs, {
  base: {
    flex: 1,
  },
});

const ResetButton = styled(Button, {
  base: {
    flex: 0,
  },
});
