// ✅ External (npm)
import { useState } from 'react';
import { array, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

// ✅ Custom (MUI)
import Grid from '@mui/material/GridLegacy';
import { Add, Delete } from "@mui/icons-material";
import {
    Button, DialogActions, DialogContent, DialogTitle,
    FormControl, IconButton, InputLabel, MenuItem, Paper,
    Select, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TextField
} from "@mui/material";

// ✅ Internal (src/)
import { createInv } from 'src/apis/it';

import { capitalizeFirstLetter, showAlert } from 'src/components/alert';

// ✅ Relative (./ và ../)
import { widthImport } from '../utils';
import { CreateInvoiceForm, CreateXmlProps } from './type';


const createSchema = object({
    soHd: string()
        .required('Không để trống số hóa đơn'),
    kyHieuHd: string()
        .required('Không để trống ký hiệu hóa đơn'),
    ngayHd: string()
        .required('Không để trống ngày hóa đơn')
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày không hợp lệ (đúng: YYYY-MM-DD)"),
    tenNcc: string()
        .required('Không để trống tên nhà cung cấp'),
    diaChi: string()
        .required("Không để trống địa chỉ"),
    noiDung: string()
        .required("Không để trống nội dung thanh toán"),
    item: array().of(
        object({
            danhSachHang: string().required("Không để trống nội dung hóa đơn"),
            donGia: string()
                .required("Không để trống đơn giá")
                .matches(/^\d+$/, "Phải là số"),
            sl: string()
                .required("Không để trống số lượng")
                .matches(/^\d+$/, "Phải là số"),
            dvt: string()
                .required("Không để trống đơn vị tính")
        }
        )
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

export function CreateXml({ handleClose, dataLH }: CreateXmlProps) {
    const queryClient = useQueryClient()
    const [selectLoaiHinh, setSelectLoaiHinh] = useState('Chọn loại hình')
    const { register, handleSubmit, formState: { errors }, watch, control } = useForm({
        defaultValues: {
            soHd: "",
            kyHieuHd: "",
            ngayHd: "",
            tenNcc: "",
            diaChi: "",
            tyGia: "",
            item: [{
                danhSachHang: "",
                sl: "",
                donGia: "",
                dvt: "",
            }],
            noiDung: "",
            stk: "",
            caNhan: "",
            hinhThuc: "",


        },
        resolver: yupResolver(createSchema),
        mode: "onTouched"
    })

    const hinhThuc = watch('hinhThuc')

    const { fields, append, remove } = useFieldArray({
        control,
        name: "item"
    });

    const { mutate } = useMutation({
        mutationFn: (values: CreateInvoiceForm) => {
            const formatValues = {
                ...values,
                kyHieuHd: values.kyHieuHd.toUpperCase(),
                tenNcc: values.tenNcc.toUpperCase(),
                diaChi: capitalizeFirstLetter(values.diaChi),
                loaiHinh: selectLoaiHinh
            }
            return createInv(formatValues)
        },
        onError: (error) => {
            showAlert(error)
        },
        onSuccess: () => {
            showAlert({ message: 'Thành công', type: 'success' });
            handleClose();
            queryClient.invalidateQueries({
                queryKey: ['dataXml']
            })
        }
    })

    const handleFormSubmit: SubmitHandler<CreateInvoiceForm> = (data) => {
        mutate(data);
    };
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogContent>
                <Grid
                    container
                    spacing={2}
                    alignItems='center'
                    justifyContent='flex-start'
                >
                    {/* bảng trái */}
                    <Grid item xs={8}>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableRow>
                                        <TableCell>Tên hàng</TableCell>
                                        <TableCell>ĐVT</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>Đơn giá</TableCell>
                                        <TableCell align="center">#</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <TextField
                                                    variant="standard"
                                                    {...register(`item.${index}.danhSachHang`)}
                                                    error={!!errors?.item?.[index]?.danhSachHang}
                                                    helperText={errors?.item?.[index]?.danhSachHang?.message}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    variant="standard"
                                                    {...register(`item.${index}.dvt`)}
                                                    error={!!errors?.item?.[index]?.dvt}
                                                    helperText={errors?.item?.[index]?.dvt?.message}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    variant="standard"
                                                    {...register(`item.${index}.sl`)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    variant="standard"
                                                    {...register(`item.${index}.donGia`)}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton color="error" onClick={() => remove(index)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Button
                            startIcon={<Add />}
                            variant="outlined"
                            sx={{ mt: 1 }}
                            onClick={() => append({
                                danhSachHang: "",
                                sl: "",
                                donGia: "",
                                dvt: "",
                            })}
                        >
                            Thêm dòng
                        </Button>
                    </Grid>

                    {/* bảng phải */}
                    <Grid item xs={4}>

                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>
                                    Loại hình:
                                </InputLabel>
                            </Grid>

                            <Grid item xs={8}>
                                <FormControl
                                    variant="standard"
                                >
                                    <Select
                                        sx={{ ...widthImport }}
                                        value={selectLoaiHinh}
                                        onChange={(e) => setSelectLoaiHinh(e.target.value)}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    height: 200
                                                }
                                            }
                                        }}
                                    >
                                        {dataLH.map((item) => (
                                            <MenuItem
                                                key={item.key}
                                                value={item.label}
                                                disabled={item.disabled || false}

                                            >
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            justifyContent="flex-start"
                            sx={{ mb: 1 }}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Số hóa đơn:</InputLabel>
                            </Grid>

                            <Grid item xs={8} >
                                <TextField
                                    sx={{ ...widthImport }}
                                    variant='standard'
                                    error={!!errors.soHd}
                                    {...register("soHd")}
                                    helperText={errors.soHd?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            alignItems='center'
                            justifyContent='flex-start'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>
                                    Ký hiệu hóa đơn:
                                </InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.kyHieuHd}
                                    {...register('kyHieuHd')}
                                    helperText={errors.kyHieuHd?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Ngày hóa đơn:</InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    placeholder='YYYY-MM-DD'
                                    sx={{ ...widthImport }}
                                    variant='standard'
                                    error={!!errors.ngayHd}
                                    {...register("ngayHd")}
                                    helperText={errors.ngayHd?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            alignItems='center'
                            justifyContent='flex-start'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>
                                    Tên nhà cung cấp:
                                </InputLabel>
                            </Grid>

                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.tenNcc}
                                    {...register('tenNcc')}
                                    helperText={errors.tenNcc?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            alignItems='center'
                            justifyContent='flex-start'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>
                                    Địa chỉ:
                                </InputLabel>
                            </Grid>

                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.diaChi}
                                    {...register('diaChi')}
                                    helperText={errors.diaChi?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Nội dung:</InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.noiDung}
                                    {...register('noiDung')}
                                    helperText={errors.noiDung?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Tỷ giá</InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{...widthImport}}
                                    error={!!errors.tyGia}
                                    {...register('tyGia')}
                                    helperText={errors.tyGia?.message}
                                />
                            </Grid>

                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            justifyContent="flex-start"
                            alignItems="center"
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Hình thức TT: </InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <FormControl variant='standard'>
                                    <Select
                                        sx={{ ...widthImport }}
                                        defaultValue="tm"
                                        {...register("hinhThuc")}
                                    >
                                        <MenuItem
                                            value="tm"
                                        >
                                            Tiền mặt
                                        </MenuItem>
                                        <MenuItem
                                            value="ck"
                                        >
                                            Chuyển khoản
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {hinhThuc === 'ck' && (
                            <>
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent='flex-start'
                                    alignItems='center'
                                    mb={1}
                                >
                                    <Grid item xs={4}>
                                        <InputLabel> Tên tài khoản:</InputLabel>
                                    </Grid>

                                    <Grid item xs={8}>
                                        <TextField
                                            variant='standard'
                                            sx={{ ...widthImport }}
                                            error={!!errors.caNhan}
                                            {...register('caNhan')}
                                            helperText={errors.caNhan?.message}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent='flex-start'
                                    alignItems='center'
                                    mb={1}
                                >
                                    <Grid item xs={4}>
                                        <InputLabel>Số tài khoản:</InputLabel>
                                    </Grid>

                                    <Grid item xs={8}>
                                        <TextField
                                            variant='standard'
                                            sx={{ ...widthImport }}
                                            error={!!errors.stk}
                                            {...register('stk')}
                                            helperText={errors.stk?.message}
                                        />

                                    </Grid>
                                </Grid>

                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent='flex-start'
                                    alignItems='center'
                                    mb={1}
                                >
                                    <Grid item xs={4}>
                                        <InputLabel>Ngân hàng:</InputLabel>
                                    </Grid>

                                    <Grid item xs={8}>
                                        <TextField
                                            variant='standard'
                                            sx={{ ...widthImport }}
                                            error={!!errors.nganHang}
                                            {...register('nganHang')}
                                            helperText={errors.nganHang?.message}
                                        />

                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button color='inherit' onClick={handleClose}>
                    Hủy
                </Button>
                <Button type='submit' color='primary' variant='contained' disabled={selectLoaiHinh === 'Chọn loại hình'}>
                    Tạo
                </Button>
            </DialogActions>
        </form>

    )
}