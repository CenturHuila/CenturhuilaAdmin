import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
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
  textbutton = 'Crear';
  constructor(
    private readonly formBuilder: FormBuilder,
    private touristAttractionsService: TouristAttractionsService,
    private loadFilesService: LoadFilesService) { }

  ngOnInit() {
    this.loadForm(this.documentToEdit ? this.documentToEdit : '');
    if(this.documentToEdit){
      this.textbutton = "Guardar";
    } else if(this.modalType !== 'createOrEdit'){
      this.textbutton = "Importar";
    }
  }

  loadForm(data?) {
    this.formData = this.formBuilder.group({
      name: [{value: data ? data.name : '', disabled: data ? true : false}, [Validators.required]],
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
  }
  save(){
    if (this.modalType === 'createOrEdit'){
      this.createOrEditeTouristAttractions();
    } else{
      this.createMassive();
    }
  }
  createOrEditeTouristAttractions(url?, imageLoaded?, dataMassive?) {
    let data;
    const slug = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
    if (this.fileImage && !imageLoaded) {
      this.loadFilesService
        .uploadFileStorage(
          `touristAttractions/${slug}/img/p-${slug}.png`,
          this.fileImage
        )
        .then((response) => {
          this.loadFilesService
            .referenciaCloudStorage(
              `touristAttractions/${slug}/img/p-${slug}.png`
            )
            .getDownloadURL()
            .subscribe((url) => {
              this.createOrEditeTouristAttractions(url, true);
            });
        }).catch((err) => {
        });;
    } else {
      url = !this.fileImage && this.documentToEdit && this.documentToEdit.image_profile ? this.documentToEdit.image_profile : url
      data = dataMassive ? dataMassive : this.updateModel(url, slug, this.formData);
      this.touristAttractionsService
        .createOrEdite(data, `TA_${slug}`)
        .then((response) => {
          this.closeModal.emit("");
        });
    }
  }
  updateModel(url, slug, form) {
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
    data.setImage_profile(url);

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
              const name = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
              let data = this.updateModel('', name, this.formData);
              this.createOrEditeTouristAttractions('', true, data);
            }
          });
          this.closeModal.emit("");
        });
    });
  }

}
