"use client";

import { useState } from "react";
import { Button, Upload, Spin, App } from "antd";
import { UploadOutlined, ReloadOutlined, FileExcelOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
// import {
//   useListPricelist,
//   useCreatePricelist,
//   useUpdatePricelist,
//   uploadFile,
// } from "@/services/cms";
import emptyStateImg from "@/assets/images/empty_state.png";
import pdfLogo from "@/assets/images/pdf_logo.png";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPT_TYPES = ".pdf,.xls,.xlsx,.xlsm,.csv";

function getFileIcon(url: string) {
  const ext = url.split(".").pop()?.toLowerCase();
  const isExcel = ["xls", "xlsx", "xlsm", "csv"].includes(ext || "");
  return isExcel ? (
    <FileExcelOutlined className="text-4xl text-green-600" />
  ) : (
    <img
      src={pdfLogo.src}
      alt="document"
      className="w-14 h-14 object-contain"
    />
  );
}

export default function PricelistTab() {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);

  // const { data: pricelistData, isLoading: isLoadingPricelist } = useListPricelist();
  // const createMutation = useCreatePricelist();
  // const updateMutation = useUpdatePricelist();

  const currentDocument = '';
  const hasDocument = !!currentDocument;

  // const handleFileUpload = async (file: File) => {
  //   if (file.size > MAX_FILE_SIZE_BYTES) {
  //     message.error(`Maximum file size is ${MAX_FILE_SIZE_MB}MB`);
  //     return false;
  //   }

  //   try {
  //     setUploading(true);
  //     message.loading({ content: "Uploading file...", key: "upload" });

  //     const fileUrl = await uploadFile(file);

  //     if (hasDocument && currentDocument) {
  //       await updateMutation.mutateAsync({
  //         id: currentDocument.id,
  //         body: {
  //           imgae: fileUrl,
  //           status: true,
  //         },
  //       });
  //       message.success({ content: "PriceList updated successfully!", key: "upload" });
  //     } else {
  //       await createMutation.mutateAsync({
  //         imgae: fileUrl,
  //       });
  //       message.success({ content: "PriceList uploaded successfully!", key: "upload" });
  //     }
  //   } catch (err: unknown) {
  //     const axErr = err as { response?: { data?: { message?: string } } };
  //     message.error({
  //       content: axErr?.response?.data?.message || "Failed to upload pricelist",
  //       key: "upload",
  //     });
  //   } finally {
  //     setUploading(false);
  //   }

  //   return false;
  // };

  // if (isLoadingPricelist) {
  //   return (
  //     <div className="flex justify-center items-center min-h-[200px]">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  if (!hasDocument) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <img
          src={emptyStateImg.src}
          alt="Empty State"
          className="w-[243px] h-[163px] mb-7"
        />
        <p className="text-lg font-medium text-gray-900 mb-6">
          Upload PriceList to Start!
        </p>
        <Upload
          multiple={false}
          // beforeUpload={handleFileUpload}
          accept={ACCEPT_TYPES}
          showUploadList={false}
          disabled={uploading}
          className="[&_.ant-upload]:block!"
        >
          <div className="rounded-xl border border-dashed border-[#0C43944A] bg-[#AEC9E91A] flex flex-col py-5 items-center justify-center text-center transition-colors hover:border-primary hover:bg-primary/5 cursor-pointer w-[485px]! h-[126px]!">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <UploadOutlined className="text-sm text-primary!" />
            </div>
            <p className="text-base m-0 mb-1">
              Browse your device or <span className="text-primary!">drag n drop</span>
            </p>
            <p className="text-sm text-gray-500 m-0">
              PDF, Excel (.xls, .xlsx, .xlsm, .csv) • Max {MAX_FILE_SIZE_MB}MB
            </p>
          </div>
        </Upload>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4 p-4 w-[551px]! max-w-full h-auto border border-[#D6CFCFA6]! rounded-[14px]">
        {/* <div className="shrink-0 w-[149px] h-[119px] rounded-lg bg-[#EEF2F8] flex items-center justify-center">
          {getFileIcon(currentDocument.imgae)}
        </div> */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-[119px]">
          <div>
            <p className="font-medium text-lg">PriceList Document</p>
            {/* <p className="text-sm text-[#6A6A6A] mt-0.5">
              Uploaded on {dayjs(currentDocument.createdAt).format("DD-MM-YYYY")}
            </p> */}
          </div>
          <div className="flex items-center gap-2">
            <Upload
              multiple={false}
              // beforeUpload={handleFileUpload}
              accept={ACCEPT_TYPES}
              showUploadList={false}
              disabled={uploading}
            >
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                loading={uploading}
                className="rounded-full! h-[36px]!"
              >
                Replace
              </Button>
            </Upload>
          </div>
        </div>
      </div>
    </div>
  );
}
