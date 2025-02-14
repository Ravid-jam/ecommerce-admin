import DataTable from "@/components/common/DataTable";
import Message from "@/components/common/massage/Message";
import { setSuccess, store } from "@/components/services/pulState/store";
import {
  useDeleteSubCategory,
  useSubCategoryList,
} from "@/components/services/query/ApiHandlerQuery";
import React from "react";
import Swal from "sweetalert2";
import { formatDate } from "../common/utils";
import ISubCategory from "../types/category";
import AddUpdateCategory from "./AddUpdateSubCategory";

export default function SubCategory() {
  const [open, setOpen] = React.useState(false);
  const [ObjSubCategory, setObjSubCategory] = React.useState<any>();
  const [isEdit, setIsEdit] = React.useState<any>(false);

  const list = useSubCategoryList();

  const showSuccessMessage = store.useState((s) => s.successMessage);
  const isSuccess = store.useState((s) => s.isSuccess);

  async function deleteSubCategoryData(_id: string) {
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
          const res = await useDeleteSubCategory(_id);
          Swal.fire(
            "Deleted!",
            `${res.message ? res.message : "SubCategory Deleted"}`,
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
            title={"SubCategory"}
            columns={[
              {
                title: "Image",
                field: "image",
                render: (item: ISubCategory) => (
                  <div style={{ height: "70px", width: "70px" }}>
                    <img
                      src={item?.image?.url}
                      height={"100%"}
                      width={"100%"}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                ),
              },
              { title: "Title", field: "name" },
              { title: "Status", field: "status" },
              {
                title: "Date",
                field: "createdAt",
                render: (item: ISubCategory) => (
                  <span>{formatDate(item.createdAt)}</span>
                ),
              },
            ]}
            data={list.data}
            setDeleteId={deleteSubCategoryData}
            setOpen={setOpen}
            setObject={setObjSubCategory}
            setIsEdit={setIsEdit}
            isLoading={list.isLoading}
            addButtonTitle={"Add Sub Category"}
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
          ObjSubCategory={ObjSubCategory}
        />
      )}
    </div>
  );
}
