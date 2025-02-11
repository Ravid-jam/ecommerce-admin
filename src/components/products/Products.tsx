import React from "react";
import Swal from "sweetalert2";
import DataTable from "../common/DataTable";
import Message from "../common/massage/Message";
import ApiServices from "../services/Apiservices";
import { setSuccess, store } from "../services/pulState/store";
import { useProductList } from "../services/query/ApiHandlerQuery";
import AddUpdateProduct from "./AddUpdateProduct";

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
              { title: "Title", field: "title" },
              { title: "Category", field: "category" },
              { title: "Price", field: "price" },
              { title: "Stock", field: "stock" },
              { title: "Date", field: "Date" },
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
      {/* {open && (
        <AddUpdateProduct
          open={open}
          setOpen={() => {
            setOpen(false);
            list.refetch();
          }}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          ObjProduct={ObjProduct}
        />
      )} */}
    </div>
  );
}
