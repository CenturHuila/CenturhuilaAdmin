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
  imageIn: string;
  
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
      indications: ['', [Validators.required]],
      township: ['', [Validators.required]],
      zone: ['', [Validators.required]],
      weather: ['', [Validators.required]],
      recomendations: ['', [Validators.required]],
      typePlace: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]]
      
    });
  }
  createTouristAttractions(){
    const data = this.updateModel();
    this.touristAttractionsService.create(data,`TA_${data.url_slug.toLowerCase().replace(/ /g, "_")}` ).then(response => {
      this.closeModal.emit('');
    });
  }
  updateModel(){
    const data:TouristAttractionsModel =  new TouristAttractionsModel();
    const name = this.formData.controls.name.value;
    data.setName(name);
    data.setDescription(this.formData.controls.description.value);
    data.setLatitude(this.formData.controls.latitude.value);
    data.setLongitude(this.formData.controls.longitude.value);
    data.setIndications(this.formData.controls.indications.value);
    data.setTownship(this.formData.controls.township.value);
    data.setZone(this.formData.controls.zone.value);
    data.setWeather(this.formData.controls.weather.value);
    data.setRecomendations(this.formData.controls.recomendations.value);
    data.setTypePlace(this.formData.controls.typePlace.value);
    data.setUrl_slug(name.toLowerCase().replace(/ /g, "-"));
    data.setImage_profile(this.imageIn);
    
    return JSON.parse(JSON.stringify(data));
  }

  imgSelect(event) {
    this.imageIn = event;
  }

}
