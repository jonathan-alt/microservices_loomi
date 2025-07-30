import { IsString, IsUrl } from "class-validator";

export class UpdateProfilePictureDto {
  @IsString()
  @IsUrl()
  profilePicture: string;
}
