import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Controller('users')
export class UsersController {

    constructor(private readonly users: UsersService) {}

    @Get() // GET /users
    getAll() {
        return this.users.getAll();
    }

    @Get(":id")  // GET /users/:id
    getSingle(@Param("id", ParseIntPipe) id: number) {
        return this.users.getSingle(id);
    }

    @Post() // POST /users
    _create(@Body(new ValidationPipe({
        whitelist: true,
    })) userDto: CreateUserDto) {
        return this.users.create(userDto);
    }

    @Patch(":id") // /users/:id
    update(@Param("id", ParseIntPipe) id: number, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
        return this.users.update(id, updateUserDto);
    }

    @Delete(":id") // DELETE /users/:id
    @HttpCode(204)
    delete(@Param(":id", ParseIntPipe) id: number) {
        return this.users.delete(id);
    }
}
