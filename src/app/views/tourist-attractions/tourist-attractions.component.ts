import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TouristAttractionsService } from '../../services/tourist-attractions/tourist-attractions.service';

@Component({
  selector: 'app-tourist-attractions',
  templateUrl: 'tourist-attractions.component.html',
  styleUrls: ['./tourist-attractions.component.css']
})
export class TouristAttractionsComponent implements OnInit{

  modalRef?: BsModalRef;
  touristProvidersData = [];
  constructor(private modalService: BsModalService,
    private touristAttractionsService: TouristAttractionsService) { }

  ngOnInit(){
    this.loadData();
  }
  loadData(){
    this.touristProvidersData = [];
    this.touristAttractionsService.get().subscribe(response => {
      response.forEach(element => {
        this.touristProvidersData.push(element.payload.doc.data());
      }); 
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


}
