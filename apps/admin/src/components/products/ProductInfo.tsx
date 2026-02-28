"use client";

import { Drawer, Descriptions, Tag, Button, Spin } from "antd";
import type { DrawerProps } from "antd";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetProduct, type IProductAdminData } from "@/services/product";
import type { FC } from "react";

interface ProductInfoProps {
  open: boolean;
  onClose: () => void;
  productData: IProductAdminData | null;
  onEdit: () => void;
  placement?: DrawerProps["placement"];
}

const ProductInfo: FC<ProductInfoProps> = ({
  open,
  onClose,
  productData,
  onEdit,
  placement = "right",
}) => {
  const productId = productData ? productData.id : 0;
  const { data, isLoading } = useGetProduct(productId, {
    enabled: open && !!productId,
  });

  const product = data?.data;

  const getTypeTag = (type: string) => {
    const typeColors: Record<string, string> = {
      Genuine: "blue",
      Aftermarket: "green",
      Branded: "purple",
    };
    return <Tag color={typeColors[type] || "default"}>{type}</Tag>;
  };

  const formatPrice = (value: number) => `£${value.toFixed(2)}`;

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between pr-8">
          <span>Product Details</span>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={onEdit}
            className="rounded-[33px]! h-[38px]!"
          >
            Edit Product
          </Button>
        </div>
      }
      width={700}
      placement={placement}
      onClose={onClose}
      open={open}
      closable
    >
      <Spin spinning={isLoading}>
        {product && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold mb-4 text-gray-900">Basic Information</h3>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Product Code">
                  <span className="font-mono font-semibold">{product.code}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Product Name">{product.name}</Descriptions.Item>
                <Descriptions.Item label="Type">{getTypeTag(product.type)}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={product.status ? "green" : "red"}>
                    {product.status ? "Active" : "Inactive"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-4 text-gray-900">Stock Information</h3>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Available Stock">
                  <span className="font-semibold text-lg">
                    {product.stock?.stock ?? 0} units
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </div>
            {(product.weight || product.length || product.width || product.height) && (
              <div>
                <h3 className="text-base font-semibold mb-4 text-gray-900">Product Dimensions</h3>
                <Descriptions bordered column={2} size="small">
                  {product.weight && (
                    <Descriptions.Item label="Weight">
                      <span className="font-semibold">{product.weight.toFixed(2)} kg</span>
                    </Descriptions.Item>
                  )}
                  {product.length && (
                    <Descriptions.Item label="Length">
                      <span className="font-semibold">{product.length.toFixed(1)} cm</span>
                    </Descriptions.Item>
                  )}
                  {product.width && (
                    <Descriptions.Item label="Width">
                      <span className="font-semibold">{product.width.toFixed(1)} cm</span>
                    </Descriptions.Item>
                  )}
                  {product.height && (
                    <Descriptions.Item label="Height">
                      <span className="font-semibold">{product.height.toFixed(1)} cm</span>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold mb-4 text-gray-900">
                Pricing Information ({product.price?.currency || "GBP"})
              </h3>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Retail Price (T)">
                  {formatPrice(product.price?.net1 ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Trade Price (N1)">
                  {formatPrice(product.price?.net2 ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Band 1 (N2)">
                  {formatPrice(product.price?.net3 ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Band 2 (N3)">
                  {formatPrice(product.price?.net4 ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Band 3 (N4)">
                  {formatPrice(product.price?.net5 ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Band 4 (N5)">
                  {formatPrice(product.price?.net6 ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="List Price (L)" span={2}>
                  {formatPrice(product.price?.net7 ?? 0)}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-4 text-gray-900">System Information</h3>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Created At">
                  {dayjs(product.createdAt).format("DD-MM-YYYY, hh:mmA")}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {dayjs(product.updatedAt).format("DD-MM-YYYY, hh:mmA")}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )}
      </Spin>
    </Drawer>
  );
};

export { ProductInfo };
