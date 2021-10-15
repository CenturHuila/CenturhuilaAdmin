
export class TouristProvidersModel {
    name: string;
    description: string;
    services: [string];
    rnt: string;
    indications: string;
    township: string;
    zone: string;
    facebook: string;
    instagram: string;
    website: string;
    cellphone: number;
    address: string;
    url_slug: string;
    image_profile: string;
    email: string;
    aditionalInformation: string;

    setName(value: string){
        this.name = value;
    }
    getName():string{
        return this.name;
    }
    setDescription(value: string){
        this.description = value;
    }
    getDescription():string{
        return this.description;
    }
    setServices(value: [string]){
        this.services = value;
    }
    getServices():[string]{
        return this.services;
    }

    setRnt(value: string){
        this.rnt = value;
    }
    getRnt():string{
        return this.rnt;
    }
    setIndications(value: string){
        this.indications = value;
    }
    getIndications():string{
        return this.indications;
    }
    setTownship(value: string){
        this.township = value;
    }
    getTownship():string{
        return this.township;
    }
    setZone(value: string){
        this.zone = value;
    }
    getZone():string{
        return this.zone;
    }
    setFacebook(value: string){
        this.facebook = value;
    }
    getFacebook():string{
        return this.facebook;
    }
    setInstagram(value: string){
        this.instagram = value;
    }
    getInstagram():string{
        return this.instagram;
    }
    setWebsite(value: string){
        this.website = value;
    }
    getWebsite():string{
        return this.website;
    }
    setCellphone(value: number){
        this.cellphone = value;
    }
    getCellphone():number{
        return this.cellphone;
    }
    setAddress(value: string){
        this.address = value;
    }
    getAddress():string{
        return this.address;
    }
    setUrl_slug(value: string){
        this.url_slug = value;
    }
    getUrl_slug():string{
        return this.url_slug;
    }    
    setEmail(value: string){
        this.email = value;
    }
    getEmail():string{
        return this.email;
    }
    setImage_profile(value: string){
        this.image_profile = value;
    }
    getImage_profile():string{
        return this.image_profile;
    }
    setAditionalInformation(value: string){
        this.aditionalInformation = value;
    }
    getAditionalInformation():string{
        return this.aditionalInformation;
    }

}
