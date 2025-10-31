import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query"

import { Box, Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";

import { getInvoiceXlm } from "src/apis/it";
import { DashboardContent } from "src/layouts/dashboard";

import { showAlert } from "src/components/alert";
import { ModalManager } from "src/components/modal";
import { ButtonGroup } from "src/components/button";
import { Scrollbar } from "src/components/scrollbar";
import { handleExportData } from "src/components/export";
import { headLabel, itemHinhThucHoaDon } from "src/components/Item/item";

import { TableNoData } from "src/sections/user/table-no-data";
import { TableEmptyRows } from "src/sections/user/table-empty-rows";

import { EditXml } from "../editXml";
import { ImportXml } from "../importXml";
import { CreateXml } from "../createXml";
import { InvoiceTableHead } from "../invoice-table-head";
import { InvoiceTableToolbar } from "../invoice-table-toolbar";
import { applyFilterIvn, emptyRows, getComparator, } from "../utils";
import { InvoiceProps, InvoiceTableRow } from "../invoice-table-row";


export function InvoiceItView() {
  const table = useTable()
  const [filterName, setFilterName] = useState("")
  const [openImport, setOpenImport] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [rowSelect, setRowSelect] = useState<InvoiceProps | null>(null);

  const handleOpenCreate = () => {
    setOpenCreate(true)
  }

  const handleCloseCreate = () => {
    setOpenCreate(false)
  }

  const handleOpenImport = () => {
    setOpenImport(true)
  }
  const handleCloseImport = () => {
    setOpenImport(false)
  }

  const handleOpenEdit = (row: InvoiceProps) => {
    if (table.selected.length===0) {
      showAlert({type:'error',message:'Vui lòng chọn 1 dòng muốn sửa'})
      return
    }
    if (table.selected.length>1) {
      showAlert({type:'error',message:'Vui lòng chọn 1 dòng'})
      return
    }
    setRowSelect(rowSelect)
    setOpenEdit(true)
  }
  const handleCloseEdit = () => {
    setOpenEdit(false)
    setRowSelect(null)
  }

  const { data: dataXml = [] } = useQuery<InvoiceProps[]>({
    queryKey: ["dataXml"],
    queryFn: getInvoiceXlm
  })

  const dataFiltered = applyFilterIvn({
    inputData: dataXml,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  })

  const notFound = !dataFiltered.length && !!filterName;


  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Invoices
        </Typography>
        <ButtonGroup
          handleOpen={handleOpenCreate}
          handleImport={handleOpenImport}
          handleExport={() => handleExportData({
            data: dataFiltered,
            fileName: 'Invoice IT',
            columns: headLabel,
          })}
        />
      </Box >
      <Card>
        <InvoiceTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <InvoiceTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numberSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((item) => item.id)
                  )
                }
                headLabel={headLabel}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <InvoiceTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => { table.onSelectRow(row.id); setRowSelect(row) }}
                      onEditRow={() => handleOpenEdit(row)}
                    />
                  ))}

                <TableRow>
                  <TableCell colSpan={6} align="right" sx={{ fontWeight: 'bold' }}>
                    Tổng cộng:
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {dataFiltered.reduce((sum, r) => sum + (r.tienThue || 0), 0).toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {dataFiltered.reduce((sum, r) => sum + (r.tongTien || 0), 0).toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell />
                </TableRow>


                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataXml.length)}
                />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>

            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={dataXml.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[30, 50, 100]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Modal Import */}
      <ModalManager
        open={openImport}
        handleClose={handleCloseImport}
      >
        <ImportXml handleClose={handleCloseImport} />
      </ModalManager>

      {/* Modal Create*/}
      <ModalManager
        open={openCreate}
        handleClose={handleCloseCreate}
        maxWidth="xl"
      >
        <CreateXml handleClose={handleCloseCreate} dataLH={itemHinhThucHoaDon} />
      </ModalManager>

      <ModalManager
        open={openEdit}
        handleClose={handleCloseEdit}
        maxWidth="lg"
      >
        {rowSelect && (
          <EditXml handleClose={handleCloseEdit} dataLH={itemHinhThucHoaDon} rowSelect={rowSelect} />

        )}
      </ModalManager>

    </DashboardContent >
  );

}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('ngayHd');
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: number[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: number) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 30));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
