import React from "react";
import Swal from "sweetalert2";
import DataTable from "../common/DataTable";
import Message from "../common/massage/Message";
import { setSuccess, store } from "../services/pulState/store";
import {
  useCarouselList,
  useDeleteCarousel,
} from "../services/query/ApiHandlerQuery";
import AddUpdateCarousel from "./AddUpdateCarousel";

export default function Carousel() {
  const list = useCarouselList();
  const [open, setOpen] = React.useState(false);
  const [objCarousel, setObjCarousel] = React.useState<any>();
  const [isEdit, setIsEdit] = React.useState<any>(false);

  const isSuccess = store.useState((s) => s.isSuccess);
  const showSuccessMessage = store.useState((s) => s.successMessage);
  async function deleteCarouselData(_id: string) {
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
          const res = await useDeleteCarousel(_id);
          Swal.fire(
            "Deleted!",
            `${res.message ? res.message : "Carousel Deleted"}`,
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
            title={"Carousel"}
            columns={[
              {
                title: "Image",
                field: "img",
                render: (item: any) => (
                  <img
                    src={item.imageUrl}
                    height={100}
                    width={200}
                    style={{ objectFit: "fill" }}
                  />
                ),
              },
              { title: "Title", field: "title" },
              { title: "Date", field: "Date" },
            ]}
            data={list.data}
            setDeleteId={deleteCarouselData}
            setOpen={setOpen}
            setObject={setObjCarousel}
            setIsEdit={setIsEdit}
            isLoading={list.isLoading}
            addButtonTitle={"Add Carousel"}
          />
        </div>
      </div>
      {open && (
        <AddUpdateCarousel
          open={open}
          setOpen={() => {
            setOpen(false);
            list.refetch();
          }}
          isEdit={isEdit}
          objCarousel={objCarousel}
        />
      )}
    </div>
  );
}
