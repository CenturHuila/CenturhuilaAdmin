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
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass('modal-lg');
  }
  closeModal(){
    this.modalRef.hide();
    this.loadData();
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.touristProvidersData.slice(startItem, endItem);
  }


}
