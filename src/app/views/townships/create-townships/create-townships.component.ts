import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TownshipsService } from '../../../services/townships/townships.service';
import { TownshipsModel } from '../model/townships';

@Component({
  selector: 'app-create-townships',
  templateUrl: 'create-townships.component.html',
  styleUrls: ['./create-townships.component.css'],
  providers: [FormBuilder]
})
export class CreateTownshipsComponent  implements OnInit{

  formData!: FormGroup;
  @Output() 
  closeModal = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    private townshipsService: TownshipsService) { }

  ngOnInit(){
    console.log('entro');
    this.loadForm();
  }

  loadForm(){
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
  createTownships(){
    const data = this.updateModel();
    this.townshipsService.create(data,`T_${data.url_slug.toLowerCase().replace(/ /g, "_")}` ).then(response => {
      this.closeModal.emit('');
    });
  }
  updateModel(){
    const data:TownshipsModel =  new TownshipsModel();
    const name = this.formData.controls.name.value;
    data.setName(name);
    data.setDescription(this.formData.controls.description.value);
    data.setTravelServices([this.formData.controls.travelServices.value]);
    data.setLatitude(this.formData.controls.latitude.value);
    data.setLongitude(this.formData.controls.longitude.value);
    data.setIndications(this.formData.controls.indications.value);
    data.setZone(this.formData.controls.zone.value);
    data.setWebsite(this.formData.controls.website.value);
    data.setPopulation(this.formData.controls.population.value);
    data.setHolidays(this.formData.controls.holidays.value);
    data.setWeather(this.formData.controls.weather.value);
    data.setUrl_slug(name.toLowerCase().replace(/ /g, "_"));
    
    return JSON.parse(JSON.stringify(data));
  }

}
