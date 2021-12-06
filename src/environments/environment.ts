// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:9000/helpdesk-api/',
  contentPath:'http://localhost:9000/helpdesk-api/download/',
  // apiUrl: 'http://smallcart.in:9021/helpdesk-api/',
  // contentPath: 'http://smallcart.in:9021/helpdesk-api/download/',
  title: 'AutoLib | HelpDesk - Dev',
  logourl: 'https://lh3.googleusercontent.com/U9wexkgs65Pmrv6YRppPZOGcioZpxU4KPgqO2wbq8vwPLxBPy2OzSEqNuMs6OR7XNZ0'
  // logourl: 'data:image/png;base64,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'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
