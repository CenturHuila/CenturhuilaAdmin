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
  @Output() 
  closeModal = new EventEmitter();
  fileToUpload: File | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private touristProvidersService: TouristProvidersService,
    private loadFilesService: LoadFilesService) { }

  ngOnInit(){
    this.loadForm();
  }

  loadForm(){
    this.formData = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      services: ['', [Validators.required]],
      rnt: ['', [Validators.required]],
      // minPrice: ['', [Validators.required]],
      // maxPrice: ['', [Validators.required]],
      // latitude: ['', [Validators.required]],
      // longitude: ['', [Validators.required]],
      indications: ['', [Validators.required]],
      township: ['', [Validators.required]],
      zone: ['', [Validators.required]],
      facebook: ['', [Validators.required]],
      instagram: ['', [Validators.required]],
      website: ['', [Validators.required]],
      cellphone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      // weather: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      aditionalInformation: ['', [Validators.required]],
    });
  }
  createTouristProvider(){
    let data;
    const name = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
    this.loadFilesService
      .uploadFileStorage(
        `touristProviders/${name}/img/p-${name}.png`,
        this.fileImage
      )
      .then((response) => {
        this.loadFilesService
          .referenciaCloudStorage(
            `touristProviders/${name}/img/p-${name}.png`
          )
          .getDownloadURL()
          .subscribe((url) => {
            data = this.updateModel(url, name, this.formData);
            this.touristProvidersService.create(data,`TSP_${data.url_slug.toLowerCase().replace(/ /g, "_")}` )
              .then((response) => {
                this.closeModal.emit("");
              });
          });
      }).catch((err) => {

      });;
    // const data = this.updateModel();
    // this.touristProvidersService.create(data,`TSP_${data.url_slug.toLowerCase().replace(/ /g, "_")}` ).then(response => {
    //   this.closeModal.emit('');
    // });
  }
  updateModel(url, name, form) {
    const data:TouristProvidersModel =  new TouristProvidersModel();
    data.setName(form.controls.name.value);
    data.setDescription(form.controls.description.value);
    data.setServices(form.controls.services.value);
    data.setRnt(form.controls.rnt.value);
    // data.setMinPrice(form.controls.minPrice.value);
    // data.setMaxPrice(form.controls.maxPrice.value);
    // data.setLatitude(form.controls.latitude.value);
    // data.setLongitude(form.controls.longitude.value);
    data.setIndications(form.controls.indications.value);
    data.setTownship(form.controls.township.value);
    data.setZone(form.controls.zone.value);
    data.setFacebook(form.controls.facebook.value);
    data.setInstagram(form.controls.instagram.value);
    data.setWebsite(form.controls.website.value);
    data.setCellphone(form.controls.cellphone.value);
    data.setAddress(form.controls.address.value);
    // data.setWeather(form.controls.weather.value);
    data.setUrl_slug(name);
    data.setImage_profile(url);
    data.setEmail(form.controls.email.value);
    data.setAditionalInformation(form.controls.aditionalInformation.value);
    
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
          const worksheet = workbook.getWorksheet(2);
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
              console.log(row.values)
              this.formData.setValue({
                name: row.values[2],
                description: row.values[3],
                services: row.values[4].split(','),
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
              const name = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
              let data = this.updateModel('', name, this.formData);
              this.touristProvidersService.create(data, `T_${name}`)
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
