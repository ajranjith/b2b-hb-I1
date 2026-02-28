"use client";

import { Drawer, Form, Input, Button, App, Dropdown, Space } from "antd";
import type { DrawerProps, MenuProps } from "antd";
import { DownOutlined, CheckCircleFilled } from "@ant-design/icons";
import {
  useCreateAdmin,
  useUpdateAdmin,
  useUpdateAdminStatus,
  type ICreateAdminRequest,
  type IAdminData,
  type IUpdateAdminRequest,
} from "@/services/admin";
import type { FC } from "react";
import { useEffect, useState } from "react";

interface CreateAdminProps {
  open: boolean;
  onClose: () => void;
  initialData?: IAdminData | null;
  placement?: DrawerProps["placement"];
}

export const CreateAdmin: FC<CreateAdminProps> = ({
  open,
  onClose,
  initialData = null,
  placement = "right",
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const isEditMode = Boolean(initialData);
  const [currentStatus, setCurrentStatus] = useState<boolean>(true);

  const createAdminMutation = useCreateAdmin({
    onSuccess: () => {
      message.success("Admin user created successfully!");
      form.resetFields();
      onClose();
    },
    onError: (error: any) => {
      const apiCode = error?.response?.data?.code;
  
      if (apiCode === "EMAIL_CONFLICT") {
        form.setFields([
          {
            name: "email",
            errors: ["This email address is already in use."],
          },
        ]);
      } else {
        message.error("Failed to create admin user");
      }
    },
  });

  const updateAdminMutation = useUpdateAdmin({
    onSuccess: () => {
      message.success("Admin user updated successfully!");
      form.resetFields();
      onClose();
    },
  });

  const updateStatusMutation = useUpdateAdminStatus({
    onSuccess: () => {
      message.success("Admin status updated successfully!");
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        firstName: initialData.firstName,
        lastName: initialData.lastName ?? "",
        email: initialData.email,
      });
      setCurrentStatus(initialData.status);
    } else if (open && !initialData) {
      form.resetFields();
      setCurrentStatus(true);
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: {
    firstName: string;
    lastName?: string;
    email: string;
    password?: string;
  }) => {
    if (isEditMode && initialData) {
      const payload: IUpdateAdminRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      };
      updateAdminMutation.mutate({ id: initialData.id, data: payload });
    } else {
      if (!values.password) {
        message.error("Password is required");
        return;
      }
      const payload: ICreateAdminRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };
      createAdminMutation.mutate(payload);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleStatusChange = (status: boolean) => {
    if (!initialData) return;
    updateStatusMutation.mutate(
      { id: initialData.id, data: { status } },
      { onSuccess: () => setCurrentStatus(status) }
    );
  };

  const getStatusColor = (status: boolean) => (status ? "green" : "red");
  const getStatusText = (status: boolean) => (status ? "Active" : "Inactive");

  const statusMenuItems: MenuProps["items"] = [
    {
      key: "true",
      label: (
        <div className="flex items-center justify-between min-w-[140px] py-1">
          <Space size={8}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#52c41a" }} />
            <span className="font-medium">Active</span>
          </Space>
          {currentStatus === true && (
            <CheckCircleFilled className="text-green-500 ml-3" style={{ fontSize: "14px" }} />
          )}
        </div>
      ),
      onClick: () => handleStatusChange(true),
    },
    {
      key: "false",
      label: (
        <div className="flex items-center justify-between min-w-[140px] py-1">
          <Space size={8}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ff4d4f" }} />
            <span className="font-medium">Inactive</span>
          </Space>
          {currentStatus === false && (
            <CheckCircleFilled className="text-green-500 ml-3" style={{ fontSize: "14px" }} />
          )}
        </div>
      ),
      onClick: () => handleStatusChange(false),
    },
  ];

  const isPending = createAdminMutation.isPending || updateAdminMutation.isPending;

  return (
    <Drawer
      title={isEditMode ? "Edit Admin User" : "Add New Admin User"}
      width={600}
      placement={placement}
      onClose={handleCancel}
      open={open}
      closable
      className="bg-[#FAFAFA] createadmin"
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 overflow-y-auto px-1 -mx-1">
          {isEditMode && (
            <div className="mb-6 p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Account Status</h3>
                  <p className="text-xs text-gray-500">Manage admin user access and permissions</p>
                </div>
                <div className="flex-shrink-0">
                  <Dropdown
                    menu={{ items: statusMenuItems }}
                    trigger={["click"]}
                    disabled={updateStatusMutation.isPending}
                    placement="bottomRight"
                  >
                    <Button
                      size="large"
                      className="min-w-[140px] h-10 font-medium border-2 hover:scale-105 transition-transform"
                      style={{
                        borderColor: getStatusColor(currentStatus) === "green" ? "#52c41a" : "#ff4d4f",
                        color: getStatusColor(currentStatus) === "green" ? "#52c41a" : "#ff4d4f",
                      }}
                    >
                      <Space className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                getStatusColor(currentStatus) === "green" ? "#52c41a" : "#ff4d4f",
                            }}
                          />
                          {getStatusText(currentStatus)}
                        </span>
                        <DownOutlined style={{ fontSize: "10px" }} />
                      </Space>
                    </Button>
                  </Dropdown>
                </div>
              </div>
            </div>
          )}

          <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
            <div className="flex gap-4">
              <Form.Item
                label="First Name"
                name="firstName"
                className="mb-3 w-1/2"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input size="large" placeholder="Enter first name" />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
                className="mb-3 w-1/2"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input size="large" placeholder="Enter last name" />
              </Form.Item>
            </div>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter Email"
                readOnly={isEditMode}
                className={isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}
              />
            </Form.Item>

            {!isEditMode && (
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                  { max: 20, message: "Password must be at most 20 characters" },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/,
                    message:
                      "Password must contain at least one lowercase letter, one uppercase letter, and one special character",
                  },
                ]}
              >
                <Input.Password size="large" placeholder="Enter Password" />
              </Form.Item>
            )}
          </Form>
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 pt-4 pb-2 mt-4 -mx-6 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between gap-3 w-full">
            <Button onClick={handleCancel} className="w-1/2 rounded-[38px]! h-[42px]!" disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="primary"
              className="w-1/2 rounded-[38px]! h-[42px]!"
              onClick={() => form.submit()}
              loading={isPending}
            >
              {isEditMode ? "Submit & Update" : "Submit & Create"}
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
