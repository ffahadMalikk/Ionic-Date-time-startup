import { Component, Input, OnChanges, EventEmitter, Output, SimpleChange, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnChanges, OnDestroy, OnInit {
  @Output() answerChanged = new EventEmitter();
  @Input() errorMessages: string[] = [];
  @ViewChild('datetime') datetime: IonDatetime;

  public errors = [];
  public answerForm: FormGroup = new FormGroup({ answer: new FormControl() });
  public answer: string;
  public datetimePickerOpened = false;
  public locale = 'en-US';
  public preventFocusOnTimePickerIntv;
  public datePickerModeIntv;
  public isMonthYearPicker = false;
  oldValue;
  constructor( ) {}
  ngOnInit(): void {
  }
  ngOnChanges(changes?: { question?: SimpleChange; errorMessages?: SimpleChange }) {
    if (changes && changes.question) {
      this.setForm();
    }
  }

  ngOnDestroy(): void {
    this.preventFocusOnTimePickerIntv = clearInterval(this.preventFocusOnTimePickerIntv);
    this.datePickerModeIntv = clearInterval(this.datePickerModeIntv);
  }

  setForm() {
    this.datePickerModeIntv = setInterval(() => {
      this.isMonthYearOpen();
    }, 2000);
    // this.answerForm = this.formBuilder.group({
    //   answer: [null],
    // });
  }

  setAnswer() {
    this.answerChanged.emit();
  }

  clearAnswer() {
    this.setForm();
    this.setAnswer();
    (document.querySelector('#date input') as HTMLElement).blur();
  }

  confirm() {
    this.datetime.confirm();
    this.oldValue = this.answerForm.value.answer;
    this.datetimePickerOpened = false;
  }

  cancel() {
    if (this.oldValue) {
      this.answerForm.value.answer = this.oldValue;
      this.setAnswer();
    } else {
      this.clearAnswer();
    }
    this.toggleDateTimePicker(false);
  }

  toggleDateTimePicker(open: boolean) {
    this.datetimePickerOpened = open;
    this.preventFocusOnTimePicker();
  }

  preventFocusOnTimePicker() {
    if (this.preventFocusOnTimePickerIntv) {
      this.preventFocusOnTimePickerIntv = clearInterval(this.preventFocusOnTimePickerIntv);
    }

    if (this.datetimePickerOpened) {
      this.preventFocusOnTimePickerIntv = setInterval(() => {
        const inputNumberTime = document
          .querySelector('ion-datetime')
          ?.shadowRoot.querySelector('ion-picker-internal')
          ?.shadowRoot.querySelector('input');
        const inputNumberDateTime = document.querySelector('ion-popover ion-picker-internal')?.shadowRoot.querySelector('input');
        if (inputNumberTime) {
          inputNumberTime.readOnly = true;
        }
        if (inputNumberDateTime) {
          inputNumberDateTime.readOnly = true;
          this.preventFocusOnTimePickerIntv = clearInterval(this.preventFocusOnTimePickerIntv);
        }
      }, 100);
    }
  }

  isMonthYearOpen() {
    const datePicker = document.getElementsByClassName('show-month-and-year');
    this.isMonthYearPicker = datePicker.length > 0;
  }

  setPicker() {
    const el = document.getElementById('datePicker');
    this.isMonthYearPicker = false;
    el.classList.remove('show-month-and-year');
  }

  formattedAnswer(): string {
    if (this.answerForm.value && this.answerForm.value.answer) {
      const answer = this.answerForm.value.answer;
          return formatDate(answer, 'dd/MM/YYYY, h:mm a', this.locale);
    }
    return null;
  }
}



