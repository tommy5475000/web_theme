import { array, object, string } from 'yup'
import { useFieldArray, useForm } from 'react-hook-form'

import Grid from '@mui/material/GridLegacy';
import { DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'

import { EditXmlProps } from './type'
import { yupResolver } from '@hookform/resolvers/yup';

const editSchema = object({
    loaiHinh:string(),
    soHd: string()
        .required('Không để trống số hóa đơn'),
    kyHieuHd: string()
        .required('Không để trống ký hiệu hóa đơn'),
    ngayHd: string()
        .required('Không để trống ngày hóa đơn'),
    tenNcc: string()
        .required('Không để trống tên nhà cung cấp'),
    diaChi: string()
        .required('Không để trống địa chỉ'),
    noiDung: string()
        .required('Không để trống nội dung thanh toán'),
    item: array().of(
        object({
            danhSachHang: string()
                .required('Không để trống tên hàng hóa'),
            donGia: string()
                .required('Không để trống đơn giá')
                .matches(/^\d+$/, 'Phải là số'),
            sl: string()
                .required('Không để trống số lượng')
                .matches(/^\d+$/, 'Phải là số'),
            dvt: string()
                .required('Không để trống đơn vị tính'),
        })
    ),
    hinhThuc: string(),
    stk: string().when("hinhThuc", {
        is: "ck",
        then: schema => schema.required("Không để trống số tài khoản"),
        otherwise: schema => schema.notRequired(),
    }),
    caNhan: string().when("hinhThuc", {
        is: "ck",
        then: schema => schema.required('Không để trống tên tài khoản'),
        otherwise: schema => schema.notRequired(),
    }),
    nganHang: string().when('hinhThuc', {
        is: 'ck',
        then: schema => schema.required('Không để trống tên ngân hàng'),
        otherwise: schema => schema.notRequired(),
    }),
    tyGia: string()
        .matches(/^\d+$/, { message: "Phải là số", excludeEmptyString: true }),


})

export function EditXml({ handleClose, dataLH, rowSelect }: EditXmlProps) {
    const { register, handleSubmit, formState: { errors }, watch, control } = useForm({
        defaultValues: {
            loaiHinh:rowSelect?.loaiHinh,
            soHd: rowSelect?.soHd,
            kyHieuHd: rowSelect?.kyHieuHd,
            ngayHd: rowSelect?.ngayHd,
            tenNcc: rowSelect?.tenNcc,
            diaChi: rowSelect?.diaChi,
            noiDung: rowSelect?.noiDung,
            tyGia: rowSelect?.tyGia ? String(rowSelect?.tyGia) : '',
            hinhThuc: rowSelect?.hinhThuc,
            caNhan: rowSelect?.caNhan,
            stk: rowSelect?.stk,
            nganHang: rowSelect?.nganHang,
            item: rowSelect?.item.map((item) => ({
                danhSachHang: item.danhSachHang || '',
                sl: item.sl ? String(item.sl) : '',
                donGia: item.donGia ? String(item.donGia): '',
                dvt: item.dvt || ''
            })),

        },
        resolver: yupResolver(editSchema),
        mode: 'onTouched'
    })

    const hinhThuc = watch('hinhThuc')

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'item'
    })
    return (
        <form>
            <DialogTitle>Edit Invoice </DialogTitle>
            <DialogContent>
                <Grid
                    container
                    spacing={2}
                    justifyContent='flex-start'
                    alignItems='center'
                >
                    <Grid item xs={8}>
                        <TableContainer component={Paper}>
                            <Table size='small'>
                                <TableHead sx={{ background: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell>Tên hàng</TableCell>
                                        <TableCell>ĐVT</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>Đơn giá</TableCell>
                                        <TableCell align='center'>#</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fields.map((field,index)=>(
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <TextField
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={4}>

                    </Grid>
                </Grid>
            </DialogContent>
        </form>
    )
}
