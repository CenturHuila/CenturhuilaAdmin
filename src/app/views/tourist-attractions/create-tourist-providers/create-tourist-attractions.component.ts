import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadFilesService } from '../../../services/load-files/load-files.service';
import { TouristAttractionsService } from '../../../services/tourist-attractions/tourist-attractions.service';
import { TouristAttractionsModel } from '../model/tourist-attractions';
import * as ExcelJS from "exceljs/dist/exceljs";
import { Workbook } from 'exceljs';
@Component({
  selector: 'app-create-tourist-attractions',
  templateUrl: 'create-tourist-attractions.component.html',
  styleUrls: ['./create-tourist-attractions.component.css'],
  providers: [FormBuilder]
})
export class CreateTouristAttractionsComponent implements OnInit {

  formData!: FormGroup;
  imageIn: string;
  fileImage: string;
  @Input() modalType: string;
  @Input() documentToEdit: any;
  @Output()
  closeModal = new EventEmitter();
  fileToUpload: File | null = null;
  imageLoaded = false;
  first = true;
  textbutton = 'Crear';
  url = 'Crear';
  galery: any[] = [];
  galeryUrl: string[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private touristAttractionsService: TouristAttractionsService,
    private cdRef: ChangeDetectorRef,
    private loadFilesService: LoadFilesService) { }

  ngOnInit() {
    this.loadForm(this.documentToEdit ? this.documentToEdit : '');
    if (this.documentToEdit) {
      this.textbutton = "Guardar";
    } else if (this.modalType !== 'createOrEdit') {
      this.textbutton = "Importar";
    }
  }

  loadForm(data?) {
    this.formData = this.formBuilder.group({
      name: [{ value: data ? data.name : '', disabled: data ? true : false }, [Validators.required]],
      typePlace: [data ? data.typePlace : '', [Validators.required]],
      description: [data ? data.description : '', [Validators.required]],
      zone: [data ? data.zone : '', [Validators.required]],
      township: [data ? data.township : '', [Validators.required]],
      address: [data ? data.address : '', [Validators.required]],
      indications: [data ? data.indications : '', [Validators.required]],
      weather: [data ? data.weather : '', [Validators.required]],
      aditionalInformation: [data ? data.aditionalInformation : '', [Validators.required]],
      recomendations: [data ? data.recomendations : '', [Validators.required]]
    });
    this.imageIn = data.image_profile;
    this.galeryUrl= data.image_galery;
  }
  save() {
    if (this.modalType === 'createOrEdit') {
      this.createOrEditeTouristAttractions();
    } else {
      this.createMassive();
    }
  }
  createOrEditeTouristAttractions(imageLoaded?, dataMassive?) {
    let data;
    let countImage = [];
    const slug = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
    if (!imageLoaded) {
      if (!this.fileImage && this.documentToEdit && this.documentToEdit.image_profile) {
        this.url = this.documentToEdit.image_profile
        if (this.galery.length > 0){
          this.galery.forEach(image =>{
            this.loadImage(`touristAttractions/${slug}/galery/${image.name}`, image).then(urlImage => urlImage.subscribe(url => {
              countImage.push(url);
              this.galeryUrl.push(url);
              if ( this.galery.length === countImage.length){
                this.createOrEditeTouristAttractions(true);
              }
            }));
          })
        } else {
          this.createOrEditeTouristAttractions(true);
        }
      } else {
        this.loadImage(`touristAttractions/${slug}/img/p-${slug}.png`, this.fileImage).then(urlImage => urlImage.subscribe(url => {
          this.url = url
          if (this.galery.length > 0) {
            
            this.galery.forEach(image =>{
              this.loadImage(`touristAttractions/${slug}/galery/${image.name}`, image).then(urlImage => urlImage.subscribe(url => {
                countImage.push(url);
                this.galeryUrl.push(url);
                if ( this.galery.length === countImage.length){
                  this.createOrEditeTouristAttractions(true);
                }
              }));
            })
          } else {
            this.createOrEditeTouristAttractions(true);
          }
        }))
      };
    } else {
      data = dataMassive ? dataMassive : this.updateModel(slug, this.formData);
      this.touristAttractionsService
        .createOrEdite(data, `TA_${slug}`)
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
    const data: TouristAttractionsModel = new TouristAttractionsModel();
    data.setName(this.documentToEdit ? this.documentToEdit.name : form.controls.name.value);
    data.setTypePlace(form.controls.typePlace.value);
    data.setDescription(form.controls.description.value);
    data.setZone(form.controls.zone.value);
    data.setTownship(form.controls.township.value);
    data.setAddress(form.controls.address.value);
    data.setIndications(form.controls.indications.value);
    data.setWeather(form.controls.weather.value);
    data.setAditionalInformation(form.controls.aditionalInformation.value);
    data.setRecomendations(form.controls.recomendations.value);
    data.setUrl_slug(slug);
    data.setImage_profile(this.url);
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

  createMassive() {
    let workbook: Workbook = new ExcelJS.Workbook();
    const arryBuffer = new Response(this.fileToUpload).arrayBuffer();
    arryBuffer.then((data) => {
      workbook.xlsx.load(data)
        .then(() => {
          const worksheet = workbook.getWorksheet('ATRACTIVO');
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
              this.formData.setValue({
                name: row.values[2],
                typePlace: row.values[3],
                description: row.values[4],
                zone: row.values[5],
                township: row.values[6],
                address: row.values[7],
                indications: row.values[8],
                weather: row.values[9],
                aditionalInformation: row.values[10],
                recomendations: row.values[11]
              });
              const slug = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
              let data = this.updateModel(slug, this.formData);
              this.createOrEditeTouristAttractions(true, data);
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
