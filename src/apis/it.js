import fetcher from "./fetcher";

// ----- LẤY THÔNG TIN HÓA ĐƠN ----- //
export const getInvoiceXlm = async () => {
  try {
    const response = await fetcher.get("/invoice-it/getDataXml");
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- IMPORT XML ----- //
export const importXML = async (payload) => {
  try {
    const response = await fetcher.post("/invoice-it/importXml", payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- TẠO HÓA ĐƠN ----- //
export const createInv = async (payload) => {
  console.log(payload);
  
  try {
    const response = await fetcher.post("/invoice-it/createInv", payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- EDIT HÓA ĐƠN ----- //
export const editInv = async (payload) => {
  try {
    const response = await fetcher.post("/invoice-it/editIvn", payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};
