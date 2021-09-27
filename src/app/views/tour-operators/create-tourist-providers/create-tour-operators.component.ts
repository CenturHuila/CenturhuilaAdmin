import { Component, OnInit, EventEmitter, Output } from "@angular/core";
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

  @Output()
  closeModal = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    private tourOperatorsService: TourOperatorsService,
    private loadFilesService: LoadFilesService
  ) { }

  ngOnInit() {
    this.loadForm();
  }

  loadForm() {
    this.formData = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      tours: ["", [Validators.required]],
      minPrice: ["", [Validators.required]],
      maxPrice: ["", [Validators.required]],
      latitude: ["", [Validators.required]],
      longitude: ["", [Validators.required]],
      indications: ["", [Validators.required]],
      township: ["", [Validators.required]],
      zone: ["", [Validators.required]],
      facebook: ["", [Validators.required]],
      instagram: ["", [Validators.required]],
      website: ["", [Validators.required]],
      cellphone: ["", [Validators.required]],
      address: ["", [Validators.required]],
    });
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
    this.fileImage = event;
  }
}
