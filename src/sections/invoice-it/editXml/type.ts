import { InvoiceProps } from "../invoice-table-row";

export interface LoaiHinh {
  key: string | number;
  label: string;
  disabled?: boolean;
}
export type EditXmlProps = {
    handleClose: () => void
    dataLH:LoaiHinh[]
    rowSelect: InvoiceProps|null
}

