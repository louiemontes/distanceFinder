export const commonResponse = <T>(response: T, clarification?: string) => {
  return {
    message: clarification ?? "Success",
    response,
  };
};

export const commonError = (
  error: Error
): { name: string; message: string; specifically: string } => {
  return {
    name: `${error?.name ?? "Oops!"}`,
    message: "Something went wrong",
    specifically: `${error?.message ?? "Further investigation is needed."}`,
  };
};
