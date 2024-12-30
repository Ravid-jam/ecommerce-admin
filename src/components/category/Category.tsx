import React from "react";
import Swal from "sweetalert2";
import DataTable from "../common/DataTable";
import Message from "../common/massage/Message";
import { setSuccess, store } from "../services/pulState/store";
import {
  useCategoryList,
  useDeleteCategory,
} from "../services/query/ApiHandlerQuery";
import AddUpdateCategory from "./AddUpdateCategory";
import ICategory from "../types/category";

export default function Category() {
  const [open, setOpen] = React.useState(false);
  const [ObjCategory, setObjCategory] = React.useState<ICategory>();
  const [isEdit, setIsEdit] = React.useState<any>(false);

  const list = useCategoryList();

  const showSuccessMessage = store.useState((s) => s.successMessage);
  const isSuccess = store.useState((s) => s.isSuccess);

  async function deleteCategoryData(_id: string) {
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
          const res = await useDeleteCategory(_id);
          console.log(res);
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
      <div style={{ marginLeft: "50px", marginRight: "50px" }}>
        <Message
          open={isSuccess}
          setOpen={setSuccess}
          message={showSuccessMessage}
        />
        <div>
          <DataTable
            title={"Category"}
            columns={[
              {
                title: "Image",
                field: "categoryImage",
                render: (item: ICategory) => (
                  <div style={{ height: "70px", width: "70px" }}>
                    <img
                      src={item.categoryImage}
                      height={"100%"}
                      width={"100%"}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                ),
              },
              { title: "Title", field: "categoryTitle" },
              { title: "Date", field: "Date" },
            ]}
            data={list.data}
            setDeleteId={deleteCategoryData}
            setOpen={setOpen}
            setObject={setObjCategory}
            setIsEdit={setIsEdit}
            isLoading={list.isLoading}
            addButtonTitle={"Add Category"}
          />
        </div>
      </div>
      {open && (
        <AddUpdateCategory
          open={open}
          setOpen={() => {
            setOpen(false);
            list.refetch();
          }}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          ObjCategory={ObjCategory}
        />
      )}
    </div>
  );
}
