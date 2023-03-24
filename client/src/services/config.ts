const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://localhost:8000";

const userUrl = `${baseURL}/api/user`;
const documentUrl = `${baseURL}/api/document`;
const imageUrl = `${baseURL}/api/image`;
const shapeUrl = `${baseURL}/api/shape`;

export const User = {
  signIn: `${userUrl}/sign-in`,
  signUp: `${userUrl}/sign-up`,
};

export const Document = {
  getDetail: (id: string) => `${documentUrl}/${id}/detail`,
  clear: (id: string) => `${documentUrl}/${id}/clear`,
};

export const Image = {
  update: (id: string) => `${imageUrl}/${id}/edit`,
};

export const Shape = {
  update: (id: string) => `${shapeUrl}/${id}/edit`,
  delete: (id: string) => `${shapeUrl}/${id}/remove`,
};
