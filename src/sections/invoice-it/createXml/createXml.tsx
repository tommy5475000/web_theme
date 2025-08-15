import { object, string } from 'yup'

import Grid from '@mui/material/GridLegacy';
import { Button, DialogActions, DialogContent, DialogTitle, InputLabel, TextField } from "@mui/material";

import { widthImport } from '../utils';
import { CreateXmlProps } from "./type";

const createSchema = object({
    soHd: string()
        .required('Không để trống số hóa đơn'),
    kyHieuHd: string()
        .required('Không để trống ký hiệu hóa đơn'),
    ngayHd: string()
        .required('Không để trống ngày hóa đơn')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày không hợp lệ (đúng: YYYY-MM-DD)'),
    tenNcc: string()
        .required('Không để trống tên nhà cung cấp'),

})

export function CreateXml({ handleClose }: CreateXmlProps) {
    return (
        <form action="">
            <DialogTitle>Create Invoice</DialogTitle>

            <DialogContent>
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ mb: 1 }}
                >
                    <Grid item xs={5}>
                        <InputLabel>Số hóa đơn:</InputLabel>
                    </Grid>

                    <Grid item xs={7} >
                        <TextField
                            sx={{ ...widthImport }}
                            variant='standard'

                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button color='inherit' onClick={handleClose}>
                    Hủy
                </Button>
                <Button color='primary' variant='contained'>
                    Tạo
                </Button>
            </DialogActions>
        </form>

    )
}