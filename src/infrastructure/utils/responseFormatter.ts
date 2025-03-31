export const successResponse = (
  statusCode: number,
  message: string,
  data: any = null
): { status: number; message: string; data: any } => {
  return {
    status: statusCode,
    message,
    data,
  };
};
  