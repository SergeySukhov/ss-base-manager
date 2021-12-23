import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ss-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.scss']
})
export class FileLoaderComponent implements OnInit {

  @Input() acceptFormat: string | undefined;
  @Output() filesAdded = new EventEmitter<any>();

  public files: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onFileEnter(event: any) {
    console.log("!! | onFileEnter | event", event)

  }

  onFileDropped(event: any) {
    if (event instanceof FileList) {
      console.log("!! | onFileDropped | event", event)
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
  }


  prepareFilesList(files: FileList) {
    // for (const item of files) {
    //   item.progress = 0;
    //   this.files.push(item);
    // }
    this.files.unshift(files[0]);
    this.files.splice(1);
    this.filesAdded.emit(this.files);
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
