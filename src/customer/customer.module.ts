import { Module, forwardRef } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './models/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule { }
