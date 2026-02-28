"use client";

import { Drawer, Form, Input, Select, Button, App, InputNumber, Dropdown, Space, Modal, Tag } from "antd";
import type { DrawerProps, MenuProps } from "antd";
import { DownOutlined, CheckCircleFilled, ExclamationCircleOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import {
  useCreateDealer,
  useUpdateDealer,
  useUpdateDealerStatus,
  useResetDealerPassword,
  useUnlockDealer,
  type ICreateDealerRequest,
  type DealerTier,
  type IDealerData,
  type DealerAccountStatus,
} from "@/services/dealer";
import { useDispatchMethods, useDealerStatuses } from "@/services/master";
import { type FC, useEffect, useState } from "react";
import { Checkbox } from "antd";

interface CreateDealerProps {
  open: boolean;
  onClose: () => void;
  initialData?: IDealerData | null;
  placement?: DrawerProps["placement"];
}

export const CreateDealer: FC<CreateDealerProps> = ({
  open,
  onClose,
  initialData = null,
  placement = "right",
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const isEditMode = Boolean(initialData);
  const [currentStatus, setCurrentStatus] = useState<DealerAccountStatus>("Active");

  const { data: dispatchMethodsData } = useDispatchMethods();
  const { data: dealerStatusesData } = useDealerStatuses();

  // const createDealerMutation = useCreateDealer({
  //   onSuccess: () => {
  //     message.success("Dealer created successfully!");
  //     form.resetFields();
  //     onClose();
  //   },
  // });
  const createDealerMutation = useCreateDealer({
    onSuccess: () => {
      message.success("Dealer created successfully!");
      form.resetFields();
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: {
          data?: {
            code?: string;
            errors?: string[];
            message?: string;
          };
        };
      };
  
      const code = err?.response?.data?.code;
      const errors = err?.response?.data?.errors ?? [];
      console.log('errerrors',errors);
      
      form.setFields([
        { name: "accountNumber", errors: [] },
      ]);
  
      if (code === "ACCOUNT_NUM_CONFLICT") {
        form.setFields([
          {
            name: "accountNumber",
            errors: errors,
          },
        ]);
        return;
      }
      if(code==='EMAIL_CONFLICT'){
        form.setFields([
          {
            name: "email",
            errors: errors,
          },
        ]);
        return;
      }

      if (code === "VALIDATION_ERROR") {
        const accountNumberError = errors.find((e) =>
          e.toLowerCase().startsWith("accountnumber")
        );
  
        if (accountNumberError) {
          const messageText =
            accountNumberError.split(":").slice(1).join(":").trim();
  
          form.setFields([
            {
              name: "accountNumber",
              errors: [messageText || "Invalid account number"],
            },
          ]);
          return;
        }
      }
  
      message.error("Failed to create dealer");
    },
  });

  const updateDealerMutation = useUpdateDealer({
    onSuccess: () => {
      message.success("Dealer updated successfully!");
      form.resetFields();
      onClose();
    },
  });

  const updateStatusMutation = useUpdateDealerStatus({
    onSuccess: () => {
      message.success("Dealer status updated successfully!");
    },
  });

  const resetPasswordMutation = useResetDealerPassword({
    onSuccess: (data) => {
      message.success(data.message || "Password reset successfully! A temporary password has been sent to the dealer's email.");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err?.response?.data?.message || "Failed to reset password");
    },
  });

  const unlockAccountMutation = useUnlockDealer({
    onSuccess: () => {
      message.success("Dealer account has been unlocked successfully.");
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err?.response?.data?.message || "Failed to unlock account");
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        firstName: initialData.firstName,
        lastName: initialData.lastName ?? "",
        email: initialData.email,
        accountNumber: initialData.dealer.accountNumber,
        companyName: initialData.dealer.companyName,
        genuinePartsTier: initialData.dealer.genuinePartsTier,
        aftermarketESTier: initialData.dealer.aftermarketESTier,
        aftermarketBTier: initialData.dealer.aftermarketBTier,
        defaultShippingMethod: initialData.dealer.defaultShippingMethod?.id,
        notes: undefined,
      });
      setCurrentStatus(initialData.dealer.accountStatus);
    } else if (open && !initialData) {
      form.resetFields();
      setCurrentStatus("Active");
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: {
    firstName: string;
    lastName?: string;
    email: string;
    accountNumber: number;
    companyName: string;
    genuinePartsTier: DealerTier;
    aftermarketESTier: DealerTier;
    aftermarketBTier: DealerTier;
    defaultShippingMethod?: number;
    notes?: string;
  }) => {
    const payload: ICreateDealerRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      accountNumber: values.accountNumber,
      companyName: values.companyName,
      genuinePartsTier: values.genuinePartsTier,
      aftermarketESTier: values.aftermarketESTier,
      aftermarketBTier: values.aftermarketBTier,
      defaultShippingMethod: values.defaultShippingMethod,
      notes: values.notes,
    };

    if (isEditMode && initialData) {
      payload.accountStatus = currentStatus;
      updateDealerMutation.mutate({ id: initialData.id, data: payload });
    } else {
      createDealerMutation.mutate(payload);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleStatusChange = (status: DealerAccountStatus) => {
    if (!initialData) return;
    updateStatusMutation.mutate(
      { id: initialData.id, data: { accountStatus: status } },
      { onSuccess: () => {setCurrentStatus(status);onClose()} }
    );
  };

  const handleResetPassword = () => {
    if (!initialData) return;
    Modal.confirm({
      title: "Reset Dealer Password",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Are you sure you want to reset the password for <strong>{initialData.firstName} {initialData.lastName}</strong>?</p>
          <p className="text-sm text-gray-600 mt-2">
            A new temporary password will be generated and sent to <strong>{initialData.email}</strong>.
          </p>
        </div>
      ),
      okText: "Reset Password",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => resetPasswordMutation.mutate({ id: initialData.id }),
    });
  };

  const handleUnlockAccount = () => {
    if (!initialData) return;
    Modal.confirm({
      title: "Unlock Dealer Account",
      icon: <UnlockOutlined />,
      content: (
        <div>
          <p>Are you sure you want to unlock the account for <strong>{initialData.firstName} {initialData.lastName}</strong>?</p>
          <p className="text-sm text-gray-600 mt-2">
            This will allow the dealer to log in again.
          </p>
        </div>
      ),
      okText: "Unlock Account",
      cancelText: "Cancel",
      onOk: () => unlockAccountMutation.mutate({ id: initialData.id }),
    });
  };

  const getStatusColor = (status: DealerAccountStatus) => {
    switch (status) {
      case "Active": return "green";
      case "Inactive": return "orange";
      case "Suspended": return "red";
      default: return "default";
    }
  };

  const allowedStatuses = ["Active", "Inactive"];
  const statusMenuItems: MenuProps["items"] = dealerStatusesData?.data
    ?.filter((s) => allowedStatuses.includes(s.code))
    .map((status) => ({
      key: status.code,
      label: (
        <div className="flex items-center justify-between min-w-[140px] py-1">
          <Space size={8}>
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  getStatusColor(status.code as DealerAccountStatus) === "green" ? "#52c41a" :
                  getStatusColor(status.code as DealerAccountStatus) === "orange" ? "#fa8c16" : "#ff4d4f",
              }}
            />
            <span className="font-medium">{status.name}</span>
          </Space>
          {currentStatus === status.code && (
            <CheckCircleFilled className="text-green-500 ml-3" style={{ fontSize: "14px" }} />
          )}
        </div>
      ),
      onClick: () => handleStatusChange(status.code as DealerAccountStatus),
    })) ?? [];

  const tierOptions: Array<{ label: string; value: DealerTier }> = [
    { label: "Retail Price (T)", value: "Net1" },
    { label: "Trade Price (N1)", value: "Net2" },
    { label: "Band 1 (N2)", value: "Net3" },
    { label: "Band 2 (N3)", value: "Net4" },
    { label: "Band 3 (N4)", value: "Net5" },
    { label: "Band 4 (N5)", value: "Net6" },
    { label: "List Price (L)", value: "Net7" },
  ];

  const shippingMethodOptions =
    dispatchMethodsData?.data?.map((method) => ({ label: method.name, value: method.id })) ?? [];

  const isPending = createDealerMutation.isPending || updateDealerMutation.isPending;

  return (
    <Drawer
      title={isEditMode ? "Edit Dealer" : "Add New Dealer"}
      size="large"
      placement={placement}
      onClose={handleCancel}
      open={open}
      closable
      className="bg-[#FAFAFA] createdealers"
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 overflow-y-auto px-1 -mx-1">
          {isEditMode && (
            <div className="mb-6 p-5 bg-linear-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">Account Management</h3>
                    {initialData?.isLocked && (
                      <Tag icon={<LockOutlined />} color="error">Locked</Tag>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Update dealer account status and manage password</p>
                </div>
                <div className="flex items-center gap-3">
                  <Dropdown
                    menu={{ items: statusMenuItems }}
                    trigger={["click"]}
                    disabled={updateStatusMutation.isPending}
                    placement="bottomRight"
                  >
                    <Button
                      size="large"
                      className="min-w-[140px] h-10 font-medium border-2"
                      style={{
                        borderColor:
                          getStatusColor(currentStatus) === "green" ? "#52c41a" :
                          getStatusColor(currentStatus) === "orange" ? "#fa8c16" : "#ff4d4f",
                        color:
                          getStatusColor(currentStatus) === "green" ? "#52c41a" :
                          getStatusColor(currentStatus) === "orange" ? "#fa8c16" : "#ff4d4f",
                      }}
                    >
                      <Space className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                getStatusColor(currentStatus) === "green" ? "#52c41a" :
                                getStatusColor(currentStatus) === "orange" ? "#fa8c16" : "#ff4d4f",
                            }}
                          />
                          {currentStatus}
                        </span>
                        <DownOutlined style={{ fontSize: "10px" }} />
                      </Space>
                    </Button>
                  </Dropdown>
                  {initialData?.isLocked && (
                    <Button
                      size="large"
                      className="min-w-[140px] h-10 font-medium"
                      icon={<UnlockOutlined />}
                      onClick={handleUnlockAccount}
                      loading={unlockAccountMutation.isPending}
                    >
                      Unlock Account
                    </Button>
                  )}
                  <Button
                    size="large"
                    danger
                    className="min-w-[140px] h-10 font-medium"
                    onClick={handleResetPassword}
                    loading={resetPasswordMutation.isPending}
                  >
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
            <Form.Item
              label="Company Name"
              name="companyName"
              className="mb-3"
              rules={[{ required: true, message: "Please enter company name" }]}
            >
              <Input size="large" placeholder="Enter company name" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Account Number"
                name="accountNumber"
                rules={[{ required: true, message: "Please enter account number" }]}
              >
                <InputNumber size="large" placeholder="Enter account number" className="w-full!" />
              </Form.Item>
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
            </div>

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

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Pricing Tiers</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Tier</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-l border-gray-200">Genuine</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-l border-gray-200">Aftermarket ES</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-l border-gray-200">Branded</th>
                    </tr>
                  </thead>
                  <tbody>
                    <Form.Item name="genuinePartsTier" initialValue="Net1" hidden rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="aftermarketESTier" initialValue="Net1" hidden rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="aftermarketBTier" initialValue="Net1" hidden rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue, setFieldValue }) => (
                        <>
                          {tierOptions.map((option, index) => (
                            <tr key={option.value} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-200">{option.label}</td>
                              <td className="px-4 py-3 text-center border-b border-l border-gray-200">
                                <Checkbox
                                  checked={getFieldValue("genuinePartsTier") === option.value}
                                  onChange={() => setFieldValue("genuinePartsTier", option.value)}
                                />
                              </td>
                              <td className="px-4 py-3 text-center border-b border-l border-gray-200">
                                <Checkbox
                                  checked={getFieldValue("aftermarketESTier") === option.value}
                                  onChange={() => setFieldValue("aftermarketESTier", option.value)}
                                />
                              </td>
                              <td className="px-4 py-3 text-center border-b border-l border-gray-200">
                                <Checkbox
                                  checked={getFieldValue("aftermarketBTier") === option.value}
                                  onChange={() => setFieldValue("aftermarketBTier", option.value)}
                                />
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </Form.Item>
                  </tbody>
                </table>
              </div>
            </div>

            <Form.Item label="Default Shipping Method" name="defaultShippingMethod">
              <Select
                size="large"
                placeholder="Select shipping method (optional)"
                options={shippingMethodOptions}
                allowClear
              />
            </Form.Item>

            <Form.Item label="Notes" name="notes">
              <Input.TextArea size="large" placeholder="Enter notes (optional)" rows={3} />
            </Form.Item>
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
};
