import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TouristProvidersService } from '../../services/tourist-providers/tourist-providers.service';

@Component({
  selector: 'app-tourist-providers',
  templateUrl: 'tourist-providers.component.html',
  styleUrls: ['./tourist-providers.component.css']
})
export class TouristProvidersComponent implements OnInit{

  modalRef?: BsModalRef;
  touristProvidersData = [];
  returnedArray?: string[];
  documentToEdit = {};
  constructor(private modalService: BsModalService,
    private touristProvidersService: TouristProvidersService) { }

  ngOnInit(){
    this.loadData();
  }
  loadData(){
    this.touristProvidersService.get().subscribe(response => {
      this.touristProvidersData = [];
      response.forEach(element => {
        this.touristProvidersData.push(element.payload.doc.data());
      }); 
      this.returnedArray = this.touristProvidersData.slice(0, 10);
    })
  }
  openModal(template: TemplateRef<any>, documentToEdit) {
    this.documentToEdit = documentToEdit;
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
