"use client";

import { Button, Input, Form, App } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";
import { ILoginResponse, useLogin } from "../../services/auth";
import loginBg from "@/assets/images/loginBg.png";
import HotbrayLogo from "@/assets/images/HotbrayLogo.png";

const Login = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const loginMutation = useLogin({
    onSuccess: (data: ILoginResponse) => {
      message.success(data.message);
      router.push("/");
    },
    onError: () => {
      message.error("Login failed. Please try again.");
      recaptchaRef.current?.reset();
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const captchaToken = await recaptchaRef.current?.executeAsync();

      if (!captchaToken) {
        message.error("Captcha verification failed. Please try again.");
        return;
      }

      loginMutation.mutate({
        ...values,
        captchaToken,
      });

      recaptchaRef.current?.reset();
    } catch {
      message.error("Captcha verification failed. Please try again.");
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{
        backgroundImage: `
          linear-gradient(
            148.66deg,
            rgba(241, 241, 241, 0.8) 31.15%,
            rgba(126, 155, 193, 0.8) 379.34%,
            rgba(15, 71, 144, 0.8) 546.04%
          ),
          url(${loginBg.src})
        `,
        backgroundSize: "contain",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-15">
        <Image
          src={HotbrayLogo}
          alt="Hotbray Logo"
          width={160}
          height={50}
        />
        <div className="w-[375px] bg-[#FAFAFA] border border-[#E9E9E9] rounded-2xl px-6 py-8">
          <p className="text-xl font-bold">Welcome back!</p>
          <p className="mt-2.5 text-base text-gray-500">
            Sign in to manage HotBray operations securely.
          </p>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4.5! space-y-5!"
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input size="large" placeholder="Email Address" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password
                size="large"
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            />

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loginMutation.isPending}
              className="w-full h-10! rounded-[52px]! mb-2.5!"
            >
              Login
            </Button>
            <div className="flex justify-end">
              <a href="#" className="text-sm text-primary!">
                Forgot Password?
              </a>
            </div>
          </Form>
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>
              By signing up for an account you agree to the{" "}
              <span className="text-primary! underline cursor-pointer">
                Privacy Policy
              </span>{" "}
              and{" "}
              <span className="text-primary! underline cursor-pointer">
                Terms of Service.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
