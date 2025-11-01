import {Trash2} from "lucide-react";
import {useState} from "react";
import {IconButton} from "@ui/Button";

type SafeDeleteButtonProps = {
  disabled: boolean;
  onClick: () => void;
};

export function SafeDeleteButton({onClick, disabled}: SafeDeleteButtonProps) {
  const [clicked, setClicked] = useState(false);

  if (clicked) {
    return <IconButton onClick={onClick}>Ok</IconButton>;
  } else {
    return (
      <IconButton disabled={disabled} onClick={() => setClicked(true)}>
        <Trash2 size={20} />
      </IconButton>
    );
  }
}
