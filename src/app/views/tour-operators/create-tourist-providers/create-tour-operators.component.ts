import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TourOperatorsService } from '../../../services/tour-operators/tour-operators.service';
import { TourOperatorsModel } from '../model/tour-operators';

@Component({
  selector: 'app-create-tour-operators',
  templateUrl: 'create-tour-operators.component.html',
  styleUrls: ['./create-tour-operators.component.css'],
  providers: [FormBuilder]
})
export class CreateTourOperatorsComponent  implements OnInit{

  formData!: FormGroup;
  imageIn: string;

  @Output() 
  closeModal = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    private tourOperatorsService: TourOperatorsService) { }

  ngOnInit(){
    this.loadForm();
  }

  loadForm(){
    this.formData = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      tours: ['', [Validators.required]],
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
    });
  }
  createTourOperators(){
    const data = this.updateModel();
    this.tourOperatorsService.create(data,`TO_${data.url_slug.toLowerCase().replace(/ /g, "_")}` ).then(response => {
      this.closeModal.emit('');
    });
  }
  updateModel(){
    const data:TourOperatorsModel =  new TourOperatorsModel();
    const name = this.formData.controls.name.value;
    data.setName(name);
    data.setDescription(this.formData.controls.description.value);
    data.setTours([this.formData.controls.tours.value]);
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
    data.setUrl_slug(name.toLowerCase().replace(/ /g, "-"));
    data.setImage_profile(this.imageIn);

    return JSON.parse(JSON.stringify(data));
  }
  imgSelect(event) {
    this.imageIn = event;
  }
}
