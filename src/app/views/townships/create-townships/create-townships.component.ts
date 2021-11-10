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
  url = 'Crear';
  galery: any[] = [];
  galeryUrl: string[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private townshipsService: TownshipsService,
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
    let service = ''
    if (data && typeof data.travelServices != 'string') {
      data.travelServices.forEach(element => {
        return service = !service ? `${element.trim()}` : `${service},${element.trim()}`
      });
    } else {
      service = data.travelServices
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
    this.galeryUrl = data.image_galery;
  }
  save() {
    if (this.modalType === 'createOrEdit') {
      this.createOrEditeTownships();
    } else {
      this.createTownshipsMassive();
    }
  }
  createOrEditeTownships(imageLoaded?, dataMassive?) {
    let data;
    let countImage = [];
    const slug = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")

    if (!imageLoaded) {
      if (!this.fileImage && this.documentToEdit && this.documentToEdit.image_profile) {
        this.url = this.documentToEdit.image_profile
        if (this.galery.length > 0) {
          this.galery.forEach(image => {
            this.loadImage(`townships/${slug}/galery/${image.name}`, image).then(urlImage => urlImage.subscribe(url => {
              countImage.push(url);
              this.galeryUrl.push(url);
              if ( this.galery.length === countImage.length){
                this.createOrEditeTownships(true);
              }
            }));
          })
        } else {
          this.createOrEditeTownships(true);
        }
      } else  if (this.fileImage){
        this.loadImage(`townships/${slug}/img/p-${slug}.png`, this.fileImage).then(urlImage => urlImage.subscribe(url => {
          this.url = url
          if (this.galery.length > 0) {
            this.galery.forEach(image => {
              this.loadImage(`townships/${slug}/galery/${image.name}`, image).then(urlImage => urlImage.subscribe(url => {
                countImage.push(url);
                this.galeryUrl.push(url);
                if ( this.galery.length === countImage.length){
                  this.createOrEditeTownships(true);
                }
              }));
            })
          } else {
            this.createOrEditeTownships(true);
          }
        }))
      };
    } else {
      data = dataMassive ? dataMassive : this.updateModel(slug, this.formData);
      this.townshipsService.createOrEdite(data, `T_${slug}`)
        .then((response) => {
          this.formData.reset();
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
                travelServices: row.values[8],
                holidays: row.values[9].split('*'),
                website: row.values[10].text ? row.values[10].text : row.values[10],
                latitude: row.values[11],
                longitude: row.values[12]
              });
              const slug = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
              let data = this.updateModel(slug, this.formData);
              this.createOrEditeTownships(true, data);
            }
          });
          this.closeModal.emit("");
        });
    });
  }

  // funcion para recibir datos desde dropdrag
  receivedFile(event) {
    this.galeryUrl = []
    this.galery = []
    for (let img of event) {
      if (img.name) {
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
