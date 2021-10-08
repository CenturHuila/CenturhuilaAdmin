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
export class CreateTouristAttractionsComponent  implements OnInit{

  formData!: FormGroup;
  imageIn: string;
  fileImage: string;
  @Input() modalType: string;
  @Output() 
  closeModal = new EventEmitter();
  fileToUpload: File | null = null;
  constructor(
    private readonly formBuilder: FormBuilder,
    private touristAttractionsService: TouristAttractionsService,
    private loadFilesService: LoadFilesService) { }

  ngOnInit(){
    console.log('entro');
    this.loadForm();
  }

  loadForm(){
    this.formData = this.formBuilder.group({
      name: ['', [Validators.required]],
      typePlace: ['', [Validators.required]],
      description: ['', [Validators.required]],
      zone: ['', [Validators.required]],
      township: ['', [Validators.required]],
      address: ['', [Validators.required]],
      indications: ['', [Validators.required]],
      weather: ['', [Validators.required]],
      aditionalInformation: ['', [Validators.required]],
      recomendations: ['', [Validators.required]]
      
    });
  }
  createTouristAttractions(){
    let data;
    const name = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
    this.loadFilesService
      .uploadFileStorage(
        `touristAttractions/${name}/img/p-${name}.png`,
        this.fileImage
      )
      .then((response) => {
        this.loadFilesService
          .referenciaCloudStorage(
            `touristAttractions/${name}/img/p-${name}.png`
          )
          .getDownloadURL()
          .subscribe((url) => {
            data = this.updateModel(url, name, this.formData);
            this.touristAttractionsService
              .create(data,`TA_${data.url_slug.toLowerCase().replace(/ /g, "_")}` )
              .then((response) => {
                this.closeModal.emit("");
              });
          });
      }).catch((err) => {

      });;

    // this.touristAttractionsService.create(data,`TA_${data.url_slug.toLowerCase().replace(/ /g, "_")}` ).then(response => {
    //   this.closeModal.emit('');
    // });
  }
  updateModel(url, name, form){
    const data:TouristAttractionsModel =  new TouristAttractionsModel();
    data.setName(form.controls.name.value);
    data.setTypePlace(form.controls.typePlace.value);
    data.setDescription(form.controls.description.value);
    data.setZone(form.controls.zone.value);
    data.setTownship(form.controls.township.value);
    data.setAddress(form.controls.address.value);
    data.setIndications(form.controls.indications.value);
    data.setWeather(form.controls.weather.value);
    data.setAditionalInformation(form.controls.aditionalInformation.value);
    data.setRecomendations(form.controls.recomendations.value);
    data.setUrl_slug(name);
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

  createMassive(){
    let workbook: Workbook = new ExcelJS.Workbook();
    const arryBuffer = new Response(this.fileToUpload).arrayBuffer();
    arryBuffer.then((data) => {
      workbook.xlsx.load(data)
        .then(() => {
          const worksheet = workbook.getWorksheet(1);
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
              console.log(row.values)
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
                recomendations: row.values[10]
              });
              const name = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
              let data = this.updateModel('', name, this.formData);
              this.touristAttractionsService.create(data, `T_${name}`)
              .then((response) => {
                // this.formData.reset();
                // this.closeModal.emit("");
              });
            }
          });
          this.closeModal.emit("");
        });
    });
  }

}
