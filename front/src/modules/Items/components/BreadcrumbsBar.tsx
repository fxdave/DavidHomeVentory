import {Breadcrumbs, Button} from "@mui/material";
import {Navigation} from "../useNavigation";

export function BreadcrumbsBar({nav}: {nav: Navigation}) {
  return (
    <div style={{display: "flex"}}>
      <Breadcrumbs style={{flex: 1}}>
        {nav.path.map(segment => (
          <Button
            key={segment.id}
            onClick={() => {
              nav.goBack(segment.id);
            }}>
            {segment.name}
          </Button>
        ))}
      </Breadcrumbs>
      {nav.isDirty && (
        <Button
          style={{flex: 0}}
          onClick={() => {
            nav.reset();
          }}>
          RESET
        </Button>
      )}
    </div>
  );
}
