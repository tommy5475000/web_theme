import { Grid, Button } from "@mui/material";

import { ButtonGroupProps } from "./types";

export function ButtonGroup(
    {
    handleOpen,
    handleExport,
    handleImport, }: ButtonGroupProps) {
    return (
        <Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                sx={{mr:.5}}
            >
                Create
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleImport}
                sx={{mr:.5}}
            >
                Import
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleExport}
                sx={{mr:.5}}
            >
                Export
            </Button>
        </Grid>

    );
};


