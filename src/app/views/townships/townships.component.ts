import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TownshipsService } from '../../services/townships/townships.service';

@Component({
  selector: 'app-townships',
  templateUrl: 'townships.component.html',
  styleUrls: ['./townships.component.css']
})
export class TownshipsComponent implements OnInit{

  modalRef?: BsModalRef;
  touristProvidersData = [];
  constructor(private modalService: BsModalService,
    private townshipsService: TownshipsService) { }

  ngOnInit(){
    this.loadData();
  }
  loadData(){
    this.touristProvidersData = [];
    this.townshipsService.get().subscribe(response => {
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
