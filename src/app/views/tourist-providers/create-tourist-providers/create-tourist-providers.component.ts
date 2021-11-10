import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ExcelJS from "exceljs/dist/exceljs";
import { Workbook } from 'exceljs';
import { LoadFilesService } from '../../../services/load-files/load-files.service';
import { TouristProvidersService } from '../../../services/tourist-providers/tourist-providers.service';
import { TouristProvidersModel } from '../model/tourist-providers';

@Component({
  selector: 'app-create-tourist-providers',
  templateUrl: 'create-tourist-providers.component.html',
  styleUrls: ['./create-tourist-providers.component.css'],
  providers: [FormBuilder]
})
export class CreateTouristProvidersComponent  implements OnInit{

  formData!: FormGroup;
  imageIn: string;
  fileImage: string;
  @Input() modalType: string;
  @Input() documentToEdit: any;
  @Output() 
  closeModal = new EventEmitter();
  fileToUpload: File | null = null;
  textbutton = 'Crear';
  url = 'Crear';
  galery: any[] = [];
  galeryUrl: string[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private touristProvidersService: TouristProvidersService,
    private loadFilesService: LoadFilesService) { }

  ngOnInit(){
    this.loadForm(this.documentToEdit ? this.documentToEdit : '');
    
    if(this.documentToEdit){
      this.textbutton = "Guardar";
    } else if(this.modalType !== 'createOrEdit'){
      this.textbutton = "Importar";
    }
  }

  loadForm(data?){
    let service = ''
    if (data && typeof data.services != 'string'){
      data.services.forEach(element => {
        return service = !service ? `${element.trim()}` : `${service},${element.trim()}` 
      });
    }  else {
      service = data.services
    }
    this.formData = this.formBuilder.group({
      name: [{value: data ? data.name : '', disabled: data ? true : false}, [Validators.required]],
      description: [ data ? data.description :'', [Validators.required]],
      services: [ data ? service :'', [Validators.required]],
      rnt: [ data ? data.rnt :'', [Validators.required]],
      zone: [ data ? data.zone :'', [Validators.required]],
      township: [ data ? data.township :'', [Validators.required]],
      address: [ data ? data.address :'', [Validators.required]],
      indications: [ data ? data.indications :'', [Validators.required]],
      cellphone: [ data ? data.cellphone :'', [Validators.required]],
      facebook: [ data ? data.facebook :'', [Validators.required]],
      instagram: [ data ? data.instagram :'', [Validators.required]],
      website: [ data ? data.website :'', [Validators.required]],
      email: [ data ? data.email :'', [Validators.required, Validators.email]],
      aditionalInformation: [ data ? data.aditionalInformation :'', [Validators.required]],
    });
    this.imageIn = data.image_profile;
    this.galeryUrl= data.image_galery;
    setTimeout(()=>{
    this.save();
    },200)
  }
  save(){
    if (this.modalType === 'createOrEdit'){
      this.createOrEditeTouristProvider();
    } else{
      this.createMassive();
    }
  }
  createOrEditeTouristProvider(imageLoaded?, dataMassive?){
    let data;
    let countImage = [];
    const slug = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
    if (!imageLoaded) {
      if (!this.fileImage && this.documentToEdit && this.documentToEdit.image_profile) {
        this.url = this.documentToEdit.image_profile
        if (this.galery.length > 0){
          this.galery.forEach(image =>{
            this.loadImage(`touristProviders/${slug}/galery/${image.name}`, image).then(urlImage => urlImage.subscribe(url => {
              countImage.push(url);
              this.galeryUrl.push(url);
              if ( this.galery.length === countImage.length){
                this.createOrEditeTouristProvider(true);
              }
            }));
          })
        } else {
          this.createOrEditeTouristProvider(true);
        }
      } else {
        this.loadImage(`touristProviders/${slug}/img/p-${slug}.png`, this.fileImage).then(urlImage => urlImage.subscribe(url => {
          this.url = url
          if (this.galery.length > 0) {
            
            this.galery.forEach(image =>{
              this.loadImage(`touristProviders/${slug}/galery/${image.name}`, image).then(urlImage => urlImage.subscribe(url => {
                countImage.push(url);
                this.galeryUrl.push(url);
                if ( this.galery.length === countImage.length){
                    this.createOrEditeTouristProvider(true);
                }
              }));
            })
          } else {
            this.createOrEditeTouristProvider(true);
          }
        }))
      };
      } else {
        data = dataMassive ? dataMassive : this.updateModel(slug, this.formData);
        this.touristProvidersService.createOrEdite(data,`T_${slug}` )
          .then((response) => {
            this.closeModal.emit("");
          });
      }
  }
  
  loadImage(url: string, image): Promise<any> {
    return this.loadFilesService
      .uploadFileStorage(
        `${url}`, image
      )
      .then((response) => {
        return this.loadFilesService
          .referenciaCloudStorage(
            `${url}`
          )
          .getDownloadURL()
      })
  }
  updateModel(slug, form) {
    const data:TouristProvidersModel =  new TouristProvidersModel();
    data.setName(form.controls.name.value);
    data.setDescription(form.controls.description.value);
    data.setServices(form.controls.services.value.split(','));
    data.setRnt(form.controls.rnt.value);
    data.setIndications(form.controls.indications.value);
    data.setTownship(form.controls.township.value);
    data.setZone(form.controls.zone.value);
    data.setFacebook(form.controls.facebook.value);
    data.setInstagram(form.controls.instagram.value);
    data.setWebsite(form.controls.website.value);
    data.setCellphone(form.controls.cellphone.value);
    data.setAddress(form.controls.address.value);
    data.setUrl_slug(slug);
    data.setImage_profile(this.url);
    data.setEmail(form.controls.email.value);
    data.setAditionalInformation(form.controls.aditionalInformation.value);
    data.setImage_galery(this.galeryUrl);
    
    return JSON.parse(JSON.stringify(data));
  }
  imgSelect(event) {
    this.imageIn = event;
  }
  imageFile(event) {
    this.fileImage = event;
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  createMassive(){
    let workbook: Workbook = new ExcelJS.Workbook();
    const arryBuffer = new Response(this.fileToUpload).arrayBuffer();
    arryBuffer.then((data) => {
      workbook.xlsx.load(data)
        .then(() => {
          const worksheet = workbook.getWorksheet('PST');
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
              this.formData.setValue({
                name: row.values[2],
                description: row.values[3],
                services: row.values[4],
                rnt: row.values[5],
                zone: row.values[6],
                township: row.values[7],
                address: row.values[8],
                indications: row.values[9],
                cellphone: String(row.values[10]),
                facebook: row.values[11]?.text ? row.values[11].text : row.values[11],
                instagram: row.values[12]?.text ? row.values[12].text : row.values[12],
                website: row.values[13]?.text ? row.values[13].text : row.values[13],
                email: row.values[14]?.text ? row.values[14].text : row.values[14],
                aditionalInformation: row.values[15]
              });
              const slug = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
              let data = this.updateModel(slug, this.formData);
              this.createOrEditeTouristProvider(true, data)
            }
          });
          this.closeModal.emit("");
        });
    });
  }
  
  // funcion para recibir datos desde dropdrag
  receivedFile(event) {
    this.galeryUrl = []
    this.galery  = []
    for(let img of event){
      if(img.name){
        this.galery.push(img);
      } else {
        this.galeryUrl.push(img);
      }
    }
  }
  // funcion para eliminar un archivo seleccionado
  deleteFile(event) {
    // this.imageService.deleteFile(event.title, this.idImage).subscribe(
    //   response => {
    //     this.globals.successMessage();
    //   },
    //   error => {
    //     this.globals.error(error);
    //   }
    // );
  }

}
