import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';

type User = {
    id: number,
    name: string,
    surname: string,
};


@Controller('users')
export class UsersController {

    private users: User[] = []

    @Get() // GET /users
    getAll() {
        return this.users;
    }

    @Get(":id")  // GET /users/:id
    getSingle(@Param("id") id: string) {
        const index = +id;
        return this.users.find(user => user.id == index);
    }

    @Post() // POST /users
    create(@Body() user: User) {
        const newId = this.users.length ? this.users.at(-1).id + 1 : 0;
        const newUser = {
            ...user,
            id: newId,
        };
        this.users.push(newUser);
        return newUser;
    }

    @Patch(":id") // /users/:id
    update(@Param("id") id: string, @Body() partialUser: Partial<User>) {
        let user = this.getSingle(id);
        if (user) {
            Object.assign(user, partialUser);

            return user;
        }
    }

    @Delete(":id") // DELETE /users/:id
    @HttpCode(204)
    delete(@Param("id") id: string) {
        const index = +id;
        const idxToBeDeleted = this.users.findIndex(user => user.id === index);
        if (idxToBeDeleted !== -1) {
            this.users.splice(idxToBeDeleted, 1);
        }
    }
}
