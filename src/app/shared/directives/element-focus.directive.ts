import { Directive, ElementRef, Renderer, DoCheck, HostListener } from '@angular/core';

@Directive({
  selector: '[appElementFocus]'
})
export class ElementFocusDirective implements DoCheck {

  constructor(public el: ElementRef, public renderer: Renderer) { }

  ngDoCheck() {
    const element = this.el.nativeElement;
    const type = element.localName;
    const textArea = type === 'textarea';
    let hasVal;

    if (type === 'select') {
      hasVal = element.selectedIndex > -1;
    } else {
      hasVal = element.value.length > 0;
    }

    if (hasVal) {
      this.renderer.setElementClass(element, 'active', true);
      this.renderer.setElementClass(element.parentElement, 'element-hasvalue', true);
    } else {
      this.renderer.setElementClass(element, 'active', false);
      this.renderer.setElementClass(element.parentElement, 'element-hasvalue', false);
    }
  }

  @HostListener('focus', ['$event']) onFocus(e) {
    this.renderer.setElementClass(this.el.nativeElement.parentElement, 'element-focus', true);
    return;
  }
  @HostListener('blur', ['$event']) onblur(e) {
    this.renderer.setElementClass(this.el.nativeElement.parentElement, 'element-focus', false);
    return;
  }

}
