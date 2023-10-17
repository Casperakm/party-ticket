import {
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Body,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UpdateCustomerDto,
  LoginDto,
} from './models/customer.dto';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../shared/auth/guard/jwt-auth.guard';
import { UserData } from '../shared/decorators/users.decorator';

@Controller('customer')
@ApiTags('Customer')
export class CustomerController {
  constructor(
    private readonly _customerService: CustomerService,
  ) { }

  @Get()
  @ApiBadRequestResponse()
  getCustomers() {
    return this._customerService.findAll();
  }

  @Get('getinfo')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  @ApiBadRequestResponse()
  getCustomerInfo(@UserData('id') customer_id: number) {
    return this._customerService.findOne(customer_id);
  }

  @Post('login')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  login(@Body() data: LoginDto): Observable<Object> {
    return this._customerService.loginWithPassword(data)
  }

  @Post()
  @ApiOkResponse()
  @ApiBadRequestResponse()
  register(@Body() data: UpdateCustomerDto): Observable<Object> {
    return this._customerService.createUser(data)
  }


  @Put()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  @ApiBadRequestResponse()
  updateInfo(@UserData('id') customer_id: number, @Body() data: UpdateCustomerDto) {
    return this._customerService.updateInfo(customer_id, data);
  }
}
