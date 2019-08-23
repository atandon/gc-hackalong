import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http'
import { Product, User } from './interfaces';

// @ts-ignore
window.isActive = 1;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http : HttpClient) { }

  private endpoint : string = "http://0ea8ebdf.ngrok.io";

  addUser(user : User) {
    return this.http.post(this.endpoint + '/user/register', { user });
  }

  getUser(email : string, password : string) {
    return this.http.post<User>(this.endpoint + '/user/login', {
      user: {
        email,
        password
      }
    });
  }

  getProducts() {
    // @ts-ignore
    return this.http.get<Product[]>(this.endpoint + `/products?active=${window.isActive}`);
  }

  addComment(productId : Number, message : String) {
    return this.http.post(this.endpoint + "/products/" + productId + "/comment", {
      message
    });
  }

}

