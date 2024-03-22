# Zadanie [structure]
## Opis
Stwórz przykładowy projekt w `Nest.JS` i zapoznaj się z strukturą.

```
npm i -g @nestjs/cli
net new structure #project name
```

alternatywnie sklonuj repozytorium
```
git clone https://github.com/nestjs/typescript-starter.git structure # structure is a project name here
```

<br>

# Zadanie [faster]
## Opis
Aby stworzyć aplikację w `Nest` używa się klasy `NestFactory`. Wystawia ona statyczną metodę `create`, która zwraca obiekt aplikacji spełniający interfejs `INestApplication`. Pod spodem jako platforma `HTTP` może byc używany zarówno `express` jak i `fastify`.

Celem tego zadania jest przetestowanie szybkości działania webserwisu, przy użyciu różnych frameworków. Aplikacja wystawia pojedynczy endpoint `/test`. Ten po odpytaniu metodą `GET` zwraca tekst `This is a test !` (`text/plain`). Do sprawdzenia wydajności użyj narzędzia `autocannon`.

Zauważ, że sterowanie użytym web frameworkiem, może być zaimplementowane przy użyciu zmiennej środowiskowej.

## Podpowiedzi

Stworzenie nowego projektu:
```
npm init -y
npm i -g @nestjs/cli

nest create benchmark
```

Czy potrzebne są dodatkowe zależności ?
Tak, dla `fastify`: 
```
npm i @nestjs/platform-fastify
```
`@nestjs/platform-express` jest zainstalowane domyślnie.

Jak stworzyć aplikację przy użyciu danego frameworka ?

```js
import { NestFactory } from '@nestjs/core';
const app = await NestFactory.create(AppModule);
```

```js
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
const app = await NestFactory.create<NestExpressAdapter>(AppModule, new ExpressAdapter);
```

lub

```js
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter);
```

Mozliwe przełączanie się między frameworkami:
```
WEB_FRAMEWORK=fastify nest start
```
Jak wykonać testy ?
```
autocannon -c 100 -d 10 -p 10 localhost:3000/test
```
```
-c - the number of concurrent connections to use
-p - the number of pipelined requests to use
-d - the number of seconds to run the autocannon
```

Czym jest `potokowanie` ?
Przesyłanie przez ten sama kanał `TCP` wielu żądań `HTTP` sekwencyjnie bez oczekiwania na każdą odpowiedź

**DODATKOWE**

Odnosząc się do poprzednich wyników porównaj wydajność z `http.createServer`.

<br>

# Zadanie [logger-middleware]
## Opis
Middleware w `Nest.JS` jest kawałkiem kodu wykonywanym przed właściwą obsługą żądania. Może być zaimplementowany jako funkcja lub jako klasa. W tym drugim przypadku ważne aby implementowała interfejs `NestMiddleware` z `@nestjs/common`.
```js
export interface NestMiddleware<TRequest = any, TResponse = any> {
    use(req: TRequest, res: TResponse, next: (error?: Error | any) => void): any;
}
```
```js
class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        //...
    }
}
```

Poniżej znajduje się `middleware` napisany w `express` przeznaczony do logowania na potrzeby developmentu. Wyświetla w konsoli metodę HTTP, ścieżkę żądania HTTP oraz czas obsługi. Celem zadania jest przepisanie implementacji do `Nest.JS`.

```js
const app = express();
app.use((req, _, next) => {
    console.log(`${new Date} :  ${req.url} ${req.method}`);
    next();
});

```

# Zadanie [crud-users]
## Opis
W tym zadaniu zaimplementujesz webservice obsługujący operacje `CRUD`  dla ścieżki `/users`. Stwórz w tym celu moduł `users` wraz z odpowiadającym kontrolerem. **Nie używaj na razie oddzielnego `providera` do zarządzania modelem**. Użytkowników trzymaj w tablicy
```ts
type User {
    id: number,
    name: string,
    surname: string,
}
const users: User[] = [];
```
**Interfejs**
```
GET /users  - pobiera wszystkich użytkowników
GET /users/:id  - pobiera użytkownika z danym id
POST /users - tworzy nowego użytkownika
PATCH /users/:id - aktualizuje użytkownika o danym id
DELETE /users/:id - usuwa użytkownika z danym id
```

## Podpowiedzi
Stworzenie aplikacji
`nest new crud-users`

Dodanie kontrolera z poziomu `CLI`:
`nest g module users`
`nest g controller users`

Powiązanie metody klasy z obsługą ścieżki za pomocą metody `GET`:
```ts
@Controller("users")
class T {
    @Get()
    methodA () {
        //...
    }

    @Get("id")
    methodB(@Param("id") id: string) {
        //...
    }
}
```

Powiązanie metody z obsługą ścieżki za pomocą metody `POST` lub `PATCH` wraz z wyciągnięciem przesłanych danych w formacie `JSON`:
```ts
@Controller("users")
class T {
    @Post()
    methodA (@Body() data: User) {
        
    }

    @Patch(":id")
    methodB (@Param("id") id: string, @Body() data: User) {
        
    }
}
```

<br>

# Zadanie [crud-users-provider]
## Opis
Przenieś zarządzanie modelem do zewnętrznego pliku `users.service.ts`. W metodach obsługujących ścieżki następuje oddelegowanie do serwisu zadań odpowiedzialnych za model `users`.

## Podpowiedzi
Stworzenie pliku z poziomu `CLI`
```
nest g service users
```

Powiązanie modułu z serwisem
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Wstrzyknięcie serwisu do kontrolera przez konstruktor
```ts
@Controller('users')
export class UsersController {
    constructor(private readonly users: UsersService) {}
    //...
}
```

<br>

# Zadanie [crud-users-validation]
## Opis
Implementacja z poprzedniego zadania nie jest odporna na odpytanie ścieżek postaci:
```
curl http://localhost:3000/users/TT
curl -H "Content-Type: application/json" -d '{"name":"Pol", "surname": "Mac", "age": 40}' http://localhost:3000/users/
```
Powyżej dodawany jest użytkownik z niepoprawnym polem oraz odpytujemy webservice o użytkownika o błędnym identyfikatorze.

Celem zadania jest poprawa implementacji tak aby zwracać do klienta kod 400 w przypadku:
- przesłania błędnego typu danych (patrz pierwszy przypadek - `string` zamiast `number`)
- przesłania użytkownika o niewłaściwym kształcie (`wrong schema`) aby nie dopuścić do umieszczenia go w tablicy

Nie implementuj tego od zera ale skorzystaj z dostarczonych z frameworkiem narzędzi. Do realizacji pierwszego punktu wykorzystaj `pipes`, tj. `ParseIntPipe`. Pozwoli przekształcić to dane wejściowe (parametr `id` w ścieżce `/users/:id`) do `number` a w przypadku błędu `Nest.JS` wygeneruje do klienta stosowną odpowiedź. 

Drugi temat potraktuj biblioteką `class-transformer`. Umożliwia użycie dekoratorów określające typy pól użytkownika. W tym celu stwórz dwie klasy `DTO`, tj.: `UpdateUserDto` oraz `CreateUserDto`.

## Podpowiedzi
Uzycie `ParseIntPipe` - jako przykład transformacji danych wejściowych: 
**przed**
```ts
@Get(":id")  // GET /users/:id
getSingle(@Param("id") id: number) {
    //...
}
```
**po**
```ts
@Get(":id")  // GET /users/:id
getSingle(@Param("id", ParseIntPipe) id: number) {
    //...
}
```

Uzycie walidatora, który sprawdza czy przesłany przez klienta obiekt ma schemat `User`

**przed**
```ts
@Post() // POST /users
create(@Body() userDto: User) {
    return this.users.create(userDto);
}
```
**po**

```ts
@Post() // POST /users
create(@Body(ValidationPipe) userDto: CreateUserDto) {
    return this.users.create(userDto);
}
```