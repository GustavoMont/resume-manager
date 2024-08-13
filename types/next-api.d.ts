import { UserResponseDto } from "dtos/users/UserResponse.dto";
import "next";
declare module "next" {
  export interface NextApiRequest {
    user: UserResponseDto;
  }
}
