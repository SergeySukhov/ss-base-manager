import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'ss-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    FormBuilder
  ]
})
export class LoginComponent implements OnInit {
  @Input() error: string | null = null;
  @Output() submitEvent = new EventEmitter<{ login: string; password: string; }>();

  form: FormGroup;
  public loginInvalid = false;
  private formSubmitAttempt = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submit() {
    console.log("!! | submit | this.form.value", this.form.value)
    if (this.form.valid) {
      this.submitEvent.emit(this.form.value);
    }
  }

}
