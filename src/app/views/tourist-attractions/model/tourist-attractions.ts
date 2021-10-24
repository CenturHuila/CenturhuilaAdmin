
export class TouristAttractionsModel {
    name: string;
    description: string;
    indications: string;
    township: string;
    zone: string;
    weather: string;
    recomendations: string;
    typePlace: string;
    url_slug: string;
    image_profile: string;
    address: string;
    aditionalInformation: string;
    image_galery: string[];

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
    setWeather(value: string){
        this.weather = value;
    }
    getWeather():string{
        return this.weather;
    }
    setRecomendations(value: string){
        this.recomendations = value;
    }
    getRecomendations():string{
        return this.recomendations;
    }
    setTypePlace(value: string){
        this.typePlace = value;
    }
    getTypePlace():string{
        return this.typePlace;
    }
    setUrl_slug(value: string){
        this.url_slug = value;
    }
    getUrl_slug():string{
        return this.url_slug;
    }
    setImage_profile(value: string){
        this.image_profile = value;
    }
    getImage_profile():string{
        return this.image_profile;
    }

    setAddress(value: string){
        this.address = value;
    }
    getAddress():string{
        return this.address;
    }
    setAditionalInformation(value: string){
        this.aditionalInformation = value;
    }
    getAditionalInformation():string{
        return this.aditionalInformation;
    }
    setImage_galery(value: string[]){
        this.image_galery = value;
    }
    getImage_galery():string[]{
        return this.image_galery;
    }

}
