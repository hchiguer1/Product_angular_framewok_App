import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ProductService} from "../services/product.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-gpt',
  templateUrl: './gpt.component.html',
  styleUrls: ['./gpt.component.css']
})
export class GptComponent implements OnInit{

  queryFormGroup!:FormGroup;
  result : any;
  error:any;
  messages=[
    {role:"system",content:"Hello"}
  ]
  constructor(private fb:FormBuilder,private http : HttpClient) {
  }
  ngOnInit() {
    this.queryFormGroup=this.fb.group({
      query:this.fb.control("")
    });
  }

  handleAskGpt() {
    this.messages.push({
      role:"user", content : this.queryFormGroup.value.query
      }
    )
    let httpHeaders=new HttpHeaders()
      .set("Authorization","Bearer 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");
    let url="https://api.openai.com/v1/chat/completions";
    let payload={
      model:"gpt-3.5-turbo",
      messages:[]
    }
    this.http.post(url,payload,{headers : httpHeaders}).subscribe({
      next:(resp)=>{
        this.result=resp;
      },
      error:(err)=>{
        this.error=err;
      }
    })
  }
}
