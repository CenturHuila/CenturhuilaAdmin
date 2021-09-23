import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadFilesService } from '../../../services/load-files/load-files.service';
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
  fileImage: string;
  
  @Output() 
  closeModal = new EventEmitter();

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
            data = this.updateModel(url, name);
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
  updateModel(url, name){
    const data:TouristAttractionsModel =  new TouristAttractionsModel();
    data.setName(this.formData.controls.name.value);
    data.setDescription(this.formData.controls.description.value);
    data.setLatitude(this.formData.controls.latitude.value);
    data.setLongitude(this.formData.controls.longitude.value);
    data.setIndications(this.formData.controls.indications.value);
    data.setTownship(this.formData.controls.township.value);
    data.setZone(this.formData.controls.zone.value);
    data.setWeather(this.formData.controls.weather.value);
    data.setRecomendations(this.formData.controls.recomendations.value);
    data.setTypePlace(this.formData.controls.typePlace.value);
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
