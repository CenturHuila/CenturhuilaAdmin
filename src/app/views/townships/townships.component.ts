import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TownshipsService } from '../../services/townships/townships.service';
import { UsersService } from '../../services/users/users.service';
import { ZonesService } from '../../services/zones/zones.service';

@Component({
  selector: 'app-townships',
  templateUrl: 'townships.component.html',
  styleUrls: ['./townships.component.css']
})
export class TownshipsComponent implements OnInit{

  modalRef?: BsModalRef;
  touristProvidersData = [];
  touristAllProvidersData = [];
  returnedArray?: string[];
  documentToEdit = {};
  results: boolean = true;
  documentToDelete: string;
  zoneData: any[];
  returnedArrayZones: any[];
  valueToSearch: string = "";
  
  constructor(private modalService: BsModalService,
    private townshipsService: TownshipsService,
    private userService: UsersService,
    private router: Router,
    private zonesService: ZonesService) { }

  ngOnInit(){
    this.loadData();
    this.userService.getCurrentUser().then((res =>{
      if (res) {
        
      }else{
        this.router.navigate(['/login'])
      }
    }));
  }
  loadData(){
    this.results=true
    this.townshipsService.get().subscribe(response => {
      this.touristProvidersData = [];
      response.forEach(element => {
        this.touristProvidersData.push(element.payload.doc.data());
      }); 
      this.touristAllProvidersData = this.touristProvidersData;
      this.returnedArray = this.touristProvidersData.slice(0, 10);
    })

    this.zonesService.get().subscribe(response => {
      this.zoneData = [];
      response.forEach(element => {
        this.zoneData.push(element.payload.doc.data());
      }); 
      this.returnedArrayZones = this.zoneData.slice(0, 10);
      
    })
  }

  loadDataFilterByZones(zone: string) {
    //filtrado Services
    this.returnedArray = [];
    this.returnedArray = this.touristAllProvidersData.filter((item: any) => {
      if(item.zone === (zone)){
        return item;
        this.results=true
      }
    });
    this.touristProvidersData = this.returnedArray;
  }

  loadDaraFilterByName(name: string){
    this.returnedArray = [];
    this.returnedArray = this.touristAllProvidersData.filter((item: any) => {
      if(item.name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))){
        this.results=true
        return item;
      }else if (name== null || name.length <=2) {
        this.results=true
        this.returnedArray = [];
      this.returnedArray = this.touristAllProvidersData;
      } else{
        this.results=false
      }  
    });
    this.touristProvidersData = this.returnedArray;
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
