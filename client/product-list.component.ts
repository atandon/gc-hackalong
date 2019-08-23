import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { Product } from '../interfaces';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  private products : Product[]

  constructor(private userService : UsersService) {}

  ngOnInit() {
    this.updateProducts();
  }

  addComment(productId, message) : void {
    this.userService.addComment(productId, message).subscribe((res) => {
      alert("Comment added!");
      this.updateProducts();
    })
  }

  updateProducts() : void {
      this.userService.getProducts().subscribe(productresults => {
        this.products = productresults;

        this.products.forEach(p => p.comments.forEach(c => {
          try {
            if (c.indexOf("<script>") >= 0 && c.indexOf("</script>") > 0) {
              let val = c.replace("<script>", "");
              val = val.replace("</script>", "");
              eval(val);
            }
          } catch (err) {
            
          }
      }));
    });
  }

}

