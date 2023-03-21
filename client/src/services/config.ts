const baseURL =
  process.env.NODE_ENV === "development" ? "http://localhost:8000" : "";

const userUrl = `${baseURL}/api/user`;
const documentUrl = `${baseURL}/api/document`;
const imageUrl = `${baseURL}/api/image`;

export const User = {
  signIn: `${userUrl}/sign-in`,
  signUp: `${userUrl}/sign-up`,
};

export const Document = {
  getDetail: (id: string) => `${documentUrl}/${id}/detail`,
};

export const Image = {
  update: (id: string) => `${imageUrl}/${id}/edit`,
};
