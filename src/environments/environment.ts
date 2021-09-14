// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCNtspEd7b-OB0G4rgueYrNjlDsLoBRHLs",
    authDomain: "centurhuila-b9e47.firebaseapp.com",
    databaseURL: "https://centurhuila-b9e47.firebaseio.com",
    projectId: "centurhuila-b9e47",
    storageBucket: "centurhuila-b9e47.appspot.com",
    messagingSenderId: "51926987535",
    appId: "1:51926987535:web:15d603eaee884a7801c47a"
  },
  collection:{
    touristProviders: 'Tourist_services_providers',
    touristAttractions: 'Tourist_attractions',
    tourOperators: 'Tour_operators',
    townships: 'Townships',
  },
  document: {
    tsp: 'TSP_',
  }

};
