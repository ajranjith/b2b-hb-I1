"use client";

import { useState } from "react";
import { Modal, Button, Upload } from "antd";
import type { UploadFile } from "antd";
import { motion } from "framer-motion";
import {
  InboxOutlined,
  CheckCircleOutlined,
  FileAddOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { uploadImportFile } from "@/services/importLog";
import type { FC } from "react";

export type ImportSuccessResult =
  | { isProduct: true; totalRows: number; jobId: number; statusUrl: string }
  | { isProduct: false; totalRows: number; successCount: number; errorCount: number };

interface ImportModalProps {
  open: boolean;
  tabKey: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
  onWarning: (msg: string) => void;
}

const ImportModal: FC<ImportModalProps> = ({
  open,
  tabKey,
  onClose,
  onSuccess,
  onError,
  onWarning,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportSuccessResult | null>(null);

  const handleClose = () => {
    setFileList([]);
    setResult(null);
    onClose();
  };

  const handleUpload = async () => {
    const file = fileList[0]?.originFileObj;
    if (!file) {
      onWarning("Please select a file to upload.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await uploadImportFile(tabKey, file);
      if (res.isProduct) {
        setResult({
          isProduct: true,
          totalRows: res.data.data.totalRows,
          jobId: res.data.data.jobId,
          statusUrl: res.data.data.statusUrl,
        });
        onSuccess();
      } else {
        setResult({
          isProduct: false,
          totalRows: res.data.data.totalRows,
          successCount: res.data.data.successCount,
          errorCount: res.data.data.errorCount,
        });
        onSuccess();
      }
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { errors?: string[] } } };
      const errors = axErr?.response?.data?.errors;
      onError(Array.isArray(errors) ? errors.join(" ") : "Import failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSuccessView = result !== null;
  const hasFile = fileList.length > 0;
  const selectedFile = fileList[0]?.originFileObj;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      centered
      destroyOnHidden
      width={560}
      footer={null}
      closable
      className="import-modal"
      styles={{
        body: { padding: 0 },
        header: { display: "none" },
      }}
      mask={
        {closable: false}
      }
      // maskClosable={false}
    >
      <div className="rounded-xl overflow-hidden bg-white ">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 m-0">Import file</h2>
          <p className="text-sm text-gray-500 mt-1 m-0">
            {isSuccessView
              ? result?.isProduct
                ? "Import submitted — processing in backend"
                : "Import completed"
              : "Upload an Excel or CSV file. Make sure it matches the template for this import type."}
          </p>
        </div>

        <div className="px-6 py-6">
          {isSuccessView ? (
            <div className="flex gap-5">
              <motion.div
                className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center ring-4 ${
                  result.isProduct
                    ? "bg-[#FFF7E6] ring-[#FA8C16]/20"
                    : "bg-[#E6F7D9] ring-[#E6F7D9]/50"
                }`}
                aria-hidden
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  mass: 0.8,
                }}
              >
                {result.isProduct ? (
                  <SyncOutlined className="text-3xl text-[#FA8C16]!" />
                ) : (
                  <CheckCircleOutlined className="text-3xl text-[#389E0D]" />
                )}
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.p
                  className="text-lg font-semibold text-gray-900 m-0 mb-1.5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.12 }}
                >
                  {result.isProduct
                    ? "Processing your import in the background"
                    : "File uploaded successfully"}
                </motion.p>
                <motion.p
                  className="text-sm text-gray-500 m-0 mb-5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.18 }}
                >
                  {result.isProduct
                    ? "Your file has been received. The backend is importing your products—results will appear in this Import log once processing is complete."
                    : "Summary of your import is below."}
                </motion.p>
                <motion.div
                  className={`rounded-xl border p-0 overflow-hidden ${
                    result.isProduct
                      ? "border-primary/30 bg-primary/5"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.25 }}
                >
                  <div className="flex justify-between items-center py-3.5 px-4 text-sm border-b border-gray-100">
                    <span className="text-gray-600 font-normal">Total rows</span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {result.totalRows.toLocaleString()}
                    </span>
                  </div>
                  {result.isProduct && (
                    <div className="flex justify-between items-center py-3.5 px-4 text-sm">
                      <span className="text-gray-600 font-normal">Status</span>
                      <span className="font-medium text-primary inline-flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Processing in backend
                      </span>
                    </div>
                  )}
                  {!result.isProduct && (
                    <>
                      <div className="flex justify-between items-center py-3.5 px-4 text-sm border-b border-gray-100">
                        <span className="text-gray-600 font-normal">Successful</span>
                        <span className="font-semibold text-[#389E0D] tabular-nums">
                          {result.successCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3.5 px-4 text-sm">
                        <span className="text-gray-600 font-normal">Errors</span>
                        <span className="font-semibold text-[#F5222D] tabular-nums">
                          {result.errorCount.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          ) : hasFile && selectedFile ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileDoneOutlined className="text-2xl text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate m-0" title={selectedFile.name}>
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 m-0 mt-0.5">
                    {formatFileSize(selectedFile.size)}
                  </p>
                  <p className="text-xs text-gray-400 m-0 mt-0.5">
                    Max 100MB • Excel or CSV files only
                  </p>
                </div>
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => setFileList([])}
                  className="shrink-0 -mr-1"
                  aria-label="Remove file"
                />
              </div>
              <div className="px-4 pb-4 pt-0">
                <Upload
                  multiple={false}
                  fileList={fileList}
                  onChange={({ fileList: next }) => setFileList(next.slice(-1))}
                  beforeUpload={() => false}
                  accept=".xlsx,.xls,.csv"
                  showUploadList={false}
                  className="[&_.ant-upload]:block!"
                >
                  <Button type="link" size="small" className="px-0 h-auto text-primary font-normal">
                    Choose another file
                  </Button>
                </Upload>
              </div>
            </div>
          ) : (
            <Upload
              multiple={false}
              fileList={fileList}
              onChange={({ fileList: next }) => setFileList(next.slice(-1))}
              beforeUpload={() => false}
              accept=".xlsx,.xls,.csv"
              showUploadList={false}
              className="[&_.ant-upload]:block!"
            >
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-10 text-center transition-colors hover:border-primary hover:bg-primary/5 cursor-pointer">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                  <FileAddOutlined className="text-3xl" />
                </div>
                <p className="text-base font-medium text-gray-900 m-0 mb-1">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-sm text-gray-500 m-0 mb-1">
                  .xlsx, .xls, or .csv — one file only
                </p>
                <p className="text-xs text-gray-400 m-0 mb-4">
                  Max 100MB • Excel or CSV files only
                </p>
                <Button type="default" icon={<InboxOutlined />} size="middle" className="rounded-full">
                  Choose file
                </Button>
              </div>
            </Upload>
          )}
        </div>

        <div className=" border-t border-gray-100 flex justify-end gap-3 px-6 py-4">
          {isSuccessView ? (
            <Button
              type="primary"
              onClick={handleClose}
              className="rounded-full! h-10! px-6 font-medium w-full!"
            >
              Done
            </Button>
          ) : (
            <>
              <Button onClick={handleClose} className="rounded-full! h-10! px-6 w-1/2!">
                Cancel
              </Button>
              <Button
                type="primary"
                loading={loading}
                onClick={handleUpload}
                disabled={fileList.length === 0}
                className="rounded-full! h-10! px-6 font-medium w-1/2!"
              >
                Upload
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;
