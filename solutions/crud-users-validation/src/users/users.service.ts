import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';

type User = {
    id: number,
    name: string,
    surname: string,
};

@Injectable()
export class UsersService {
    private users: User[] = [{
        id: 0,
        name: "John",
        surname: "Kowalski"
    }];

    getAll() {
        return this.users;
    }

    getSingle(id: number) {
        return this.users.find(user => user.id === id)
    }

    create(user: CreateUserDto) {
        const newId = this.users.length ? this.users.at(-1).id + 1: 0;
        const newUser = {
            ...user,
            id: newId,
        }
        this.users.push(newUser);
        return newUser;
    }

    update(id: number, partialUser: UpdateUserDto) {
        let user = this.getSingle(id);
        if (user) {
            Object.assign(user, partialUser);

            return user;
        }
    }

    delete(id: number) {
        const idxToBeDeleted = this.users.findIndex(user => user.id === id);
        if (idxToBeDeleted !== -1) {
            this.users.splice(idxToBeDeleted, 1);
        }
    }
}
