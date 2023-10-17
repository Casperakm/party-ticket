import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    // private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  generateJWT(user): Observable<string> {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return from(this.jwtService.signAsync({ ...payload }));
  }

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  hashPasswordRun(password: string): string {
    return bcrypt.hash(password, 12);
  }

  comparePasswordsRun(
    newPassword: string,
    passwortHash: string,
  ): boolean {
    return bcrypt.compare(newPassword, passwortHash);
  }

  comparePasswords(
    newPassword: string,
    passwortHash: string,
  ): Observable<any | boolean> {
    return from<any | boolean>(bcrypt.compare(newPassword, passwortHash));
  }

}