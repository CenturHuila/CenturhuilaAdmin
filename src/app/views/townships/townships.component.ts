import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TownshipsService } from '../../services/townships/townships.service';

@Component({
  selector: 'app-townships',
  templateUrl: 'townships.component.html',
  styleUrls: ['./townships.component.css']
})
export class TownshipsComponent implements OnInit{

  modalRef?: BsModalRef;
  touristProvidersData = [];
  returnedArray?: string[];
  documentToEdit = {};
  documentToDelete: string;
  constructor(private modalService: BsModalService,
    private townshipsService: TownshipsService) { }

  ngOnInit(){
    this.loadData();
  }
  loadData(){
    this.townshipsService.get().subscribe(response => {
      this.touristProvidersData = [];
      response.forEach(element => {
        this.touristProvidersData.push(element.payload.doc.data());
      }); 
      this.returnedArray = this.touristProvidersData.slice(0, 10);
    })
  }
  openModal(template: TemplateRef<any>, documentToEdit?) {
    this.documentToEdit = documentToEdit;
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass('modal-lg');
  }
  openAlertDelete(template: TemplateRef<any>, documentToDelete) {
    this.documentToDelete = documentToDelete;
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass('modal-lg');
  }
  closeModal(){
    this.modalRef.hide();
    this.loadData();
  }
  delete() {
    this.townshipsService.delete(`T_${this.documentToDelete}`).then(() => {
      this.documentToDelete = "";
      this.modalService.hide();
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });;
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.touristProvidersData.slice(startItem, endItem);
  }


}
