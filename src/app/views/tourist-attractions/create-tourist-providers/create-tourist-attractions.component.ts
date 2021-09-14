import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TouristAttractionsService } from '../../../services/tourist-attractions/tourist-attractions.service';
import { TouristAttractionsModel } from '../model/tourist-attractions';

@Component({
  selector: 'app-create-tourist-attractions',
  templateUrl: 'create-tourist-attractions.component.html',
  styleUrls: ['./create-tourist-attractions.component.css'],
  providers: [FormBuilder]
})
export class CreateTouristAttractionsComponent  implements OnInit{

  formData!: FormGroup;
  @Output() 
  closeModal = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    private touristAttractionsService: TouristAttractionsService) { }

  ngOnInit(){
    console.log('entro');
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
    const data = this.updateModel();
    this.touristAttractionsService.create(data,`TSP_${data.url_slug.toLowerCase().replace(/ /g, "_")}` ).then(response => {
      this.closeModal.emit('');
    });
  }
  updateModel(){
    const data:TouristAttractionsModel =  new TouristAttractionsModel();
    const name = this.formData.controls.name.value;
    data.setName(name);
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
    data.setUrl_slug(name.toLowerCase().replace(/ /g, "_"));
    
    return JSON.parse(JSON.stringify(data));
  }

}
