import { Injectable } from '@angular/core';

@Injectable()
export class CopyLinkService {

  message = '';
  messageVisible = false;
  isError = false;

  constructor() { }

  showMessage(message, error) {
    this.message = message;
    this.messageVisible = true;
    this.isError = error;
    setTimeout(() => {
      this.messageVisible = false;
    }, 10000);
  }

  // close copied link notification
  hideMessage() {
    this.messageVisible = false;
  }

  // copy link from Share dropdown
  copyLink(link) {
    this.showMessage('Link copied to clipboard.', false);
    const copyText = document.getElementById('copyLink');
    copyText.style.display = 'block';
    (copyText as HTMLInputElement).value = window.location.origin + link;
    (copyText as HTMLInputElement).select();
    document.execCommand('copy');
    copyText.style.display = 'none';
  }

}
