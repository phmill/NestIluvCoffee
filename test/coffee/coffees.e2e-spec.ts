import { HttpServer, HttpStatus, INestApplication, ValidationPipe,  } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaginationQueryDto } from "../../src/common/dto/pagination-query.dto";
import { CoffeesModule } from "../../src/coffees/coffees.module";
import * as request from 'supertest';
import { CreateCoffeeDto } from "src/coffees/dto/create-coffee.dto";
import { UpdateCoffeeDto } from "src/coffees/dto/update-coffee.dto";


describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  const expectedPartialCoffee = jasmine.objectContaining({
    ...coffee,
    flavors: jasmine.arrayContaining(
      coffee.flavors.map(name => jasmine.objectContaining({ name })),
    ),
  });

  let app: INestApplication;
  let httpServer: HttpServer;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '1656',
          database: 'myTestDb',
          autoLoadEntities: true,
          synchronize: true,
        }),
        PaginationQueryDto,
        CoffeesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    }));

    await app.init();
    httpServer = app.getHttpServer();
  });

  
  it('Create [POST /]', () => {
    return request(httpServer)
    .post('/coffees')
    .send(coffee as CreateCoffeeDto)
    .expect(HttpStatus.CREATED)
    .then(({ body }) => {
      expect(body).toEqual(expectedPartialCoffee);
    })
  });
  it('Get all [GET /]', () => {
    return request(httpServer)
    .get('/coffees')
    .then(({ body }) => {
      console.log(body)
      expect(body.length).toBeGreaterThan(0);
      expect(body[0]).toEqual(expectedPartialCoffee);
    });
  });
  it('Get one [GET /:id]', () => {
    return request(httpServer)
      .get('/coffees/1')
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });
  it('Update one [PATCH /:id]', () => {
    const updateCoffeeDto: UpdateCoffeeDto = {
      ...coffee,
      name: 'New and Improved Shipwreck Roast'
    }
    return request(httpServer)
      .patch('/coffees/1')
      .send(updateCoffeeDto)
      .then(({ body }) => {
        expect(body.name).toEqual(updateCoffeeDto.name);

        return request(httpServer)
          .get('/coffees/1')
          .then(({ body }) => {
            expect(body.name).toEqual(updateCoffeeDto.name);
          });
      });
  });
  it('Delete one [DELETE /:id]', () => {
    return request(httpServer)
    .delete('/coffees/1')
    .expect(HttpStatus.OK)
    .then(() => {
      return request(httpServer)
      .get('/coffees/1')
      .expect(HttpStatus.NOT_FOUND);
    })
  });
  

  afterAll(async () => {
    await app.close();
  });
});