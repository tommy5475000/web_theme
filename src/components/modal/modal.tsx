import {  Dialog } from "@mui/material";

import { ModalTypeProps } from "./type";

export function ModalManager({
    open,
    handleClose,
    children,
}: ModalTypeProps) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm" fullWidth
        >

            {children}
        </Dialog>
    )
}

