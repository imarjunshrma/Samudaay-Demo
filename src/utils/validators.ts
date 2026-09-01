export const validators = {
  isIndianMobile(value: string) {
    return /^[6-9]\d{9}$/.test(value);
  },
  isOtp(value: string) {
    return /^\d{6}$/.test(value);
  },
};
