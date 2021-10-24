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
  @Input() documentToEdit: any;
  @Output()
  closeModal = new EventEmitter();
  fileToUpload: File | null = null;
  textbutton = 'Crear';

  constructor(
    private readonly formBuilder: FormBuilder,
    private townshipsService: TownshipsService,
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
    let service = ''
    if (typeof data.services != 'string'){
      data.services.forEach(element => {
        return service = !service ? `${element}` : `${service}, ${element}` 
      });
    }  else {
      service = data.services
    }
    this.formData = this.formBuilder.group({
      name: [{ value: data ? data.name : '', disabled: data ? true : false }, [Validators.required]],
      description: [data ? data.description : '', [Validators.required]],
      travelServices: [data ? service : '', [Validators.required]],
      latitude: [data ? data.latitude : '', [Validators.required]],
      longitude: [data ? data.longitude : '', [Validators.required]],
      zone: [data ? data.zone : '', [Validators.required]],
      website: [data ? data.website : '', [Validators.required]],
      population: [data ? data.population : '', [Validators.required]],
      holidays: [data ? data.holidays : '', [Validators.required]],
      weather: [data ? data.weather : '', [Validators.required]],
      demonym: [data ? data.demonym : '', [Validators.required]]
    });
    this.imageIn = data.image_profile;
  }
  save() {
    if (this.modalType === 'createOrEdit') {
      this.createOrEditeTownships();
    } else {
      this.createTownshipsMassive();
    }
  }
  createOrEditeTownships(url?, imageLoaded?, dataMassive?) {
    let data;
    const slug = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
    if (this.fileImage && !imageLoaded) {
      this.loadFilesService
        .uploadFileStorage(
          `townships/${slug}/img/p-${slug}.png`,
          this.fileImage
        )
        .then((response) => {
          this.loadFilesService
            .referenciaCloudStorage(
              `townships/${slug}/img/p-${slug}.png`
            )
            .getDownloadURL()
            .subscribe((url) => {
              this.createOrEditeTownships(url, true);
            });
        }).catch((err) => {

        });
    } else {
      url = !this.fileImage && this.documentToEdit && this.documentToEdit.image_profile ? this.documentToEdit.image_profile : url
      data = dataMassive ? dataMassive : this.updateModel(url, slug, this.formData);
      this.townshipsService.createOrEdite(data, `T_${data.url_slug.toLowerCase().replace(/ /g, "_")}`)
        .then((response) => {
          this.formData.reset();
          this.closeModal.emit("");
        });
    }
  }

  updateModel(url, name, form) {
    const data: TownshipsModel = new TownshipsModel();
    data.setName(form.controls.name.value);
    data.setDescription(form.controls.description.value);
    data.setTravelServices(form.controls.travelServices.value.split(','));
    data.setLatitude(form.controls.latitude.value);
    data.setLongitude(form.controls.longitude.value);
    data.setDemonym(form.controls.demonym.value);
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

  createTownshipsMassive() {
    let workbook: Workbook = new ExcelJS.Workbook();
    const arryBuffer = new Response(this.fileToUpload).arrayBuffer();
    arryBuffer.then((data) => {
      workbook.xlsx.load(data)
        .then(() => {
          const worksheet = workbook.getWorksheet(1);
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1 && rowNumber !== 2) {
              this.formData.setValue({
                name: row.values[2],
                zone: row.values[3],
                description: row.values[4],
                population: row.values[5],
                demonym: row.values[6],
                weather: row.values[7],
                travelServices: row.values[8].split(','),
                holidays: row.values[9].split('*'),
                website: row.values[10].text ? row.values[10].text : row.values[10],
                latitude: row.values[11],
                longitude: row.values[12]
              });
              const name = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
              let data = this.updateModel('', name, this.formData);
              this.createOrEditeTownships('', true, data);
            }
          });
          this.closeModal.emit("");
        });
    });
  }
}
