interface UserRequestBody {
  body: {
    name: string;
  };
}
interface UserRequestParams {
  params: {
    id: string;
  };
}
interface ConnectionRequestParams {
  params: {
    userId: string;
    friendId: string;
  };
}

export interface RequestCreateUser extends UserRequestBody {}
export interface RequestUserById extends UserRequestParams {}
export interface RequestUpdateUser extends UserRequestBody, UserRequestParams {}
export interface RequestDeleteUser extends UserRequestParams {}
export interface RequestCreateConnection extends ConnectionRequestParams {}
export interface RequestDistance extends ConnectionRequestParams {}
