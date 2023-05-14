import {Deployment, DeploymentStatus} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";
import {Exclude} from "class-transformer";

export class DeploymentPreviewEntity implements Deployment {
    constructor(partial: Partial<DeploymentPreviewEntity>) {
        Object.assign(this, partial);
    }

    static handleArray(partialArray: Partial<DeploymentPreviewEntity[]>) {
        const result: DeploymentPreviewEntity[] = [];
        partialArray.forEach((val, index) => {
            result.push(new DeploymentPreviewEntity(val));
        });
        return result;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    status: DeploymentStatus;

    @ApiProperty()
    buildDate: Date;

    @Exclude()
    buildLogs: string;

    @Exclude()
    deployLogs: string;

    @Exclude()
    serviceId: string;
}