import {styled} from "styled-system/jsx";
import {Navigation} from "../useNavigation";
import {Breadcrumbs} from "@ui/Breadcrumbs";
import {boxLidColors} from "utils/boxHue";

const MAX_BREADCRUMB_LENGTH = 20;

function truncateName(name: string, maxLength: number = MAX_BREADCRUMB_LENGTH) {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + "…";
}

export function displayName(segment: {id: string | null; name: string}) {
  if (segment.id === null) return "Everything";
  if (segment.id === "ROOT") return "Home";
  return segment.name;
}

export function BreadcrumbsBar({nav}: {nav: Navigation}) {
  const ancestors = nav.path.slice(0, -1);
  const current = nav.parent;
  const isBox = current.id !== null && current.id !== "ROOT";

  return (
    <Container>
      {ancestors.length > 0 && (
        <Breadcrumbs
          items={ancestors.map(segment => ({
            label: truncateName(displayName(segment)),
            onClick: () => nav.goBack(segment.id),
          }))}
        />
      )}
      <Title data-box={isBox}>
        {isBox && <Swatch style={boxLidColors(current.id)} />}
        {displayName(current)}
      </Title>
    </Container>
  );
}

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "12px 0 10px",
    minWidth: 0,
  },
});

const Title = styled("h2", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
    lineHeight: 1.2,
    color: "text.primary",
    overflowWrap: "anywhere",
    "&[data-box='true']": {
      fontFamily: "label",
      fontSize: "20px",
    },
  },
});

/** A tiny box with its colored lid, matching the rows below. */
const Swatch = styled("span", {
  base: {
    position: "relative",
    width: "18px",
    height: "14px",
    marginTop: "6px",
    borderRadius: "1px 1px 3px 3px",
    backgroundColor: "cardboardLight",
    flexShrink: 0,
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-6px",
      left: "-2px",
      right: "-2px",
      height: "7px",
      borderRadius: "2px",
      backgroundColor: "var(--lid)",
      borderBottom: "2px solid var(--lid-edge)",
    },
  },
});
