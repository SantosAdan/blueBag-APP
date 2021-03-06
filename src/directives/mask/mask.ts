import {Directive, Attribute} from '@angular/core';
import {NgModel} from "@angular/forms";

@Directive({
  selector: '[mask]', // Attribute selector
  host: {
    '(keyup)': 'onInputChange()',
    '(ionFocus)': 'onInputChange()'
  }
})
export class MaskDirective {

  maskPattern: string;
  placeHolderCounts: number;
  dividers: string[];
  modelValue: string;
  viewValue: string;

  constructor(
      public model: NgModel,
      @Attribute("mask") maskPattern: string
  ) {
    this.dividers = maskPattern.replace(/\*/g, "").split("");
    this.dividers.push(" ");
    this.generatePattern(maskPattern);
  }

  onInputChange() {
    this.modelValue = this.getModelValue();
    let stringToFormat = this.modelValue;
    if (stringToFormat != undefined) {
      if (stringToFormat.length < 10) {
        stringToFormat = this.padString(stringToFormat);
      }

      this.viewValue = this.format(stringToFormat);
      this.model.viewToModelUpdate(this.modelValue);
      this.model.valueAccessor.writeValue(this.viewValue)
    }
  }

  generatePattern(patternString) {
    this.placeHolderCounts = (patternString.match(/\*/g) || []).length;
    for (let i = 0; i < this.placeHolderCounts; i++) {
      patternString = patternString.replace('*', "{" + i + "}");
    }
    this.maskPattern = patternString;
  }

  format(s) {
    let formattedString = this.maskPattern;
    for (let i = 0; i < this.placeHolderCounts; i++) {
      formattedString = formattedString.replace("{" + i + "}", s.charAt(i));
    }
    return formattedString;
  }

  padString(s) {
    let pad = "          ";
    return (s + pad).substring(0, pad.length);
  }

  getModelValue() {
    let modelValue = this.model.value;

    if (this.model.value != null) {
      for (let i = 0; i < this.dividers.length; i++) {
        while (modelValue.indexOf(this.dividers[i]) > -1) {
          modelValue = modelValue.replace(this.dividers[i], "");
        }
      }
      return modelValue;
    }
  }
}
