
export class TownshipsModel {
    name: string;
    description: string;
    indications: string;
    travelServices: [string];
    zone: string;
    weather: string;
    latitude: string;
    longitude: string;
    website: string;
    url_slug: string;
    
    population: string;
    holidays: string;

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
    setTravelServices(value: [string]){
        this.travelServices = value;
    }
    getTravelServices():[string]{
        return this.travelServices;
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
    setPopulation(value: string){
        this.population = value;
    }
    getPopulation():string{
        return this.population;
    }
    setZone(value: string){
        this.zone = value;
    }
    getZone():string{
        return this.zone;
    }
    setHolidays(value: string){
        this.holidays = value;
    }
    getHolidays():string{
        return this.holidays;
    }
    setWebsite(value: string){
        this.website = value;
    }
    getWebsite():string{
        return this.website;
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
