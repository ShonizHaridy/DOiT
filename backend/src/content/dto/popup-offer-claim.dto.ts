import { IsEmail, IsIn, IsOptional } from 'class-validator';

export class ClaimPopupOfferDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(['en', 'ar'])
  locale?: 'en' | 'ar';
}

