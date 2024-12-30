import React from "react";
import Swal from "sweetalert2";
import DataTable from "../common/DataTable";
import Message from "../common/massage/Message";
import { setSuccess, store } from "../services/pulState/store";
import { useDeleteSize, useSizeList } from "../services/query/ApiHandlerQuery";
import { ISize } from "../types/colorAndSize";
import AddUpdateSize from "./AddUpdateSize";

export default function Size() {
  const list = useSizeList();
  const [open, setOpen] = React.useState(false);
  const [objSize, setObjSize] = React.useState<ISize>();
  const [isEdit, setIsEdit] = React.useState<any>(false);

  const isSuccess = store.useState((s) => s.isSuccess);
  const showSuccessMessage = store.useState((s) => s.successMessage);
  async function deleteSizeData(_id: string) {
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
          const res = await useDeleteSize(_id);
          Swal.fire(
            "Deleted!",
            `${res.message ? res.message : "Size Deleted"}`,
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
            title={"Sizes"}
            columns={[
              { title: "Size", field: "sizeName" },
              { title: "Date", field: "Date" },
            ]}
            data={list.data}
            setDeleteId={deleteSizeData}
            setOpen={setOpen}
            setObject={setObjSize}
            setIsEdit={setIsEdit}
            isLoading={list.isLoading}
            addButtonTitle={"Add Size"}
          />
        </div>
      </div>
      {open && (
        <AddUpdateSize
          open={open}
          setOpen={() => {
            setOpen(false);
            list.refetch();
          }}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          objSize={objSize}
        />
      )}
    </div>
  );
}
