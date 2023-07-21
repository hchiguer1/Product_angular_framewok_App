import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  /*products:Array<any>=[
    {id:1,name:"Computer",price:4500,checked:false},
    {id:2,name:"Printer",price:1500,checked:true},
    {id:3,name:"Server",price:55500,checked:false}
  ]*/
  //products$!:Observable<Array<Product>>;

  constructor(private productService:ProductService,
              private router : Router, public  appState : AppStateService) {
  }

  handleCheckProduct(product: Product) {
    this.productService.checkProduct(product)
      .subscribe({
        next :updatedProduct=> {
        product.checked = !product.checked;
          }
      })
  }

  ngOnInit() {
    this.getProduct()
    //this.products$=this.productService.getProduct();
  }
  getProduct(){
    //this.appState.setProductState({status : "LOADING"});
    this.productService.getProduct(this.appState.productState.keyword,this.appState.productState.currentPage,this.appState.productState.pageSize)
      .subscribe({
        next: (resp) => {
          //this.appState.productState.products=resp.body as Product[];
          let products=resp.body as Product[];
          let totalProducts:number=parseInt(resp.headers.get('x-total-count')!);
          //this.appState.productState.totalProducts=totalProducts;
          let totalPages= Math.floor(totalProducts/this.appState.productState.pageSize);
          if(totalProducts % this.appState.productState.pageSize!=0){
            ++totalPages;}
          this.appState.setProductState({
            products:products,
            totalProducts : totalProducts,
            totalPages: totalPages,
            status : "LOADED"
          })
          },
        error:err => {
          console.log(err);
          this.appState.setProductState({
            status : "ERROR",
            errorMessage : err
          })
        }
      })
  }
  handleDelete(product: Product) {
    if(confirm("Are sure you sure"))
      this.productService.deleteProduct(product.id).subscribe({
        next:value => {
        //this.productService.getProduct();
        //this.appState.productState.products=this.appState.productState.products.filter((p:any)=>p.id!=product.id);
        this.getProduct();
        }
    })
  }

  handleGoToPage(keyword:string="",page: number) {
    this.appState.productState.currentPage=page;
    this.appState.productState.keyword=keyword;
    this.getProduct();
  }

  handleEdit(product: Product) {
    this.router.navigateByUrl(`/admin/editProduct/${product.id}`);
  }
}
