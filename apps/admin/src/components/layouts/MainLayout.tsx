"use client";

import { Layout, Menu, Avatar, Dropdown, Space, App } from "antd";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  TeamOutlined,
  InboxOutlined,
  SettingOutlined,
  EditOutlined,
  CodeSandboxOutlined,
  FundViewOutlined,
  LinkOutlined,
  PictureOutlined,
  TagsOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useLogout, useProfile } from "@/services/auth";
import Image from "next/image";
import HotbrayLogo from "@/assets/images/HotbrayLogo.png";

const { Header, Sider, Content } = Layout;

export function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const { message } = App.useApp();
  const { data: profileData } = useProfile();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const logoutMutation = useLogout({
    onSuccess: (data) => {
      message.success(data.message);
      window.location.href = "/login";
    },
    onSettled: () => {
      window.location.href = "/login";
    },
  });

  const getUserInitials = () => {
    if (!profileData?.data) return "";
    const { firstName, lastName } = profileData.data;
    const firstInitial = firstName?.[0]?.toUpperCase() || "";
    const lastInitial = lastName?.[0]?.toUpperCase() || "";
    return lastInitial ? `${firstInitial}${lastInitial}` : firstInitial;
  };

  const menuItems: MenuProps["items"] = [
    {
      type: "group",
      label: (
        <span className="text-xs text-gray-500 uppercase font-medium">
          MAIN MENU
        </span>
      ),
      children: [
        {
          key: "/",
          icon: <AppstoreOutlined />,
          label: <Link href="/">Dashboard</Link>,
        },
        {
          key: "/dealers",
          icon: <TeamOutlined />,
          label: <Link href="/dealers">Dealers</Link>,
        },
        {
          key: "/products",
          icon: <TagsOutlined />,
          label: <Link href="/products">Products</Link>,
        },
        {
          key: "/order-logs",
          icon: <InboxOutlined />,
          label: <Link href="/order-logs">Orders</Link>,
        },
        {
          key: "/backorders",
          icon: <UnorderedListOutlined />,
          label: <Link href="/backorders">Backorders</Link>,
        },
        {
          key: "/import-logs",
          icon: <CodeSandboxOutlined />,
          label: "Imports",
          className: "imports-submenu",
          children: [
            { key: "/import-logs?tab=products", label: <Link href="/import-logs?tab=products">Products</Link> },
            { key: "/import-logs?tab=dealers", label: <Link href="/import-logs?tab=dealers">Dealers</Link> },
            { key: "/import-logs?tab=superseded", label: <Link href="/import-logs?tab=superseded">Superseded</Link> },
            { key: "/import-logs?tab=backorder", label: <Link href="/import-logs?tab=backorder">Back Orders</Link> },
            { key: "/import-logs?tab=order-status", label: <Link href="/import-logs?tab=order-status">Orders Overall Status</Link> },
          ],
        },
      ],
    },
    {
      type: "group",
      label: (
        <span className="text-xs text-gray-500 uppercase font-medium">
          ADMIN PANEL
        </span>
      ),
      children: [
        {
          key: "/user-management",
          icon: <SettingOutlined />,
          label: <Link href="/user-management">User Management</Link>,
        },
        {
          key: "/content-management",
          icon: <EditOutlined />,
          label: "Content Management",
          className: "content-management-submenu",
          children: [
            { key: "/content-management/exclusive-parts", icon: <SettingOutlined />, label: <Link href="/content-management/exclusive-parts">Exclusive Parts</Link> },
            { key: "/content-management/news-and-offers", icon: <FundViewOutlined />, label: <Link href="/content-management/pricelist">News & Offers & Pricelist</Link> },
            { key: "/content-management/external-links", icon: <LinkOutlined />, label: <Link href="/content-management/external-links">External Links</Link> },
            { key: "/content-management/banners", icon: <PictureOutlined />, label: <Link href="/content-management/banners">Banners</Link> },
            { key: "/content-management/marquee-text", icon: <FileTextOutlined />, label: <Link href="/content-management/marquee-text">Marquee Text</Link> },

          ],
        },
      ],
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.includes("?")) {
      const [path, query] = key.split("?");
      router.push(`${path}?${query}`);
    } else {
      router.push(key);
    }
  };

  useEffect(() => {
    if (pathname.startsWith("/content-management")) {
      setOpenKeys(["/content-management"]);
    } else if (pathname.startsWith("/import-logs")) {
      setOpenKeys(["/import-logs"]);
    }
  }, [pathname]);

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const currentKey = pathname + search;

  return (
    <Layout className="min-h-screen">
      <Sider
        className="fixed left-0 top-0 bottom-0 h-screen overflow-auto bg-white z-20"
        width={250}
        theme="light"
        style={{ borderRight: "1px solid #f0f0f0" }}
      >
        <div className="flex items-center justify-start h-16 px-6 border-b border-gray-100">
          <Link href="/">
            <Image
              src={HotbrayLogo}
              alt="Hotbray Logo"
              className="h-[27px] w-[102px]"
              width={102}
              height={27}
            />
          </Link>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentKey]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
          onClick={handleMenuClick}
          className="
          border-r-0
          pt-4
          sidebar-menu

          [&_.ant-menu-item]:relative
          [&_.ant-menu-item]:transition-colors
          [&_.ant-menu-item]:duration-300
          [&_.ant-menu-item]:ease-out

          [&_.ant-menu-item-selected]:bg-[rgba(12,67,148,0.1)]
          [&_.ant-menu-item-selected]:text-[#0C4394]

          [&_.ant-menu-item-selected::after]:content-['']
          [&_.ant-menu-item-selected::after]:absolute
          [&_.ant-menu-item-selected::after]:right-0
          [&_.ant-menu-item-selected::after]:top-0
          [&_.ant-menu-item-selected::after]:h-full
          [&_.ant-menu-item-selected::after]:w-[1px]
          [&_.ant-menu-item-selected::after]:bg-[#0C4394]

          [&_.ant-menu-item-selected_.anticon]:text-[#0C4394]

          [&_.ant-menu-item:hover]:bg-[rgba(12,67,148,0.06)]
          [&_.ant-menu-submenu-title]:m-0!
          [&_li.content-management-submenu_.ant-menu-sub_.ant-menu-item]:pl-12!
          [&_li.content-management-submenu_.ant-menu-sub_.ant-menu-item]:py-2.5!
          [&_li.imports-submenu_.ant-menu-sub_.ant-menu-item]:pl-12!
          [&_li.imports-submenu_.ant-menu-sub_.ant-menu-item]:py-2.5!
        "
          style={{ backgroundColor: "transparent" }}
        />
      </Sider>
      <Layout className="">
        <Header
          className="bg-white! px-4 flex items-center justify-end sticky top-0 z-10"
          style={{ borderBottom: "1px solid #f0f0f0" }}
        >
          <div className="flex items-center gap-4">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar className="text-primary! bg-[#ced9e9]!">{getUserInitials() || <UserOutlined />}</Avatar>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content className="p-4 bg-gray-50 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="bg-white rounded-lg p-6 min-h-full">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
