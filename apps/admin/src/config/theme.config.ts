import type { ThemeConfig } from "antd";

export const theme: (overrides?: ThemeConfig) => ThemeConfig = (overrides) => {
  const { token, components, ...rest } = overrides || {};

  return {
    token: {
      colorPrimary: "#0C4394",
      fontFamily: "DM Sans, sans-serif",
      ...token,
    },
    components: {
      Button: {
        defaultBorderColor: "#0C4394",
        defaultColor: "#0C4394",
        borderRadius: 9999,
        borderRadiusLG: 9999,
        ...components?.Button,
      },
      ...components,
    },
    ...rest,
  };
};
