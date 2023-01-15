import DeleteIcon from "@mui/icons-material/Delete"
import { Avatar, Button, Typography } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { ComponentProps, useState } from "react"

type SafeDeleteButtonProps = {
    disabled: boolean,
    edge: ComponentProps<typeof IconButton>['edge'],
    onClick: () => void
}

export function SafeDeleteButton({ edge, onClick, disabled }: SafeDeleteButtonProps) {
    const [clicked, setClicked] = useState(false)

    if (clicked) {
        return <IconButton edge={edge} onClick={onClick}>
            <Typography>Ok</Typography>
        </IconButton>
    } else {
        return <IconButton edge={edge} disabled={disabled} onClick={() => setClicked(true)}>
            <DeleteIcon />
        </IconButton>
    }

}