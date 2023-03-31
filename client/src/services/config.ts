const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://google-jamboard.vercel.app";

const userUrl = `${baseURL}/api/user`;
const documentUrl = `${baseURL}/api/document`;
const canvasUrl = `${baseURL}/api/canvas`;
const shapeUrl = `${baseURL}/api/shape`;
const slideUrl = `${baseURL}/api/slide`;

export const User = {
  signIn: `${userUrl}/sign-in`,
  signUp: `${userUrl}/sign-up`,
};

export const Document = {
  getDetail: (documentId: string) => `${documentUrl}/${documentId}/detail`,
  clear: (documentId: string) => `${documentUrl}/${documentId}/clear`,
  delete: (documentId: string) => `${documentUrl}/${documentId}/remove`,
  update: (documentId: string) => `${documentUrl}/${documentId}/edit`,
  getAll: `${documentUrl}/list`,
  create: `${documentUrl}/create`,
};

export const Canvas = {
  update: (canvasId: string) => `${canvasUrl}/${canvasId}/edit`,
};

export const Shape = {
  update: (shapeId: string) => `${shapeUrl}/${shapeId}/edit`,
  delete: (documentId: string) => `${shapeUrl}/${documentId}/remove`,
  create: (documentId: string) => `${shapeUrl}/${documentId}/create`,
};

export const Slide = {
  create: (documentId: string) => `${slideUrl}/${documentId}/create`,
  delete: (documentId: string) => `${slideUrl}/${documentId}/remove`,
  clear: (documentId: string) => `${slideUrl}/${documentId}/clear`,
  update: (documentId: string) => `${slideUrl}/${documentId}/edit`,
};
