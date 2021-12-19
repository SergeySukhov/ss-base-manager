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
  @Input() set errorMessage(value: string) {
    this.loginInvalid = value;
  }
  @Input() isLoading = false;
  @Input() isRemember = true;
  @Input() isUnlock = false;
  @Output() submitEvent = new EventEmitter<{ username: string; password: string; needRemember: boolean }>();

  public form: FormGroup;
  public loginInvalid = "";

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onInputKeyDown() {
    this.loginInvalid = "";
  }

  submit() {
    if (this.form.valid) {
      this.submitEvent.emit({ username: this.form.controls['username'].value, password: this.form.controls['password'].value, needRemember: this.isRemember });
    } else {
      this.form.markAllAsTouched();
    }
  }

  handleKey(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.submit();
    }
  }

}
