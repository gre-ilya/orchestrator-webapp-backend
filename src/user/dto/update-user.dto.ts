import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {IsNotEmpty, IsString, MinLength} from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty()
    passwordHash: string;
}
