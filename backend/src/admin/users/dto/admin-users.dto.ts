import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum AdminLevelDtoValue {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

export class AdminUserDto {
  id: string;
  adminId: string;
  email: string;
  adminLevel: AdminLevelDtoValue;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateAdminUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: 'Admin ID can contain letters, numbers, dot, underscore and hyphen only',
  })
  adminId: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message: 'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;

  @IsOptional()
  @IsEnum(AdminLevelDtoValue)
  adminLevel?: AdminLevelDtoValue;
}

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: 'Admin ID can contain letters, numbers, dot, underscore and hyphen only',
  })
  adminId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message: 'Password must contain uppercase, lowercase, number and special character',
  })
  password?: string;

  @IsOptional()
  @IsEnum(AdminLevelDtoValue)
  adminLevel?: AdminLevelDtoValue;
}
