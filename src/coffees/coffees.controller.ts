import { Controller, Get, Param, Post, Body, Patch, Delete, Query, Put, Inject } from '@nestjs/common';
import { Request } from 'express';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request) {
    console.log('CoffeesController created');
  }

  @Get()
  findAll(@Query() paginationQuery:PaginationQueryDto) {
    console.log(this.request);

    // const { limit, offset } = paginationQuery;
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeesService.findOne('' + id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto)
  }

  @Patch(':id')
  update(@Param('id') id:string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id:string) {
    return this.coffeesService.remove(id);
  }

}
