import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  @Output() 
  closeModal = new EventEmitter();

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
      minPrice: ['', [Validators.required]],
      maxPrice: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      indications: ['', [Validators.required]],
      township: ['', [Validators.required]],
      zone: ['', [Validators.required]],
      facebook: ['', [Validators.required]],
      instagram: ['', [Validators.required]],
      website: ['', [Validators.required]],
      cellphone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      weather: ['', [Validators.required]]
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
            data = this.updateModel(url, name);
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
  updateModel(url, name) {
    const data:TouristProvidersModel =  new TouristProvidersModel();
    data.setName(this.formData.controls.name.value);
    data.setDescription(this.formData.controls.description.value);
    data.setServices([this.formData.controls.services.value]);
    data.setMinPrice(this.formData.controls.minPrice.value);
    data.setMaxPrice(this.formData.controls.maxPrice.value);
    data.setLatitude(this.formData.controls.latitude.value);
    data.setLongitude(this.formData.controls.longitude.value);
    data.setIndications(this.formData.controls.indications.value);
    data.setTownship(this.formData.controls.township.value);
    data.setZone(this.formData.controls.zone.value);
    data.setFacebook(this.formData.controls.facebook.value);
    data.setInstagram(this.formData.controls.instagram.value);
    data.setWebsite(this.formData.controls.website.value);
    data.setCellphone(this.formData.controls.cellphone.value);
    data.setAddress(this.formData.controls.address.value);
    data.setWeather(this.formData.controls.weather.value);
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

}
