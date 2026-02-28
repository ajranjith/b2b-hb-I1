"use client";

import { Drawer, Form, Input, Select, InputNumber, Button, App, Upload } from "antd";
import type { DrawerProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  useUpdateProduct,
  useGetProduct,
  type IProductAdminData,
  type ProductType,
} from "@/services/product";
import { uploadFile } from "@/services/cms";
import type { FC } from "react";
import { useEffect, useState } from "react";

interface EditProductProps {
  open: boolean;
  onClose: () => void;
  productData: IProductAdminData | null;
  placement?: DrawerProps["placement"];
}

export const EditProduct: FC<EditProductProps> = ({
  open,
  onClose,
  productData,
  placement = "right",
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const productId = productData ? productData.id : 0;
  const { data } = useGetProduct(productId, { enabled: open && !!productId });

  const updateProductMutation = useUpdateProduct({
    onSuccess: () => {
      message.success("Product updated successfully!");
      form.resetFields();
      onClose();
    },
  });

  useEffect(() => {
    if (open && data?.data) {
      const product = data.data;
      form.setFieldsValue({
        name: product.name,
        type: product.type,
        stock: product.stock?.stock ?? 0,
        net1: product.price?.net1 ?? 0,
        net2: product.price?.net2 ?? 0,
        net3: product.price?.net3 ?? 0,
        net4: product.price?.net4 ?? 0,
        net5: product.price?.net5 ?? 0,
        net6: product.price?.net6 ?? 0,
        net7: product.price?.net7 ?? 0,
        weight: product.weight ?? null,
        length: product.length ?? null,
        width: product.width ?? null,
        height: product.height ?? null,
      });
      setImageUrl(product.image || "");
      setImagePreview(product.image || "");
    } else if (open && !data) {
      setImageUrl("");
      setImagePreview("");
    }
  }, [open, data, form]);

  const handleSubmit = (values: {
    name: string;
    type: ProductType;
    stock: number;
    net1: number;
    net2: number;
    net3: number;
    net4: number;
    net5: number;
    net6: number;
    net7: number;
    weight?: number | null;
    length?: number | null;
    width?: number | null;
    height?: number | null;
  }) => {
    if (!productId) return;
    updateProductMutation.mutate({
      id: productId,
      data: { ...values, image: imageUrl || null },
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setImageUrl("");
    setImagePreview("");
    onClose();
  };

  const handleImageUpload = async (file: File) => {
    const MAX_FILE_SIZE_MB = 2;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
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
        content: error instanceof Error ? error.message : "Failed to upload image",
        key: "image",
      });
    } finally {
      setUploadingImage(false);
    }
    return false;
  };

  const typeOptions: Array<{ label: string; value: ProductType }> = [
    { label: "Genuine", value: "Genuine" },
    { label: "Aftermarket", value: "Aftermarket" },
    { label: "Branded", value: "Branded" },
  ];

  const isPending = updateProductMutation.isPending;

  return (
    <Drawer
      title="Edit Product"
      width={600}
      placement={placement}
      onClose={handleCancel}
      open={open}
      closable
      className="bg-[#FAFAFA]"
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 overflow-y-auto px-1 -mx-1">
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h3>
              <Form.Item label="Product Code" className="mb-3">
                <Input
                  size="large"
                  value={data?.data?.code}
                  disabled
                  className="bg-white font-mono font-semibold"
                />
              </Form.Item>
              <Form.Item label="Product Image" className="mb-3">
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
                        {uploadingImage ? "Uploading..." : "Upload Product Image"}
                      </p>
                      <p className="text-sm m-0 mb-1">
                        Click or <span className="text-primary!">drag n drop</span>
                      </p>
                      <p className="text-xs text-gray-500 m-0">Max 2MB • Image files only</p>
                    </div>
                  </Upload>
                ) : (
                  <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Product"
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
                        <Button type="primary" size="small" disabled={uploadingImage} icon={<UploadOutlined />}>
                          Change
                        </Button>
                      </Upload>
                    </div>
                  </div>
                )}
              </Form.Item>
              <Form.Item
                label="Product Name"
                name="name"
                className="mb-3"
                rules={[{ required: true, message: "Please enter product name" }]}
              >
                <Input size="large" placeholder="Enter product name" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Product Type"
                  name="type"
                  className="mb-0"
                  rules={[{ required: true, message: "Please select product type" }]}
                >
                  <Select size="large" placeholder="Select type" options={typeOptions} />
                </Form.Item>
                <Form.Item
                  label="Stock Quantity"
                  name="stock"
                  className="mb-0"
                  rules={[{ required: true, message: "Please enter stock quantity" }]}
                >
                  <InputNumber size="large" min={0} placeholder="0" className="w-full" addonAfter="units" />
                </Form.Item>
              </div>
            </div>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Dimensions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item label="Weight (kg)" name="weight" className="mb-0">
                  <InputNumber size="large" min={0} step={0.01} placeholder="0.00" className="w-full" addonAfter="kg" />
                </Form.Item>
                <Form.Item label="Length (cm)" name="length" className="mb-0">
                  <InputNumber size="large" min={0} step={0.1} placeholder="0.0" className="w-full" addonAfter="cm" />
                </Form.Item>
                <Form.Item label="Width (cm)" name="width" className="mb-0">
                  <InputNumber size="large" min={0} step={0.1} placeholder="0.0" className="w-full" addonAfter="cm" />
                </Form.Item>
                <Form.Item label="Height (cm)" name="height" className="mb-0">
                  <InputNumber size="large" min={0} step={0.1} placeholder="0.0" className="w-full" addonAfter="cm" />
                </Form.Item>
              </div>
            </div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Pricing Tiers (GBP)</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <Form.Item label="Retail Price (T)" name="net1" className="mb-0 w-full!" rules={[{ required: true, message: "Required" }]}>
                    <InputNumber size="large" min={0} step={0.01} prefix="£" placeholder="0.00" className="w-full!" />
                  </Form.Item>
                  <Form.Item label="Trade Price (N1)" name="net2" className="mb-0 w-full!" rules={[{ required: true, message: "Required" }]}>
                    <InputNumber size="large" min={0} step={0.01} prefix="£" placeholder="0.00" className="w-full!" />
                  </Form.Item>
                  <Form.Item label="Band 1 (N2)" name="net3" className="mb-0" rules={[{ required: true, message: "Required" }]}>
                    <InputNumber size="large" min={0} step={0.01} prefix="£" placeholder="0.00" className="w-full!" />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Form.Item label="Band 2 (N3)" name="net4" className="mb-0 w-full!" rules={[{ required: true, message: "Required" }]}>
                    <InputNumber size="large" min={0} step={0.01} prefix="£" placeholder="0.00" className="w-full!" />
                  </Form.Item>
                  <Form.Item label="Band 3 (N4)" name="net5" className="mb-0 w-full!" rules={[{ required: true, message: "Required" }]}>
                    <InputNumber size="large" min={0} step={0.01} prefix="£" placeholder="0.00" className="w-full!" />
                  </Form.Item>
                  <Form.Item label="Band 4 (N5)" name="net6" className="mb-0" rules={[{ required: true, message: "Required" }]}>
                    <InputNumber size="large" min={0} step={0.01} prefix="£" placeholder="0.00" className="w-full!" />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Form.Item label="List Price (L)" name="net7" className="mb-0" rules={[{ required: true, message: "Required" }]}>
                    <InputNumber size="large" min={0} step={0.01} prefix="£" placeholder="0.00" className="w-full!" />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 pt-4 pb-2 mt-4 -mx-6 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between gap-3 w-full">
            <Button onClick={handleCancel} className="w-1/2 rounded-[38px]! h-[42px]!" disabled={isPending}>
              Cancel
            </Button>
            <Button type="primary" className="w-1/2 rounded-[38px]! h-[42px]!" onClick={() => form.submit()} loading={isPending}>
              Submit & Update
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
