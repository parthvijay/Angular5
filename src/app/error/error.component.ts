import { Component, OnInit } from '@angular/core';
import { ErrorService } from './error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  public errorDescription: String;

  constructor(
    public errorService: ErrorService
  ) { }

  ngOnInit() {
    this.errorDescription = this.errorService.getErrorCode();
  }

}
