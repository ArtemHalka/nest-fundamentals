import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { CoffeeEvent } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeBrandsFactory {
  create() {
    return ['jacobs', 'nescafe'];
  }
}

@Module({
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    CoffeBrandsFactory,
    { provide: COFFEE_BRANDS, useValue: ['jacobs', 'nescafe'] },
    {
      provide: 'COFFEE_BRANDS_FROM_FACTORY',
      useFactory: (brandsFactory: CoffeBrandsFactory) => brandsFactory.create(),
      inject: [CoffeBrandsFactory],
    },
    {
      provide: 'COFFEE_BRANDS_FROM_ASYNC_FACTORY',
      useFactory: async (dataSource: DataSource): Promise<string[]> => {
        // const coffeeBrands = await dataSource.query('SELECT * ...');
        const coffeeBrands = await Promise.resolve(['jacobs', 'nescafe']);
        return coffeeBrands;
      },
      inject: [DataSource],
    },
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, CoffeeEvent]),
    ConfigModule.forFeature(coffeesConfig),
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
