import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';
import Swal from 'sweetalert2'
import { stringify } from 'querystring';
import { NgxSpinnerService } from 'ngx-spinner';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  repeatedFiles: string[] = [];

  constructor(private spinner: NgxSpinnerService) { }


  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.mouseSobre.emit(true);
    this._prevenirDetener(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {

    const transferencia = this._getTransferencia(event);
    if (!transferencia) {
      return;
    }

    this._extraerArchivos(transferencia.files);

    this._prevenirDetener(event);

    this._showRepeatedFilesMsg();

    this.mouseSobre.emit(false);
  }

  //Para extender la compatibilidad con navegadores
  private _getTransferencia(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archivosLista: FileList) {

    this.repeatedFiles = [];

    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {

      const archivoTemporal = archivosLista[propiedad];

      if (this._archivoPuedeSerCargado(archivoTemporal)) {
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      } else {
        this.repeatedFiles.push(archivoTemporal.name)
      }
    }


  }

  // Validaciones

  private _archivoPuedeSerCargado(archivo: File): boolean {
    if (!this._archivoDropeado(archivo.name) && this._esImagen(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }

  private _prevenirDetener(evento) {
    evento.preventDefault();
    evento.stopPropagation();
  }

  _archivoDropeado(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.fileName == nombreArchivo) {

        return true;
      }
    }
    return false;
  }

  private _esImagen(tipoArchivo: string): boolean {
    return (tipoArchivo == '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');
  }

  private _showRepeatedFilesMsg() {
    if (this.repeatedFiles.length > 0) {
      let repeatedNames: string = "";
      this.repeatedFiles.forEach(name => {
        repeatedNames += name + " - ";
      });
      Swal.fire({
        title: 'Repeated files!',
        text: repeatedNames,
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
    }

  }
}
