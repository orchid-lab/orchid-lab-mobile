/* eslint-disable no-bitwise */
export const decodeBase64 = (input: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = input.replace(/[=]+$/, '');
  let output = '';
  for (
    let bc = 0, bs = 0, buffer: any, i = 0;
    (buffer = str.charAt(i++));
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4)
      ? (output += String.fromCharCode(255 & bs >> (-2 * bc & 6)))
      : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  return output;
};

export const decodeJWT = (token: string): Record<string, any> | null => {
  try {
    const base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '='; // padding fix
    const jsonPayload = decodeURIComponent(
      decodeBase64(base64)
        .split('')
        .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Lỗi giải mã JWT:', error);
    return null;
  }
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning.';
  if (hour >= 12 && hour < 18) return 'Good Afternoon.';
  if (hour >= 18 && hour < 22) return 'Good Evening.';
  return 'Good Night.';
};