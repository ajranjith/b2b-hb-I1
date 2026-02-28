"use client";

import { Drawer, Form, Input, Button, Upload, App, Segmented } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { uploadFile, type BannerType } from "@/services/cms";

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export interface BannerItem {
  id: number;
  type: BannerType;
  title: string;
  description: string;
  imgae: string;
  imageUrl?: string;
  orderNo: number | null;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  link?: string;
}

interface AddBannerDrawerProps {
  open: boolean;
  banner: BannerItem | null;
  onClose: () => void;
  onSubmit: (values: {
    type: BannerType;
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
  }) => void;
  onDelete?: () => void;
}

const AddBannerDrawer: FC<AddBannerDrawerProps> = ({
  open,
  banner,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [bannerType, setBannerType] = useState<BannerType>("Horizontal");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = open && !!banner;

  useEffect(() => {
    if (open && banner) {
      setBannerType(banner.type || "Horizontal");
      form.setFieldsValue({
        title: banner.title,
        description: banner.description,
        link: banner.link,
      });
      setImageUrl(banner.imgae || banner.imageUrl || "");
      setImagePreview(banner.imgae || banner.imageUrl || "");
    } else if (open && !banner) {
      setBannerType("Horizontal");
      form.resetFields();
      setImageUrl("");
      setImagePreview("");
    }
  }, [open, banner, form]);

  const handleSubmit = async (values: {
    title: string;
    description: string;
    link?: string;
  }) => {
    if (!imageUrl) {
      message.warning("Please upload an image.");
      return;
    }
    setSubmitting(true);
    try {
      onSubmit({
        type: bannerType,
        title: values.title.trim(),
        description: values.description?.trim() ?? "",
        imageUrl,
        link: values.link?.trim() || undefined,
      });
      message.success(
        isEditMode ? "Banner updated successfully!" : "Banner added successfully!"
      );
      form.resetFields();
      setBannerType("Horizontal");
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
    setBannerType("Horizontal");
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
      title={isEditMode ? "Edit Banner" : "Add New Banner"}
      width={480}
      placement="right"
      onClose={handleCancel}
      open={open}
      closable
      maskClosable={false}
      className="bg-[#FAFAFA]"
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
              {isEditMode ? "Update Banner" : "Add Banner"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="my-4 px-4">
        <Segmented
          value={bannerType}
          onChange={(value) => setBannerType(value as BannerType)}
          options={[
            { label: "Horizontal", value: "Horizontal" },
            { label: "Vertical", value: "Vertical" },
          ]}
          block
          size="large"
        />
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-2 px-4"
      >
        <Form.Item label="Image" required={!isEditMode}>
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
                  {uploadingImage ? "Uploading..." : "Upload Banner Image"}
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
              <div className="flex flex-col gap-3">
                <img
                  src={imagePreview}
                  alt="Banner"
                  className="w-full h-auto max-h-48 object-cover rounded"
                />
                <div className="flex items-center justify-between">
                  <div>
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
            </div>
          )}
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter the banner title" }]}
        >
          <Input placeholder="Enter banner title" size="large" />
        </Form.Item>
        <Form.Item
          name="link"
          label={
            <span className="flex items-center gap-2 ml-1">
              Link <span className="text-sm text-[#929292]"> (Optional)</span>
            </span>
          }
        >
          <Input placeholder="Enter link" size="large" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input.TextArea
            placeholder="Enter description"
            rows={4}
            size="large"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddBannerDrawer;
