import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TipoDeLugarService } from '../../services/tipo-de-lugar/type-place.service';
import { TouristAttractionsService } from '../../services/tourist-attractions/tourist-attractions.service';
import { TownshipsService } from '../../services/townships/townships.service';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-tourist-attractions',
  templateUrl: 'tourist-attractions.component.html',
  styleUrls: ['./tourist-attractions.component.css']
})
export class TouristAttractionsComponent implements OnInit {

  modalRef?: BsModalRef;
  touristProvidersData = [];
  returnedArray?: string[];
  touristAllProvidersData = [];
  returnedArrayTypePlace: any[];
  townshipsData = [];
  typePlaceData: any[];
  returnedArrayTownship?: string[];
  documentToEdit = {};
  documentToDelete: string;
  results: boolean = true;
  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png",
    maxSize: "1",
    uploadAPI:  {
      url:"https://example-file-upload-api",
    //   method:"POST",
    //   headers: {
    //  "Content-Type" : "text/plain;charset=UTF-8",
    //  "Authorization" : `Bearer ${token}`
    //   },
    //   params: {
    //     'page': '1'
    //   },
    //   responseType: 'blob',
    //   withCredentials: false,
    },
    theme: "dragNDrop",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: true,
    fileNameIndex: true,
    autoUpload: false,
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
};

  

  constructor(private modalService: BsModalService,
    private touristAttractionsService: TouristAttractionsService,
    private userService: UsersService,
    private router: Router,
    private townshipsServices: TownshipsService,
    private typePlaceService: TipoDeLugarService) { }

  ngOnInit() {
    this.loadData();
    // this.userService.getCurrentUser().then((res =>{
    //   if (res) {
    //     console.log(res)
    //   }else{
    //     this.router.navigate(['/login'])
    //   }s
    // }));
  }
  loadData() {
    this.results=true
    this.touristAttractionsService.get().subscribe(response => {
      this.touristProvidersData = [];
      this.touristAllProvidersData = [];
      response.forEach(element => {
        this.touristProvidersData.push(element.payload.doc.data());
      });
      this.touristAllProvidersData = this.touristProvidersData;
      this.returnedArray = this.touristProvidersData.slice(0, 20);
    })

    this.townshipsServices.get().subscribe(response => {
      this.townshipsData = [];
      response.forEach(element => {
        this.townshipsData.push(element.payload.doc.data());
      });
      this.returnedArrayTownship = this.townshipsData.slice(0, 100);
    })

    this.typePlaceService.get().subscribe(response => {
      this.typePlaceData = [];
      response.forEach(element => {
        this.typePlaceData.push(element.payload.doc.data());
      });
      this.returnedArrayTypePlace = this.typePlaceData.slice(0, 100);
     
      
    })
  }

  loadDataFilterByCity(City: string) {
    //filtrado ciudad
    this.returnedArray = [];
    this.returnedArray = this.touristAllProvidersData.filter((item: any) => {
      if(item.township === City){
        this.results=true
        return item;
      }else{
        this.results=false
      }
    });
    this.touristProvidersData = this.returnedArray;
  }

  loadDaraFilterByName(name: string){
    console.log(name);
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
    this.touristAttractionsService.delete(`TA_${this.documentToDelete}`).then(() => {
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
