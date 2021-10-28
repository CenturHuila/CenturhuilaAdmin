import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { strictEqual } from 'assert';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { runInThisContext } from 'vm';
import { ServicesService } from '../../services/services/services.service';
import { TouristProvidersService } from '../../services/tourist-providers/tourist-providers.service';
import { TownshipsService } from '../../services/townships/townships.service';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-tourist-providers',
  templateUrl: 'tourist-providers.component.html',
  styleUrls: ['./tourist-providers.component.css']
})
export class TouristProvidersComponent implements OnInit {

  modalRef?: BsModalRef;
  touristProvidersData = [];
  touristAllProvidersData = [];
  townshipsData = [];
  returnedArray?: string[];
  returnedArrayTownship?: string[];
  documentToEdit = {};
  documentToDelete: string;
  servicesData: any[];
  returnedArrayServices: any[];
  results: boolean = true;
  valueToSearch: string = "";

  constructor(private modalService: BsModalService,
    private touristProvidersService: TouristProvidersService,
    private userService: UsersService,
    private router: Router,
    private townshipsServices: TownshipsService,
    private servicesService: ServicesService) { }

  ngOnInit() {
    this.loadData();
    this.userService.getCurrentUser().then((res => {
      if (res) {
      } else {
        this.router.navigate(['/login'])
      }
    }));
  }

  loadData() {
    this.results=true
    
    this.touristProvidersService.get().subscribe(response => {
      this.touristProvidersData = [];
      this.touristAllProvidersData = [];
      response.forEach(element => {
        this.touristProvidersData.push(element.payload.doc.data());
      });
      this.touristAllProvidersData = this.touristProvidersData;
      this.returnedArray = this.touristProvidersData.slice(0, 10);

    })
    this.townshipsServices.get().subscribe(response => {
      this.townshipsData = [];
      response.forEach(element => {
        this.townshipsData.push(element.payload.doc.data());
      });
      this.returnedArrayTownship = this.townshipsData.slice(0, 100);
    })
    this.servicesService.get().subscribe(response => {
      this.servicesData = [];
      response.forEach(element => {
        this.servicesData.push(element.payload.doc.data());
      });
      this.returnedArrayServices = this.servicesData.slice(0, 100);
    });

  }
  loadDataFilterByCity(city: string) {
    //filtrado ciudad
    this.results=true
    this.returnedArray = [];
    this.returnedArray = this.touristAllProvidersData.filter((item: any) => {
      if(item.township === city){
        this.results=true
        return item;
      }
    });
    this.touristProvidersData = this.returnedArray;
  }

  loadDataFilterByServices(service: string) {
    //filtrado Services
    this.returnedArray = [];
    this.returnedArray = this.touristAllProvidersData.filter((item: any) => {
      if(item.services.includes(service)){
        this.results=true
        return item;
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
  closeModal() {
    this.modalRef.hide();
    this.loadData();
  }
  delete() {
    this.touristProvidersService.delete(`T_${this.documentToDelete}`).then(() => {
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
