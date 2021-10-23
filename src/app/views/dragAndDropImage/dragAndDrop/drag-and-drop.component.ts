import { Component, Output, Input, EventEmitter, OnInit, DoCheck, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Observable } from 'rxjs';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss'],
  // providers: [ImagePreviewService]
})
export class DragAndDropComponent implements OnInit, DoCheck {
  files: any = [];
  data: any = [];
  imgDetails = null;
  config = {
    keyboard: false,
    ignoreBackdropClick: true
  };
  path: string;
  @Output() sendFile = new EventEmitter<any>();
  @Input() filesInput: any[] = [];
  // @Input() singleImg?: boolean;
  @Output() delete = new EventEmitter<any>();
  @Input() id: string;
  // @Output() updateFile = new EventEmitter<any>();
  @Input() isDetail = false;
  errorSize = false;
  errorType = false;
  hidePhoto = true;
  base64TrimmedURL: string;
  generatedImage: string;
  base64DefaultURL: string;
  imageName: string;
  name: string;
  imageShow: any;
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    // this.path = environment.ftp;
    if (this.files && this.filesInput && this.files.length !== this.filesInput.length) {
      for (const file of this.filesInput) {
        if(!file.name){
          this.data.push(file);
          let imgName = file.split('galery%2F')[1];
          imgName = imgName.split('?alt')[0];
          imgName = imgName.replace(/%20/g, ' ')
          this.files.push(imgName);
        } else{
          this.data.push(file);
          this.files.push(file.name);
        }
      }
    }
  }

  ngDoCheck() {
    // esto se hace para cargar los archivos en el listado cuando se quiere editar
  }

  uploadFile(event) {
    if (event[0].size <= 52428800 && (event[0].type.includes('image/'))) {
      this.errorSize = false;
      this.errorType = false;
      for (let index = 0; index < event.length; index++) {
        const element = event[index];
        this.data.push(element);
        this.files.push(element.name);
        this.sendFile.emit(this.data);
      }
      // this.updateFile.emit(event);
    } else {
      if (event[0].size <= 52428800) {
        this.errorType = true;
      } else {
        this.errorSize = true;
      }
    }
  }

  // addSingleFile(event) {
  //   if (event[0].size <= 52428800 && (event[0].type.includes('image/') || event[0].type.includes('application/pdf'))) {
  //     this.errorSize = false;
  //     this.errorType = false;
  //     const element = event[0];
  //     this.data = [element];
  //     this.files = [element.name];
  //     this.sendFile.emit(this.data);
  //   } else {
  //     if (event[0].size <= 52428800) {
  //       this.errorType = true;
  //     } else {
  //       this.errorSize = true;
  //     }
  //   }
  // }

  deleteAttachment(index) {
    if (this.id) {
      this.delete.emit(this.data[index]);
      this.files.splice(index, 1);
      this.data.splice(index, 1);
      this.sendFile.emit(this.data);
    } else {
      this.files.splice(index, 1);
      this.data.splice(index, 1);
      this.sendFile.emit(this.data);
    }
  }

  // openModal(template: TemplateRef<any>, img: any) {
  //   const reader: any = new FileReader();
  //   reader.readAsDataURL(this.data[img]);
  //   reader.onload = _event => {
  //     this.imgDetails = reader.result;
      // if (this.data[img].type.includes('pdf')) {
      //   const pdfWindow = window.open('');
      //   this.imgDetails = this.imgDetails.replace('data:application/pdf;base64,', '');
      //   pdfWindow.document.write(`<iframe width="100%" height="100%" src="data:application/pdf;base64,${this.imgDetails}"></iframe>`);
      // } else {
        // this.modalRef = this.modalService.show(template, this.config);
        // this.modalRef ? document.getElementsByClassName('modal')[1].classList.add('custom-modal-background') : null;
      // }
  //   };
  // }

  closeModal() {
    this.modalRef.hide();
  }

  openFileInNewTab(path: string) {
    // this.paraclinicalExamTypeService.openFile(path);
  }
  imgSelect(event) {
    const windowOPen = true;
    this.name = event.name;
    this.getBase64ImageFromURL(event.img).subscribe((base64Data: string) => {
      this.base64TrimmedURL = base64Data;
      this.createBlobImageFileAndShow();
    });
  }
  /* Method to fetch image from Url */
  getBase64ImageFromURL(url: string): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      // create an image object
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }
  /**Method that will create Blob and show in new window */
  createBlobImageFileAndShow(): void {
    this.dataURItoBlob(this.base64TrimmedURL).subscribe((blob: Blob) => {
      const imageBlob: Blob = blob;
      const imageName: string = this.name;
      const imageFile: File = new File([imageBlob], imageName, {
        type: 'image/png'
      });
      // if (this.singleImg) {
      //   this.data = [imageFile];
      //   this.files = [imageFile.name];
      //   this.sendFile.emit(this.data);
      // } else {
        this.data.push(imageFile);
        this.files.push(imageFile.name);
        this.sendFile.emit(this.data);
      // }
    });
  }
  /* Method to convert Base64Data Url as Image Blob */
  dataURItoBlob(dataURI: string): Observable<Blob> {
    return new Observable((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/jpeg' });
      observer.next(blob);
      observer.complete();
    });
  } /* Method to create base64Data Url from fetched image */
  getBase64Image(img: HTMLImageElement): string {
    // We create a HTML canvas object that will create a 2d image
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    const dataURL: string = canvas.toDataURL('image/png');
    this.base64DefaultURL = dataURL;
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }
  /* Start event modal image preview */
  showPreview(template: TemplateRef<any>, position:any, imageName:any) {
    this.imageName = imageName;
    if (!this.data[position].includes('https://firebase')){
      const reader: any = new FileReader();
      reader.readAsDataURL(this.data[position]);
      reader.onload = _event => {
        this.imageShow = reader.result;
        this.openModal(template);
        // dataPreview.image = reader.result;
        // this.imagePreviewService.imagePreviewdata.next(dataPreview);
      };      
    } else {
      this.imageShow = this.data[position];
      this.openModal(template);
    }
    // dataPreview.practitioner = this.practiAndPatient.practitioner;
    // dataPreview.patient = this.practiAndPatient.patient;

    // if (position >= 0) {
    //   const reader: any = new FileReader();
    //   reader.readAsDataURL(this.data[position]);
    //   reader.onload = _event => {
    //     this.imgDetails = reader.result;
    //     dataPreview.image = reader.result;
    //     // this.imagePreviewService.imagePreviewdata.next(dataPreview);
    //   };
    // } 
    // // else {
    //   dataPreview.image = image;
    //   this.imagePreviewService.imagePreviewdata.next(dataPreview);
    // }
  }
  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
      if (document.getElementsByClassName('modal')[1]) {
        document.getElementsByClassName('modal')[1].classList.add('custom-modal-background');
      }
  }
}
