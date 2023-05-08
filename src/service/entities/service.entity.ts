import {DeploymentStatus, Prisma, Service} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";
import {Exclude} from "class-transformer";

export class JsonObject implements Prisma.JsonObject {}

export class ServiceEntity implements Service {
    constructor(partial: Partial<ServiceEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    repository: string;

    @ApiProperty()
    builderTemplate: number;

    @ApiProperty()
    buildCommand: string;

    @ApiProperty()
    deployCommand: string;

    @ApiProperty()
    ip: string;

    @ApiProperty()
    port: number;

    @ApiProperty()
    status: DeploymentStatus;

    @ApiProperty()
    variables: JsonObject;

    @Exclude()
    projectId: string;

}
