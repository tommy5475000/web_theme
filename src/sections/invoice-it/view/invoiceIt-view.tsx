import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query"

import { Box, Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";

import { getInvoiceXlm } from "src/apis/it";
import { DashboardContent } from "src/layouts/dashboard";

import { ModalManager } from "src/components/modal";
import { ButtonGroup } from "src/components/button";
import { Scrollbar } from "src/components/scrollbar";
import { headLabel } from "src/components/Item/item";
import { handleExportData } from "src/components/export";

import { TableNoData } from "src/sections/user/table-no-data";
import { TableEmptyRows } from "src/sections/user/table-empty-rows";

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
                    dataFiltered.map((item) => item.soHd)
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
                      key={row.soHd}
                      row={row}
                      selected={table.selected.includes(row.soHd)}
                      onSelectRow={() => table.onSelectRow(row.soHd)}
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
          rowsPerPageOptions={[10, 50, 100]}
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
        <CreateXml handleClose={handleCloseCreate} />
      </ModalManager>

    </DashboardContent >
  );

}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('ngayHd');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
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
      setRowsPerPage(parseInt(event.target.value, 10));
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
