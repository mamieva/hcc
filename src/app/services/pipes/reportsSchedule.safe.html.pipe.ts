import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'reportsScheduleSafeHtml'})
export class ReportsScheduleSafeHtmlPipe {
  constructor(private sanitizer: DomSanitizer){}

  transform(html: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}