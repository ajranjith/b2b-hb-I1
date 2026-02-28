"use client";

import { Drawer, Form, Input, Button, Upload, App } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { uploadFile } from "@/services/cms";

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export interface ExternalLinkItem {
  id: number;
  title: string;
  link: string;
  image: string;
  thumbnailUrl?: string;
  orderNo: number | null;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

interface AddLinkDrawerProps {
  open: boolean;
  link: ExternalLinkItem | null;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    link: string;
    imageUrl: string;
  }) => void;
  onDelete?: () => void;
}

const AddLinkDrawer: FC<AddLinkDrawerProps> = ({
  open,
  link,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = open && !!link;

  useEffect(() => {
    if (open && link) {
      form.setFieldsValue({
        title: link.title,
        link: link.link,
      });
      setImageUrl(link.image);
      setImagePreview(link.image);
    } else if (open && !link) {
      form.resetFields();
      setImageUrl("");
      setImagePreview("");
    }
  }, [open, link, form]);

  const handleSubmit = async (values: { title: string; link: string }) => {
    const trimmedLink = values.link?.trim() || "";
    if (!trimmedLink) {
      message.warning("Please enter the link URL.");
      return;
    }
    setSubmitting(true);
    try {
      onSubmit({
        title: values.title.trim(),
        link: trimmedLink,
        imageUrl: imageUrl || "",
      });
      message.success(
        isEditMode ? "Link updated successfully!" : "Link added successfully!"
      );
      form.resetFields();
      setImageUrl("");
      setImagePreview("");
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
    setImageUrl("");
    setImagePreview("");
    onClose();
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      message.error(`Maximum file size is ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }
    if (!file.type.startsWith("image/")) {
      message.error("Please upload an image file");
      return false;
    }
    setUploadingImage(true);
    message.loading({ content: "Uploading image...", key: "image" });
    try {
      const url = await uploadFile(file);
      setImageUrl(url);
      setImagePreview(URL.createObjectURL(file));
      message.success({ content: "Image uploaded successfully!", key: "image" });
    } catch (error) {
      message.error({
        content:
          error instanceof Error ? error.message : "Failed to upload image",
        key: "image",
      });
    } finally {
      setUploadingImage(false);
    }
    return false;
  };

  return (
    <Drawer
      title={isEditMode ? "Edit Link" : "Add New Link"}
      width={480}
      placement="right"
      onClose={handleCancel}
      open={open}
      closable
      maskClosable={false}
      className="bg-[#FAFAFA] createdealers"
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
              {isEditMode ? "Update Link" : "Add Link"}
            </Button>
          </div>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-2"
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter the link title" }]}
        >
          <Input placeholder="Enter link title" size="large" />
        </Form.Item>
        <Form.Item
          name="link"
          label="External URL"
          rules={[{ required: true, message: "Please enter the URL" }]}
        >
          <Input placeholder="https://example.com" size="large" />
        </Form.Item>
        <Form.Item label="Thumbnail">
          {!imageUrl ? (
            <Upload
              multiple={false}
              beforeUpload={handleImageUpload}
              accept="image/*"
              showUploadList={false}
              disabled={uploadingImage}
              className="[&_.ant-upload]:block!"
            >
              <div className="rounded-xl border border-dashed p-6 text-center transition-colors border-[#0C43944A] bg-[#AEC9E91A] cursor-pointer hover:border-primary hover:bg-primary/5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-primary mb-3">
                  <UploadOutlined className="text-lg" />
                </div>
                <p className="text-base m-0 mb-1 font-medium">
                  {uploadingImage ? "Uploading..." : "Upload Thumbnail"}
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
                  src={imagePreview}
                  alt="Thumbnail"
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Image uploaded</p>
                  <p className="text-xs text-gray-500">Ready to save</p>
                </div>
                <Upload
                  multiple={false}
                  beforeUpload={handleImageUpload}
                  accept="image/*"
                  showUploadList={false}
                  disabled={uploadingImage}
                >
                  <Button
                    type="primary"
                    size="small"
                    disabled={uploadingImage}
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
};

export default AddLinkDrawer;
