import {DeploymentStatus, Prisma, Service} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";
import {Exclude} from "class-transformer";

export class JsonObject implements Prisma.JsonObject {}

export class ServicePreviewEntity implements Service {
    constructor(partial: Partial<ServicePreviewEntity>) {
        Object.assign(this, partial);
    }

    static handleArray(partialArray: Partial<ServicePreviewEntity[]>) {
        let result: ServicePreviewEntity[] = [];
        partialArray.forEach((val, index) => {
            result.push(new ServicePreviewEntity(val));
        })
        return result;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @Exclude()
    repository: string;

    @Exclude()
    builderTemplate: number;

    @Exclude()
    buildCommand: string;

    @Exclude()
    deployCommand: string;

    @Exclude()
    ip: string;

    @Exclude()
    port: number;

    @ApiProperty()
    status: DeploymentStatus;

    @Exclude()
    variables: JsonObject;

    @Exclude()
    projectId: string;

}
