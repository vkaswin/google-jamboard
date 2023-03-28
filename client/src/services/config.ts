const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://localhost:8000";

const userUrl = `${baseURL}/api/user`;
const documentUrl = `${baseURL}/api/document`;
const canvasUrl = `${baseURL}/api/canvas`;
const shapeUrl = `${baseURL}/api/shape`;

export const User = {
  signIn: `${userUrl}/sign-in`,
  signUp: `${userUrl}/sign-up`,
};

export const Document = {
  getDetail: (documentId: string) => `${documentUrl}/${documentId}/detail`,
  clear: (documentId: string) => `${documentUrl}/${documentId}/clear`,
};

export const Canvas = {
  update: (canvasId: string) => `${canvasUrl}/${canvasId}/edit`,
};

export const Shape = {
  update: (shapeId: string) => `${shapeUrl}/${shapeId}/edit`,
  delete: (documentId: string) => `${shapeUrl}/${documentId}/remove`,
  create: `${shapeUrl}/create`,
};
