import { ReactNode } from "react";

export type ModalTypeProps={
    open:boolean;
    handleClose:()=> void;
    children?:ReactNode;
}