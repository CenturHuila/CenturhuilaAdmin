import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadFilesService } from '../../../services/load-files/load-files.service';
import { TownshipsService } from '../../../services/townships/townships.service';
import { TownshipsModel } from '../model/townships';
import * as ExcelJS from "exceljs/dist/exceljs";
import { Workbook } from 'exceljs';

@Component({
  selector: 'app-create-townships',
  templateUrl: 'create-townships.component.html',
  styleUrls: ['./create-townships.component.css'],
  providers: [FormBuilder]
})
export class CreateTownshipsComponent implements OnInit {

  formData!: FormGroup;
  imageIn: string;
  fileImage: string;
  @Input() modalType: string;
  @Output()
  closeModal = new EventEmitter();
  fileToUpload: File | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private townshipsService: TownshipsService,
    private loadFilesService: LoadFilesService) { }

  ngOnInit() {
    this.loadForm();
  }

  loadForm() {
    this.formData = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      travelServices: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      indications: ['', [Validators.required]],
      zone: ['', [Validators.required]],
      website: ['', [Validators.required]],
      population: ['', [Validators.required]],
      holidays: ['', [Validators.required]],
      weather: ['', [Validators.required]]
    });
  }
  createTownships(form) {
    let data;
    const name = form.controls.name.value.toLowerCase().replace(/ /g, "-")
    this.loadFilesService
      .uploadFileStorage(
        `townships/${name}/img/p-${name}.png`,
        this.fileImage
      )
      .then((response) => {
        this.loadFilesService
          .referenciaCloudStorage(
            `townships/${name}/img/p-${name}.png`
          )
          .getDownloadURL()
          .subscribe((url) => {
            data = this.updateModel(url, name, form);
            this.townshipsService.create(data, `T_${data.url_slug.toLowerCase().replace(/ /g, "_")}`)
              .then((response) => {
                this.formData.reset();
                this.closeModal.emit("");
              });
          });
      }).catch((err) => {

      });
  }

  updateModel(url, name, form) {
    const data: TownshipsModel = new TownshipsModel();
    data.setName(form.controls.name.value);
    data.setDescription(form.controls.description.value);
    data.setTravelServices(form.controls.travelServices.value);
    data.setLatitude(form.controls.latitude.value);
    data.setLongitude(form.controls.longitude.value);
    data.setIndications(form.controls.indications.value);
    data.setZone(form.controls.zone.value);
    data.setWebsite(form.controls.website.value);
    data.setPopulation(form.controls.population.value);
    data.setHolidays(form.controls.holidays.value);
    data.setWeather(form.controls.weather.value);
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

  createTownshipsMassive(){
    let workbook: Workbook = new ExcelJS.Workbook();
    const arryBuffer = new Response(this.fileToUpload).arrayBuffer();
    arryBuffer.then((data) => {
      workbook.xlsx.load(data)
        .then(() => {
          const worksheet = workbook.getWorksheet(1);
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1 && rowNumber !== 2) {
              console.log(row.values)
              this.formData.setValue({
                name: row.values[2],
                zone: row.values[3],
                description: row.values[4],
                population: row.values[5],
                weather: row.values[7],
                travelServices: row.values[8].split(','),
                holidays: row.values[9].split('*'),
                website: row.values[10].text ? row.values[10].text : row.values[10],
                latitude: row.values[11],
                longitude: row.values[12],
                indications: row.values[6]
              });
              const name = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
              let data = this.updateModel('', name, this.formData);
              this.townshipsService.create(data, `T_${name}`)
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
