import React from "react";
import Swal from "sweetalert2";
import DataTable from "../common/DataTable";
import Message from "../common/massage/Message";
import { setSuccess, store } from "../services/pulState/store";
import {
  useColorList,
  useDeleteColor,
} from "../services/query/ApiHandlerQuery";
import AddUpdateColor from "./AddUpdateColor";

export default function Color() {
  const [open, setOpen] = React.useState(false);
  const [ObjColor, setObjColor] = React.useState<any>();
  const [isEdit, setIsEdit] = React.useState<any>(false);

  const list = useColorList();
  const showSuccessMessage = store.useState((s) => s.successMessage);
  const isSuccess = store.useState((s) => s.isSuccess);

  async function deleteColorData(_id: string) {
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
          const res = await useDeleteColor(_id);
          Swal.fire(
            "Deleted!",
            `${res.message ? res.message : "Color Deleted"}`,
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
            title={"Color"}
            columns={[
              {
                title: "Color Name",
                field: "colorName",
              },
              {
                title: "Code",
                field: "colorCode",
                render: (item: any) => (
                  <div
                    style={{
                      backgroundColor: `${item.colorCode} `,
                      width: "30px",
                      height: "30px",
                      border: "1px solid gray",
                    }}
                  ></div>
                ),
              },
            ]}
            data={list.data}
            setDeleteId={deleteColorData}
            setOpen={setOpen}
            setObject={setObjColor}
            setIsEdit={setIsEdit}
            isLoading={list.isLoading}
            addButtonTitle={"Add Color"}
          />
        </div>
      </div>
      {open && (
        <AddUpdateColor
          open={open}
          setOpen={() => {
            setOpen(false);
            list.refetch();
          }}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          ObjColor={ObjColor}
        />
      )}
    </div>
  );
}
