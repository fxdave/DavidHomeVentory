import {styled} from "styled-system/jsx";
import {PathSegment} from "../useNavigation";
import {Breadcrumbs} from "@ui/Breadcrumbs";
import {QrCode} from "lucide-react";
import {boxTagColor} from "utils/boxHue";

const MAX_BREADCRUMB_LENGTH = 20;

function truncateName(name: string, maxLength: number = MAX_BREADCRUMB_LENGTH) {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + "…";
}

export function displayName(segment: {id: string; name: string}) {
  if (segment.id === "ROOT") return "Home";
  return segment.name;
}

export function BreadcrumbsBar({
  path,
  onGoBack,
}: {
  path: PathSegment[];
  onGoBack: (id: string) => void;
}) {
  const ancestors = path.slice(0, -1);
  const current = path[path.length - 1];
  const isBox = current.id !== "ROOT";

  return (
    <Container>
      {ancestors.length > 0 && (
        <Breadcrumbs
          items={ancestors.map(segment => ({
            label: truncateName(displayName(segment)),
            onClick: () => onGoBack(segment.id),
          }))}
        />
      )}
      <Title>
        {isBox && (
          <BoxIcon style={boxTagColor(current.id)}>
            <QrCode size={16} />
          </BoxIcon>
        )}
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
  },
});

/** The open box's tinted icon, matching its row in the list. */
const BoxIcon = styled("span", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    borderRadius: "7px",
    backgroundColor: "var(--tag-bg)",
    color: "var(--tag-fg)",
    flexShrink: 0,
  },
});
