import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, mergeMap, catchError } from 'rxjs/operators';
import { Customer } from './models/customer.interface';
import { AuthService } from 'src/shared/auth/auth.service';
import { CustomerEntity } from './models/customer.entity';
import { LoginDto, UpdateCustomerDto  } from './models/customer.dto';
import { UserRole } from './models/customer.enum';
import { emailTransport } from 'src/shared/util/mailer';
const crypto = require("crypto");
const bcrypt = require('bcrypt');

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
    private authService: AuthService,
  ) { }

  async findAll() {
    return this.customerRepo.find();
  }

  findOne(id: number): Observable<Customer> {
    return from(
      this.customerRepo.findOneBy({ id: id })
    ).pipe(
      map((user: any) => {
        if (!user) {
          throw new NotFoundException('User Record not found!');
        }
        let data = JSON.parse(JSON.stringify(user));
        delete data.password;
        data['address'] = user.ward;
        return data;
      }),
    );
  }

  createUser(data: UpdateCustomerDto) {
    return this.findByCustomerEmail(data['email']).pipe(
      mergeMap((customer: CustomerEntity) => {
        if (!customer) {
          const newCust = new CustomerEntity();
          newCust.uuid = crypto.randomBytes(16).toString("hex");
          newCust.email = data['email'];
          newCust.username = data['username'];
          newCust.phone = data['phone'];
          newCust.password = this.authService.hashPasswordRun(data.password);
          return from(this.customerRepo.save(newCust)).pipe(
            mergeMap((customer: CustomerEntity) => {
              const payload = { username: customer.username, id: customer.id, role: UserRole.CUSTOMER };
              return this.authService
                .generateJWT(payload)
                .pipe(map((jwt: string) => {
                  let user = customer as Customer
                    user.token = jwt
                  return user;
                }));
            }),
          );
        } else {
          throw new BadRequestException('User Email Is Alreay Exist!');
        }
      }),
    );
  }

  loginWithPassword(data: LoginDto, role: UserRole = UserRole.CUSTOMER): Observable<Customer> {
    return from(this.customerRepo.findOneBy({ email: data.email })).pipe(mergeMap((user: any) => {
      if (!user) {
        throw new NotFoundException('User Record not found!');
      }
      if (!this.authService.comparePasswordsRun(data.password, user.password)) {
        throw new NotFoundException('User Password Is Wrong');
      }
      const payload = { username: user.username, id: user.id, role: role }
      return this.authService
        .generateJWT(payload)
        .pipe(map((jwt: string) => {
          user.token = jwt
          return user;
        }));
    }), catchError(err => throwError(err)));
  }

  // loginWithFireBase(loginData: LoginWithFBDto, role: UserRole = UserRole.CUSTOMER): Observable<Customer> {
  //   return this.loginWithSocial(loginData).pipe(
  //     switchMap(response => {
  //       if (typeof response == 'string') {
  //         response = JSON.parse(response);
  //       }
  //       if (!response['email']) {
  //         throw new BadRequestException('Token Data is Wrong')
  //       }
  //       return this.findByCustomerEmail(response['email']).pipe(
  //         mergeMap((customer: CustomerEntity) => {
  //           if (!customer) {
  //             const newCust = new CustomerEntity();
  //             newCust.uuid = loginData.type == LoginType.FIREBASE ? response['uid'] : crypto.randomBytes(16).toString("hex");
  //             newCust.email = response['email'];
  //             newCust.username = response['displayName'] || response['name'] || loginData['name'];
  //             if (loginData.type == LoginType.FACEBOOK) {
  //               newCust.facebook = response['id'];
  //             }
  //             return from(this.customerRepo.save(newCust)).pipe(
  //               mergeMap((customer: CustomerEntity) => {
  //                 const payload = { username: customer.username, id: customer.id, role: role == UserRole.SHOP && customer.shop_id ? UserRole.SHOP : UserRole.CUSTOMER, shop_id: customer.shop_id };
  //                 return this.authService
  //                   .generateJWT(payload)
  //                   .pipe(map((jwt: string) => {
  //                     let user = customer as Customer
  //                     user.shop_id = null,
  //                       user.token = jwt
  //                     return user;
  //                   }));
  //               }),
  //             );
  //           } else {
  //             if (loginData.type == LoginType.FACEBOOK) {
  //               this.customerRepo.update(customer.id, { facebook: response['id'] });
  //             }
  //             const payload = { username: customer.username, id: customer.id, role: role == UserRole.SHOP && customer.shop_id ? UserRole.SHOP : UserRole.CUSTOMER, shop_id: customer.shop_id };
  //             return this.authService
  //               .generateJWT(payload)
  //               .pipe(map((jwt: string) => {
  //                 let user = customer as Customer
  //                 user.token = jwt
  //                 return user;
  //               }));
  //           }
  //         }),
  //       );
  //     }),
  //     catchError(err => throwError(err)),
  //   );
  // }



  async updateInfo(id, data) {
    await this.customerRepo.update(id, data);
    return { success: 'updated!' };
  }


  async findByCustomerEmailPromise(email: string): Promise<Customer> {
    return await this.customerRepo.findOne({
      where: { email },
    })
  }
  findByCustomerEmail(email: string): Observable<CustomerEntity> {
    return from(this.customerRepo.findOne({ where: { email }})).pipe(
      map((customer: CustomerEntity) => {
        return customer;
      }),
    );
  }

  async findByCustomerPhNo(phone: string): Promise<Customer> {
    return await this.customerRepo.findOne({
      where: { phone },
    });
  }

  async sendOtp(email, otp) {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: 'casperlay.akm@gmail.com',
        to: email,
        subject: "Requested OTP",
        generateTextFromHTML: true,
        html: "<h1>" + otp + "</h1>",
      };
      emailTransport.sendMail(mailOptions, (err, res) => {
        if (err) console.log(err);
        emailTransport.close();
      });
    });
  }

  // verfyGoogleToken(token) {
  //   let options = {
  //     url: 'https://oauth2.googleapis.com/tokeninfo?access_token=' + token,
  //     method: 'GET',
  //   };
  //   return new Promise((resolve, reject) => {
  //     request(options, (err, res, body) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(body)
  //     });
  //   });
  // }
  // verfyFacebookToken(token) {
  //   let options = {
  //     url: "https://graph.facebook.com/me?fields=['name','email']&access_token=" + token,
  //     method: 'GET',
  //   };
  //   return new Promise((resolve, reject) => {
  //     request(options, (err, res, body) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(body)
  //     });
  //   });
  // }
}
