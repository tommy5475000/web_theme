import { useState } from 'react';
import { array, object, string } from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Grid from '@mui/material/GridLegacy';
import { Button, DialogActions, DialogContent, DialogTitle, InputLabel, TextField } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import { widthImport } from '../utils';
import { CreateXmlProps } from "./type";

const createSchema = object({
    soHd: string()
        .required('Không để trống số hóa đơn'),
    kyHieuHd: string()
        .required('Không để trống ký hiệu hóa đơn'),
    ngayHd: string()
        .required('Không để trống ngày hóa đơn'),
    // .matches(
    //     /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    //     'Định dạng ngày không hợp lệ (đúng: DD/MM/YYYY)'
    // ),
    tenNcc: string()
        .required('Không để trống tên nhà cung cấp'),
    diaChi: string()
        .required("Không để trống địa chỉ"),
    noiDung: string()
        .required("Không để trống nội dung"),
    item: array().of(
        object({
            danhSachHang:string().required("Không để trống nội dung hóa đơn"),
            donGia: string()
                .required("Không để trống đơn giá")
                .matches(/^\d+$/, "Phải là số"),
            sl: string()
                .required("Không để trống số lượng")
                .matches(/^\d+$/, "Phải là số"),
            tyGia: string()
                .matches(/^\d+$/, { message: "Phải là số", excludeEmptyString: true }),
        }
        )
    ),
    hinhThuc: string(),
    stk: string(),
    caNhan: string(),
    nganHang: string(),
})

export function CreateXml({ handleClose }: CreateXmlProps) {
    const [selectLoaiHinh, setSelectLoaiHinh] = useState("Chọn hình thức")
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            soHd: "",
            kyHieuHd: "",
            ngayHd: "",
            tenNcc: "",
            diaChi: "",
            item:[{
                danhSachHang:"",
                sl: "",
                donGia: "",
                tyGia: "",}],       
            noiDung:"",
            stk: "",
            caNhan: "",
            hinhThuc: "",


        },
        resolver: yupResolver(createSchema),
        mode: "onTouched"
    })
    return (
        <form>
            <DialogTitle>Create Invoice</DialogTitle>

            {/* <DialogContent>
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
                            error={!!errors.soHd}
                            {...register("soHd")}
                            helperText={errors.soHd?.message}
                        />
                    </Grid>
                </Grid>

                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ mb: 1 }}
                >
                    <Grid item xs={5}>
                        <InputLabel>Ký hiệu hóa đơn:</InputLabel>
                    </Grid>

                    <Grid item xs={7} >
                        <TextField
                            sx={{ ...widthImport }}
                            variant='standard'
                            error={!!errors.kyHieuHd}
                            {...register("kyHieuHd")}
                            helperText={errors.kyHieuHd?.message}
                        />
                    </Grid>
                </Grid>

                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ mb: 1 }}
                >
                    <Grid item xs={5}>
                        <InputLabel> Ngày hóa đơn: </InputLabel>
                    </Grid>

                    <Grid item xs={7}>
                        <TextField
                            type='date'
                            variant='standard'
                            sx={{ ...widthImport }}
                            error={!!errors.ngayHd}
                            {...register("ngayHd")}
                            helperText={errors.ngayHd?.message}
                        />
                    </Grid>
                </Grid>

                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ mb: 1 }}
                >
                    <Grid item xs={5}>
                        <InputLabel>Tên nhà cung cấp:</InputLabel>
                    </Grid>

                    <Grid item xs={7}>
                        <TextField
                            variant='standard'
                            sx={{...widthImport}}
                            error={!!errors.tenNcc}
                            {...register("tenNcc")}
                            helperText={errors.tenNcc?.message}
                        />
                    </Grid>
                </Grid>

                <Grid
                    container
                    spacing={2}
                    alignItems='center'
                    justifyContent='flex-start'
                    sx={{ mb: 1 }}
                >
                    <Grid item xs={5}>
                        <InputLabel>Địa chỉ: </InputLabel>
                    </Grid>

                    <Grid item xs={7}>
                        <TextField
                            variant='standard'
                            sx={{...widthImport}}
                            error={!!errors.diaChi}
                            {...register("diaChi")}
                            helperText={errors.diaChi?.message}
                        />
                    </Grid>
                </Grid>

                <Grid
                    container
                    spacing={2}
                    alignItems='center'
                    justifyContent='flex-start'
                    sx={{ mb: 1 }}
                >
                    <Grid item xs={5}>
                        <InputLabel>Nội dung hóa đơn:</InputLabel>
                    </Grid>

                    <Grid item xs={7}>
                        <TextField
                            variant='standard'
                            sx={{...widthImport}}
                            error={!!errors.noiDung}
                            {...register("noiDung")}
                            helperText={errors.noiDung?.message}
                        />
                    </Grid>
                </Grid>

                <Grid
                    container
                    spacing={2}
                    alignItems='center'
                    justifyContent='flex-start'
                    sx={{ mb: 1 }}
                >
                    <Grid item xs={5}>
                        <InputLabel>Số lượng</InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            variant='standard'
                            sx={{...widthImport}}

                        />
                    </Grid>
                </Grid>

            </DialogContent> */}
            <DialogContent>
                <Grid
                    container
                    spacing={2}
                    alignItems='center'
                    justifyContent='flex-start'
                >
                    <Grid item xs={7}>
                        <Grid
                            container
                            spacing={3}
                            alignItems='center'
                            justifyContent='flex-start'
                            mb={1}
                        >
                            <Grid item xs={5}>
                                <InputLabel>
                                    Nội dung hóa đơn:
                                </InputLabel>
                            </Grid>

                        </Grid>
                    </Grid>

                    <Grid item xs={5}>

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
                            <Grid item xs={5}>
                                <InputLabel>
                                    Ký hiệu hóa đơn:
                                </InputLabel>
                            </Grid>
                            <Grid item xs={7}>
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
                            alignItems='center'
                            justifyContent='flex-start'
                            mb={1}
                        >
                            <Grid item xs={5}>
                                <InputLabel>
                                    Tên nhà cung cấp:
                                </InputLabel>
                            </Grid>

                            <Grid item xs={7}>
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
                            <Grid item xs={5}>
                                <InputLabel>
                                    Địa chỉ:
                                </InputLabel>
                            </Grid>

                            <Grid item xs={7}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.diaChi}
                                    {...register('diaChi')}
                                    helperText={errors.diaChi?.message}
                                />
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button color='inherit' onClick={handleClose}>
                    Hủy
                </Button>
                <Button type='submit' color='primary' variant='contained'>
                    Tạo
                </Button>
            </DialogActions>
        </form>

    )
}