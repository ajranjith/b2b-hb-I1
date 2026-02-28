// Admin Login
export interface ILoginRequest {
  email: string;
  password: string;
  captchaToken: string;
}

export interface ILoginResponse {
  success: true;
  message: string;
}

// Logout
export interface ILogoutResponse {
  success: true;
  message: string;
}

// Profile
export interface IProfileData {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
  role: string;
  dealer: {
    accountNumber: number;
    companyName: string;
    genuinePartsTier: string;
    aftermarketESTier: string;
    aftermarketBTier: string;
    accountStatus: string;
  } | null;
}

export interface IProfileResponse {
  success: true;
  data: IProfileData;
}
