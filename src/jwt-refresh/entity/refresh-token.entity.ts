import {RefreshToken} from "@prisma/client";
import {UserEntity} from "../../users/entities/user.entity";
import {ApiProperty} from "@nestjs/swagger";
import {Exclude} from "class-transformer";

export class RefreshTokenEntity implements RefreshToken {
    constructor({ user, ...data }: Partial<RefreshTokenEntity>) {
        Object.assign(this, data);
        if (user) {
            this.user = new UserEntity(user);
        }
    }

    @ApiProperty()
    jti: string;

    @Exclude()
    createdAt: Date;

    @Exclude()
    revoked: boolean;

    @Exclude()
    deviceId: string;

    @ApiProperty({ required: false, nullable: true })
    userEmail: string | null;

    @ApiProperty({ required: false, type: UserEntity })
    user?: UserEntity;
}