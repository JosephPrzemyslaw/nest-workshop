import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';

type User = {
    id: number,
    name: string,
    surname: string,
};

@Controller('users')
export class UsersController {

    constructor(private readonly users: UsersService) {}

    @Get() // GET /users
    getAll() {
        return this.users.getAll();
    }

    @Get(":id")  // GET /users/:id
    getSingle(@Param("id") id: number) {
        return this.users.getSingle(id)
    }

    @Post() // POST /users
    create(@Body() user: User) {
        return this.users.create(user);
    }

    @Patch(":id") // /users/:id
    update(@Param("id") id: string, @Body() partialUser: Partial<User>) {
        return this.users.update(+id, partialUser);
    }

    @Delete(":id") // DELETE /users/:id
    @HttpCode(204)
    delete(@Param("id") id: string) {
        return this.users.delete(+id);
    }
}
