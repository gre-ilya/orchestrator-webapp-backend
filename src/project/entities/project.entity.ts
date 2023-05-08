import {ApiProperty} from "@nestjs/swagger";
import {Project} from "@prisma/client";
import {Exclude} from "class-transformer";
import * as process from "process";

export class ProjectEntity implements Project {
    constructor(partial: Partial<ProjectEntity>) {
        Object.assign(this, partial);
    }

    static handleArray(partialArray: Partial<ProjectEntity[]>) {
        let result: ProjectEntity[] = [];
        partialArray.forEach((val, index) => {
            result.push(new ProjectEntity(val));
        })
        return result;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @Exclude()
    userEmail: string;

}
