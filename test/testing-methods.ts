import {CreateUserDto} from "../src/user/dto/create-user.dto";
import {UserService} from "../src/user/user.service";
import {UserEntity} from "../src/user/entities/user.entity";


export async function findNotExistingUser(userService: UserService) {
    let count = 0;
    let testUser = {
        email: undefined,
    }
    while (true) {
        const testEmail: string = `test${count}@mail.ru`;
        try {
            await userService.findOne(testEmail);
        } catch (NotFoundException) {
            testUser.email = testEmail;
            return new UserEntity(testUser);
        }
        count++;
    }
}

export async function createNotExistingUser(userService: UserService, password: string) {
    let testUser = await findNotExistingUser(userService)
    testUser.password = password;
    await userService.create(new CreateUserDto(testUser.email, testUser.password));
    return new UserEntity(testUser);
}

