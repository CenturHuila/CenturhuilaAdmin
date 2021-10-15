import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TouristAttractionsService } from '../../services/tourist-attractions/tourist-attractions.service';

@Component({
  selector: 'app-tourist-attractions',
  templateUrl: 'tourist-attractions.component.html',
  styleUrls: ['./tourist-attractions.component.css']
})
export class TouristAttractionsComponent implements OnInit {

  modalRef?: BsModalRef;
  touristProvidersData = [];
  returnedArray?: string[];
  documentToEdit = {};
  constructor(private modalService: BsModalService,
    private touristAttractionsService: TouristAttractionsService) { }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.touristAttractionsService.get().subscribe(response => {
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
  closeModal() {
    this.modalRef.hide();
    this.loadData();
  }
  delete(slug) {
    console.log(slug)
    this.touristAttractionsService.delete(`TA_${slug}`).then(() => {
      console.log("Document successfully deleted!");
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
