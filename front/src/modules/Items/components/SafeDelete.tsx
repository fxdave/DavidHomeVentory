import {Trash2, Check} from "lucide-react";
import {useState, MouseEvent} from "react";
import {styled} from "@macaron-css/react";
import {IconButton} from "@ui/Button";
import {colors} from "@ui/theme";

type SafeDeleteButtonProps = {
  disabled: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

export function SafeDeleteButton({onClick, disabled}: SafeDeleteButtonProps) {
  const [clicked, setClicked] = useState(false);

  if (clicked) {
    return (
      <ConfirmButton
        onClick={onClick}
        aria-label="Confirm delete"
        title="Click to confirm deletion">
        <Check size={20} />
      </ConfirmButton>
    );
  }

  return (
    <IconButton
      disabled={disabled}
      onClick={e => {
        e.stopPropagation();
        setClicked(true);
      }}
      aria-label="Delete item"
      title="Click to delete">
      <Trash2 size={20} />
    </IconButton>
  );
}

const ConfirmButton = styled(IconButton, {
  base: {
    color: colors.error,
    "&:hover:not(:disabled)": {
      backgroundColor: `${colors.error}22`,
    },
  },
});
