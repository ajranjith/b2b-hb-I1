"use client";

import { Drawer, Form, Input, Button, Upload, App, Segmented, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { uploadFile, type NewsOfferTypeApi } from "@/services/cms";
import RichTextEditor from "./RichTextEditor";

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export type NewsOfferType = "news" | "offers" | "pricelist";

export interface NewsOfferItem {
  id: number;
  type: NewsOfferTypeApi;
  title: string;
  description: string | null;
  longDescription: string | null;
  thumbnail: string;
  fileUpload: string | null;
  subtext: string | null;
  orderNo: number | null;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  fromDate?: string | null;
  toDate?: string | null;
}

function toApiType(t: NewsOfferType): NewsOfferTypeApi {
  switch (t) {
    case "news":
      return "News";
    case "offers":
      return "Offers";
    case "pricelist":
      return "PriceList";
    default:
      return "News";
  }
}

interface AddNewsOfferDrawerProps {
  open: boolean;
  item: NewsOfferItem | null;
  defaultType?: NewsOfferType;
  onClose: () => void;
  onSubmit: (values: {
    type: NewsOfferTypeApi;
    title: string;
    description: string;
    longDescription: string;
    thumbnailUrl: string;
    fileUploadUrl: string;
    subtext: string;
    fromDate: string;
    toDate?: string;
  }) => void;
  onDelete?: () => void;
}

const AddNewsOfferDrawer: FC<AddNewsOfferDrawerProps> = ({
  open,
  item,
  defaultType = "news",
  onClose,
  onSubmit,
  onDelete,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState<NewsOfferType>("news");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [fileUploadUrl, setFileUploadUrl] = useState<string>("");
  const [fileUploadName, setFileUploadName] = useState<string>("");
  const [longDescription, setLongDescription] = useState<string>("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = open && !!item;

  useEffect(() => {
    if (open && item) {
      setActiveTab(
        item.type === "News"
          ? "news"
          : item.type === "Offers"
            ? "offers"
            : "pricelist"
      );
      form.setFieldsValue({
        title: item.title,
        description: item.description ?? "",
        longDescription: item.longDescription ?? "",
        subtext: item.subtext ?? "",
        fromDate: item.fromDate ? dayjs(item.fromDate) : dayjs(),
        toDate: item.toDate ? dayjs(item.toDate) : null,
      });
      setThumbnailUrl(item.thumbnail);
      setFileUploadUrl(item.fileUpload || "");
      setFileUploadName(
        item.fileUpload
          ? item.fileUpload.split("/").pop()?.split("?")[0] || "Uploaded file"
          : ""
      );
      setLongDescription(item.longDescription ?? "");
    }
    if (open && !item) {
      form.resetFields();
      setActiveTab(defaultType);
      form.setFieldsValue({ fromDate: dayjs(), toDate: null });
      setThumbnailUrl("");
      setFileUploadUrl("");
      setFileUploadName("");
      setLongDescription("");
    }
  }, [open, item, form, defaultType]);

  const handleSubmit = async (values: {
    title: string;
    description: string;
    subtext: string;
    fromDate: dayjs.Dayjs;
    toDate?: dayjs.Dayjs;
    longDescription: string;
  }) => {
    if (!thumbnailUrl) {
      message.warning("Please upload a thumbnail image.");
      return;
    }
    setSubmitting(true);
    try {
      console.log(values.longDescription, "---values.longDescription")

      onSubmit({
        type: toApiType(activeTab),
        title: values.title.trim(),
        description: values.description?.trim() ?? "",
        longDescription: values.longDescription?.trim() ?? "",
        thumbnailUrl,
        fileUploadUrl: fileUploadUrl || "",
        subtext: values.subtext?.trim() ?? "",
        fromDate: values.fromDate.format("YYYY-MM-DD HH:mm:ss"),
        toDate: values.toDate ? values.toDate.format("YYYY-MM-DD HH:mm:ss") : undefined,
      });
      message.success(
        isEditMode ? "Item updated successfully!" : "Saved and added successfully!"
      );
      form.resetFields();
      setThumbnailUrl("");
      setFileUploadUrl("");
      setFileUploadName("");
      setLongDescription("");
      onClose();
    } catch (e) {
      message.error(
        e instanceof Error ? e.message : "Failed to save. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setThumbnailUrl("");
    setFileUploadUrl("");
    setFileUploadName("");
    onClose();
  };

  const handleThumbnailUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      message.error(`Maximum file size is ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }
    if (!file.type.startsWith("image/")) {
      message.error("Please upload an image file");
      return false;
    }
    setUploadingThumbnail(true);
    message.loading({ content: "Uploading thumbnail...", key: "thumbnail" });
    try {
      const url = await uploadFile(file);
      setThumbnailUrl(url);
      message.success({ content: "Thumbnail uploaded successfully!", key: "thumbnail" });
    } catch (error) {
      message.error({
        content: error instanceof Error ? error.message : "Failed to upload thumbnail",
        key: "thumbnail",
      });
    } finally {
      setUploadingThumbnail(false);
    }
    return false;
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      message.error(`Maximum file size is ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }
    setUploadingFile(true);
    message.loading({ content: "Uploading file...", key: "file" });
    try {
      const url = await uploadFile(file);
      setFileUploadUrl(url);
      setFileUploadName(file.name);
      message.success({ content: "File uploaded successfully!", key: "file" });
    } catch (error) {
      message.error({
        content: error instanceof Error ? error.message : "Failed to upload file",
        key: "file",
      });
    } finally {
      setUploadingFile(false);
    }
    return false;
  };

  return (
    <Drawer
      title={isEditMode ? "Edit" : "Add New"}
      width={480}
      placement="right"
      onClose={handleCancel}
      open={open}
      closable
      maskClosable={false}
      className="bg-[#FAFAFA] add-news-offer-drawer"
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          {isEditMode && onDelete ? (
            <Button
              danger
              onClick={onDelete}
              disabled={submitting}
              className="rounded-[38px]! h-[42px]! px-6"
            >
              Delete
            </Button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCancel}
              disabled={submitting}
              className="rounded-[38px]! h-[42px]! px-6 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              loading={submitting}
              className="rounded-[38px]! h-[42px]! px-6"
              onClick={() => form.submit()}
            >
              Save & Add
            </Button>
          </div>
        </div>
      }
    >
      <div className="my-4 px-4">
        <Segmented
          value={activeTab}
          onChange={(value) => setActiveTab(value as NewsOfferType)}
          options={[
            { label: "News", value: "news" },
            { label: "Offers", value: "offers" },
            { label: "PriceList", value: "pricelist" },
          ]}
          block
          size="large"
        />
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-2 py-3.5! px-4!"
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input placeholder="Enter the title" size="large" />
        </Form.Item>
        <Form.Item name="description" label="Short Description">
          <Input placeholder="Enter a short description" size="large" />
        </Form.Item>
        <Form.Item name="subtext" label="Tag/Label">
          <Input placeholder="e.g., Hot Deal, Breaking News" size="large" />
        </Form.Item>
        <Form.Item name="longDescription" label="Long Description">
          <RichTextEditor value={longDescription} onChange={setLongDescription} />
        </Form.Item>
        <div className="flex gap-3 w-full">
          <Form.Item
            name="fromDate"
            label="From date"
            className="w-1/2"
            rules={[{ required: true, message: "Please select from date" }]}
          >
            <DatePicker
              className="w-full"
              size="large"
              showTime={{ format: "hh:mm A" }}
              format="DD-MM-YYYY hh:mm A"
              disabledDate={(current) => {
                const to = form.getFieldValue("toDate");
                return to ? current && current.isAfter(to, "day") : false;
              }}
            />
          </Form.Item>
          <Form.Item name="toDate" label="To date" className="w-1/2">
            <DatePicker
              className="w-full"
              size="large"
              showTime={{ format: "hh:mm A" }}
              format="DD-MM-YYYY hh:mm A"
              disabledDate={(current) => {
                const from = form.getFieldValue("fromDate");
                return from ? current && current.isBefore(from, "day") : false;
              }}
            />
          </Form.Item>
        </div>
        <Form.Item label="Thumbnail Image" required={!isEditMode}>
          {!thumbnailUrl ? (
            <Upload
              multiple={false}
              beforeUpload={handleThumbnailUpload}
              accept="image/*"
              showUploadList={false}
              disabled={uploadingThumbnail}
              className="[&_.ant-upload]:block!"
            >
              <div className="rounded-xl border border-dashed p-6 text-center transition-colors border-[#0C43944A] bg-[#AEC9E91A] cursor-pointer hover:border-primary hover:bg-primary/5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-primary mb-3">
                  <UploadOutlined className="text-lg" />
                </div>
                <p className="text-base m-0 mb-1 font-medium">
                  {uploadingThumbnail ? "Uploading..." : "Upload Thumbnail"}
                </p>
                <p className="text-sm m-0 mb-1">
                  Click or <span className="text-primary!">drag n drop</span>
                </p>
                <p className="text-xs text-gray-500 m-0">
                  Max {MAX_FILE_SIZE_MB}MB • Image files only
                </p>
              </div>
            </Upload>
          ) : (
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Thumbnail uploaded</p>
                  <p className="text-xs text-gray-500">Ready to save</p>
                </div>
                <Upload
                  multiple={false}
                  beforeUpload={handleThumbnailUpload}
                  accept="image/*"
                  showUploadList={false}
                  disabled={uploadingThumbnail}
                >
                  <Button
                    type="primary"
                    size="small"
                    disabled={uploadingThumbnail}
                    icon={<UploadOutlined />}
                  >
                    Upload
                  </Button>
                </Upload>
              </div>
            </div>
          )}
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Please upload a file" }]}
          label="File Upload"
          help="Upload a PDF or document for download"
        >
          {!fileUploadUrl ? (
            <Upload
              multiple={false}
              beforeUpload={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,image/*"
              showUploadList={false}
              disabled={uploadingFile}
              className="[&_.ant-upload]:block!"
            >
              <div className="rounded-xl border border-dashed p-6 text-center transition-colors border-[#0C43944A] bg-[#AEC9E91A] cursor-pointer hover:border-primary hover:bg-primary/5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-primary mb-3">
                  <UploadOutlined className="text-lg" />
                </div>
                <p className="text-base m-0 mb-1 font-medium">
                  {uploadingFile ? "Uploading..." : "Upload File"}
                </p>
                <p className="text-sm m-0 mb-1">
                  Click or <span className="text-primary!">drag n drop</span>
                </p>
                <p className="text-xs text-gray-500 m-0">
                  Max {MAX_FILE_SIZE_MB}MB • PDF, DOC, Excel, CSV, Images
                </p>
              </div>
            </Upload>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded bg-primary/10 text-primary font-semibold text-xs uppercase shrink-0">
                  {fileUploadName
                    ? `.${fileUploadName.split(".").pop()?.toUpperCase() || "FILE"}`
                    : "FILE"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileUploadName}
                  </p>
                  <p className="text-xs text-gray-500">File uploaded successfully</p>
                </div>
                <Upload
                  multiple={false}
                  beforeUpload={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,image/*"
                  showUploadList={false}
                  disabled={uploadingFile}
                >
                  <Button
                    type="primary"
                    size="small"
                    disabled={uploadingFile}
                    icon={<UploadOutlined />}
                  >
                    Upload
                  </Button>
                </Upload>
              </div>
            </div>
          )}
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default AddNewsOfferDrawer;
