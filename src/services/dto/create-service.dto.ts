import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {JsonObject} from "../entities/service.entity";

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    repository: string;

    ip: string;

    port: number;

    variables: JsonObject;

    projectId: string;

}
