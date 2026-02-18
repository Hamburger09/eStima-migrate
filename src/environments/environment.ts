// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverUrl: 'http://localhost:5000/',
  apiUrl: 'http://localhost:5000/api', // Updated to match serverUrl
  estimaUrl: 'http://localhost:5000/api/estima', // Updated to match serverUrl
  materialsUrl: 'http://localhost:5000/api/materials', // Updated to match serverUrl
  delphiUrl: 'http://localhost:5000/api/estima/nbase4', // Updated to match serverUrl
  ipApiUrl: 'https://api.ipify.org?format=json', // IP API URL for development
  // apiUrl: 'https://api.example.com', // Production URL
  // firebaseConfig: {
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
