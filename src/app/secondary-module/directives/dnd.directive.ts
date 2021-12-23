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

  @Input() fileFormat: string | undefined;
  @Output() fileDropped = new EventEmitter<FileList>();

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    
    if (evt.dataTransfer?.files && evt.dataTransfer?.items[0]?.kind === "file" && (!this.fileFormat || evt.dataTransfer?.items[0]?.type.includes(this.fileFormat.replace(".", "").trim()))) {
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
    this.fileOver = false;
    this.wrongFile = false;

    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
