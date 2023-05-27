import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateDeploymentDto } from './create-deployment.dto';
import {UpdateUserDto} from "../../user/dto/update-user.dto";
import {IsString} from "class-validator";
import {DeploymentStatus} from "@prisma/client";

export class UpdateDeploymentDto {
    constructor(partial: Partial<UpdateDeploymentDto>) {
        Object.assign(this, partial);
    }
    @IsString()
    @ApiProperty()
    buildLogs: string;

    @IsString()
    @ApiProperty()
    deployLogs: string;

    @IsString()
    @ApiProperty()
    status: DeploymentStatus;
}
