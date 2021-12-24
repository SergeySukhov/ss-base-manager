import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[dndShaker]'
})
export class DndDirective {
  @HostBinding('class.fileover') fileOver: boolean = false;
  @HostBinding('class.wrong-file') wrongFile: boolean = false;

  @Input() fileFormats: string[] | undefined;
  @Output() fileDropped = new EventEmitter<FileList>();

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.dataTransfer?.files && evt.dataTransfer?.items[0]?.kind === "file"
      && (!this.fileFormats
        || this.fileFormats.some(format => evt.dataTransfer?.items[0]?.type.includes(format.replace(".", "").trim())))
    ) {
      this.fileOver = true;
    } else {
      this.wrongFile = true;
    }
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    this.wrongFile = false;
  }

  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer?.files;
    if (!files?.length || this.wrongFile) {
    } else {
      this.fileDropped.emit(files);
    }
    this.fileOver = false;
    this.wrongFile = false;
  }
}
