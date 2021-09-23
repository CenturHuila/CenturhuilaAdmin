import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: 'image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperModalComponent implements OnInit{

  @Input() maintainAspectRatio = true;
  @Input() imageIn;
  @Output() imageBase64 = new EventEmitter();
  @Output() imageFile = new EventEmitter();
  
  ngTxtPhoto = '';
  image: string;
  imageChangedEvent: any;
  imageModal: string;
  modalRef: BsModalRef;
  imageBase64Crop: any = '';
  showCropper = true;
  errorSize = false;

  constructor(
    private modalService: BsModalService) { }

  ngOnInit(){}
  validator(template, event) {
    if (event.target.files.length && event.target.files[0].size <= 512000) {
      this.openModal(template, event);
      console.log(document.getElementsByClassName('modal').length)
      if (document.getElementsByClassName('modal')[1]) {
        document.getElementsByClassName('modal')[1].classList.add('custom-modal-background');
      }
    } else {
      this.ngTxtPhoto = '';
      this.errorSize = true;
      this.imageChangedEvent = null;
      this.image = '';
      // this.deleteImg();
    }
  }

  cropperReady() {
    this.image = this.imageModal;
    console.log(this.imageModal);
    const imageName = 'name.png';
    const base64 = this.imageModal.split(',')[1];
    const imageBlob = this.dataURItoBlob(base64);
    const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
    this.imageBase64.emit(this.imageModal);
    this.imageFile.emit(imageFile);
    this.closeModalPhoto();
  }
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
 }

  openModal(template: TemplateRef<any>, event: any) {
    this.modalRef = this.modalService.show(template);
    event ? this.fileChangeEvent(event) : null;
  }
  fileChangeEvent(event: any): void {
    event.target ? (this.imageChangedEvent = event) : (this.imageBase64Crop = event);
    this.showCropper = true;
    this.errorSize = false;
  }

  closeModalPhoto() {
    this.modalRef.hide();
    this.ngTxtPhoto = '';
  }

  imageCropped(event: ImageCroppedEvent) {
    this.imageModal = event.base64;
  }

  deletImage(){
    this.imageIn = ''
    this.imageBase64.emit('');
  }
}
