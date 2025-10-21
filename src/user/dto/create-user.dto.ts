import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5, { message: "Ім'я має містити щонайменше 5 символів." })
  username: string;

  @IsEmail({}, { message: 'Невірний формат email.' })
  email: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Невірний формат номера телефону.',
  })
  phone: string;

  @IsString()
  @MinLength(5, { message: 'Пароль має містити щонайменше 5 символів.' })
  password: string;
}
