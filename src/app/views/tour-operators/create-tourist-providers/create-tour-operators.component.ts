import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { LoadFilesService } from "../../../services/load-files/load-files.service";
import { TourOperatorsService } from "../../../services/tour-operators/tour-operators.service";
import { TourOperatorsModel } from "../model/tour-operators";

@Component({
  selector: "app-create-tour-operators",
  templateUrl: "create-tour-operators.component.html",
  styleUrls: ["./create-tour-operators.component.css"],
  providers: [FormBuilder],
})
export class CreateTourOperatorsComponent implements OnInit {
  formData!: FormGroup;
  imageIn: string;
  fileImage: string;
  @Input() documentToEdit: any;

  @Output()
  closeModal = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    private tourOperatorsService: TourOperatorsService,
    private loadFilesService: LoadFilesService
  ) { }

  ngOnInit() {
    this.loadForm(this.documentToEdit ? this.documentToEdit : '');
  }

  loadForm(data?){
    this.formData = this.formBuilder.group({
      name: [ data ? data.name : '', [Validators.required]],
      description: [ data ? data.description : '', [Validators.required]],
      tours: [ data ? data.tours : '', [Validators.required]],
      minPrice: [ data ? data.minPrice : '', [Validators.required]],
      maxPrice: [ data ? data.maxPrice : '', [Validators.required]],
      latitude: [ data ? data.latitude : '', [Validators.required]],
      longitude: [ data ? data.longitude : '', [Validators.required]],
      indications: [ data ? data.indications : '', [Validators.required]],
      township: [ data ? data.township : '', [Validators.required]],
      zone: [ data ? data.zone : '', [Validators.required]],
      facebook: [ data ? data.facebook : '', [Validators.required]],
      instagram: [ data ? data.instagram : '', [Validators.required]],
      website: [ data ? data.website : '', [Validators.required]],
      cellphone: [ data ? data.cellphone : '', [Validators.required]],
      address: [ data ? data.address : '', [Validators.required]],
    });
    this.imageIn = data.image_profile;
  }
  createTourOperators() {
    let data;
    const name = this.formData.controls.name.value.toLowerCase().replace(/ /g, "-")
    this.loadFilesService
      .uploadFileStorage(
        `tourOperators/${name}/img/p-${name}.png`,
        this.fileImage
      )
      .then((response) => {
        this.loadFilesService
          .referenciaCloudStorage(
            `tourOperators/${name}/img/p-${name}.png`
          )
          .getDownloadURL()
          .subscribe((url) => {
            data = this.updateModel(url, name);
            this.tourOperatorsService
              .create(
                data,
                `TO_${data.url_slug.toLowerCase().replace(/ /g, "_")}`
              )
              .then((response) => {
                this.closeModal.emit("");
              });
          });
      }).catch((err) => {

      });;
  }
  updateModel(url, name) {
    const data: TourOperatorsModel = new TourOperatorsModel();
    data.setName(this.formData.controls.name.value);
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
    data.setUrl_slug(name);
    data.setImage_profile(url);

    return JSON.parse(JSON.stringify(data));
  }
  imgSelect(event) {
    this.imageIn = event;
  }
  imageFile(event) {
    console.log('entro')
    console.log(event)
    this.fileImage = event;
  }
}
