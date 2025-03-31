export const successResponse = <T = null>(
  statusCode: number,
  message: string,
  data: T = null as unknown as T
): { status: number; message: string; data: T } => {
  return {
    status: statusCode,
    message,
    data,
  };
};

export const errorResponse = <T = undefined>(
  statusCode: number,
  message: string,
  details: T = undefined as unknown as T
): { status: number; message: string; details: T } => {
  return {
    status: statusCode,
    message,
    details,
  };
};