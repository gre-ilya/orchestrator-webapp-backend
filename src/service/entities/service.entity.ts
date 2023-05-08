import {Prisma, Service} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";
import {Exclude} from "class-transformer";

export class JsonObject implements Prisma.JsonObject {}

export class ServiceEntity implements Service {
    constructor(partial: Partial<ServiceEntity>) {
        Object.assign(this, partial);
    }

    static handleArray(partialArray: Partial<ServiceEntity[]>) {
        let result: ServiceEntity[] = [];
        partialArray.forEach((val, index) => {
            result.push(new ServiceEntity(val));
        })
        return result;
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
    variables: JsonObject;

    @Exclude()
    projectId: string;

}
