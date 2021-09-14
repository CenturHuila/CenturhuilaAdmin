
export class TourOperatorsModel {
    name: string;
    description: string;
    services: [string];
    minPrice: number;
    maxPrice: number;
    latitude: string;
    longitude: string;
    indications: string;
    township: string;
    zone: string;
    facebook: string;
    instagram: string;
    website: string;
    cellphone: number;
    address: string;
    url_slug: string;
    weather: string;

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
    setMinPrice(value: number){
        this.minPrice = value;
    }
    getMinPrice():number{
        return this.minPrice;
    }
    setMaxPrice(value: number){
        this.maxPrice = value;
    }
    getMaxPrice():number{
        return this.maxPrice;
    }
    setLatitude(value: string){
        this.latitude = value;
    }
    getLatitude():string{
        return this.latitude;
    }
    setLongitude(value: string){
        this.longitude = value;
    }
    getLongitude():string{
        return this.longitude;
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
    setWeather(value: string){
        this.weather = value;
    }
    getWeather():string{
        return this.weather;
    }

}
