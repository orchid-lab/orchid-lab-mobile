import { API_URL } from '@env';

const BASE_URL = String(API_URL).replace(/\/+$/, '');

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  role: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface UpdateUserPayload {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
}

/** GET /api/user/{id} */
export async function fetchUserById(id: string): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/api/user/${id}`);
  if (!res.ok) throw new Error('Không thể lấy thông tin người dùng');
  const data = await res.json();
  return data.value as UserProfile;
}

/** POST /api/images/user — trả về URL string */
export async function uploadUserAvatar(file: {
  uri: string;
  type?: string;
  fileName?: string;
}): Promise<string> {
  const formData = new FormData();
  formData.append('image', {
    uri: file.uri,
    type: file.type || 'image/jpeg',
    name: file.fileName || 'avatar.jpg',
  } as any);

  const res = await fetch(`${BASE_URL}/api/images/user`, {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (!res.ok) throw new Error('Upload ảnh thất bại');
  // API trả về text/plain (URL string)
  const url = await res.text();
  return url;
}

/** PUT /api/user — cập nhật thông tin user */
export async function updateUser(payload: UpdateUserPayload): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Cập nhật thông tin thất bại');
}