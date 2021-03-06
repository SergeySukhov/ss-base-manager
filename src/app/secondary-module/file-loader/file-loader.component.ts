import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ss-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.scss']
})
export class FileLoaderComponent implements OnInit {

  @Input() acceptFormats: string[] | undefined;
  @Input() isMultiple: boolean | undefined = false;
  @Output() filesChanged = new EventEmitter<any>();

  public files: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onFileDropped(event: any) {
    if (event instanceof FileList) {
      this.prepareFilesList(event);
    }
  }

  fileBrowseHandler(files?: any) {
    if (!files.target?.files) {
      return;
    }
    this.prepareFilesList(files.target?.files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.filesChanged.emit(this.files);
  }

  prepareFilesList(files: FileList) {
    if (this.isMultiple) {
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
      }
    } else {
      this.files.unshift(files[0]);
      this.files.splice(1);
    }

    this.filesChanged.emit(this.files);
  }

  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
