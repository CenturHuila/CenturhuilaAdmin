import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TourOperatorsService } from '../../services/tour-operators/tour-operators.service';
import { TouristAttractionsService } from '../../services/tourist-attractions/tourist-attractions.service';

@Component({
  selector: 'app-tour-operators',
  templateUrl: 'tour-operators.component.html',
  styleUrls: ['./tour-operators.component.css']
})
export class TourOperatorsComponent implements OnInit{

  modalRef?: BsModalRef;
  touristProvidersData = [];
  constructor(private modalService: BsModalService,
    private tourOperatorsService: TourOperatorsService) { }

  ngOnInit(){
    this.loadData();
  }
  loadData(){
    this.touristProvidersData = [];
    this.tourOperatorsService.get().subscribe(response => {
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
