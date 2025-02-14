import React from "react";
import Swal from "sweetalert2";
import DataTable from "../common/DataTable";
import Message from "../common/massage/Message";
import ApiServices from "../services/Apiservices";
import { setSuccess, store } from "../services/pulState/store";
import { useProductList } from "../services/query/ApiHandlerQuery";
import AddUpdateProduct from "./AddUpdateProduct";
import IProducts from "../types/products";
import { formatDate } from "../common/utils";
import { Tooltip } from "@mui/material";

export default function Products() {
  const [open, setOpen] = React.useState(false);
  const [ObjProduct, setObjProduct] = React.useState<any>();
  const [isEdit, setIsEdit] = React.useState<any>(false);

  const list = useProductList();
  const showSuccessMessage = store.useState((s) => s.successMessage);
  const isSuccess = store.useState((s) => s.isSuccess);
  async function deleteProductsData(_id: string) {
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await ApiServices.deleteProduct(_id);
          Swal.fire(
            "Deleted!",
            `${res.message ? res.message : "Category Deleted"}`,
            "success"
          );
          list.refetch();
        }
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${err.message}`,
      });
    }
  }

  return (
    <div>
      <div style={{ marginLeft: "20px", marginRight: "50px" }}>
        <Message
          open={isSuccess}
          setOpen={setSuccess}
          message={showSuccessMessage}
        />
        <div>
          <DataTable
            title={"Products"}
            columns={[
              {
                title: "Image",
                field: "images",
                render: (image: any) => {
                  return (
                    <img
                      src={image?.images?.[0]?.url}
                      height={100}
                      width={100}
                    />
                  );
                },
              },
              {
                title: "Title",
                field: "title",
                render: (rowData: any) => (
                  <Tooltip
                    title={
                      <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                        {rowData.title}
                      </span>
                    }
                    arrow
                    placement="top"
                  >
                    <div
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "200px",
                        whiteSpace: "normal",
                        cursor: "pointer",
                      }}
                    >
                      {rowData.title}
                    </div>
                  </Tooltip>
                ),
              },
              { title: "Category", field: "category.name" },
              { title: "Price", field: "totalPrice" },
              { title: "Stock", field: "stock" },
              {
                title: "Date",
                field: "createdAt",
                render: (item: any) => (
                  <span>{formatDate(item.createdAt)}</span>
                ),
              },
            ]}
            data={list.data}
            setDeleteId={deleteProductsData}
            setOpen={setOpen}
            setObject={setObjProduct}
            setIsEdit={setIsEdit}
            isLoading={list.isLoading}
            addButtonTitle={"Add Product"}
          />
        </div>
      </div>
      {open && (
        <AddUpdateProduct
          open={open}
          setOpen={() => {
            setOpen(false);
            list.refetch();
          }}
          isEdit={isEdit}
          ObjProduct={ObjProduct}
        />
      )}
    </div>
  );
}
