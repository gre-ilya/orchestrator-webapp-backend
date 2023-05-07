import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;
}
