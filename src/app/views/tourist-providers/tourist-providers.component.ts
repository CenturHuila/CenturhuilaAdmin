import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TouristProvidersService } from '../../services/tourist-providers/tourist-providers.service';

@Component({
  selector: 'app-tourist-providers',
  templateUrl: 'tourist-providers.component.html',
  styleUrls: ['./tourist-providers.component.css']
})
export class TouristProvidersComponent implements OnInit{

  modalRef?: BsModalRef;
  touristProvidersData = [];
  constructor(private modalService: BsModalService,
    private firebaseService: TouristProvidersService) { }

  ngOnInit(){
    this.loadData();
  }
  loadData(){
    this.touristProvidersData = [];
    this.firebaseService.get().subscribe(response => {
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
