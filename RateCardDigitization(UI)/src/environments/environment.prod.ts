// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  applicationTitle:'RateCard Digitalization',
  baseUrl: 'https://geshpsappsuite.honeywell.com/GESExcellence/SecurityManager/PlatformUIManager',
  // applicationName: 'T&L',
  applicationName: 'RateCardDigitalization',
  securityName: 'Security',
  reqProcessorUrl: '/RequestProcessor',
  fileProcessorURL: '/FileProcessor',
  sessionTimeoutURL: '/Account/SessionTimeoutValue',
  redirectURL:'https://geshpsappsuite.honeywell.com/GESExcellence/SecurityManager/PlatformUIManager/#/my-dashboard',

  /* usage Tracker URL */
  usageTrackerBaseUrl: 'https://geshpsappsuite.honeywell.com/GESExcellence/SecurityManager/UsageTrackerService',
  usageApplicationName: 'usageTracker',
  saveNewUsageUrl: '/api/productivity/SaveNewUsage',
  waDetails:'/api/WAPortal/waDetails',
  trialCount:'/api/UsageConfiguration/TrialAttemptsCount',
  userTrialCount:'/api/UsageConfiguration/TrialAttemptsByEIDandAppName',
  applicationFilesUrl:'/api/ApplicationFiles/GetApplicationFiles',
  downloadApplicationFiles:'/api/ApplicationFiles/ApplicationFiles/DownloadFile',
  deleteUploadedAttachmentWithoutId: '/api/EnquiryTracker/deleteEnquiryDetailsByAttachmentName/AttachmentName',


     // RCD API
  getRateCardDetails: '/api/RateCardDigitization/GetRateCardDetails',
  getRateCardDetailsbyId: '/api/RateCardDigitization/GetRateCardDetailsbyId',
  getMasterData: '/api/RateCardDigitization/GetMasterData',
  saveRateCardDetails: '/api/RateCardDigitization/Save',
  updateRateCardData: '/api/RateCardDigitization/Update',
  ApproveRejectRateCardData: '/api/RateCardDigitization/ApproveRejectRateCardData',
  GetRateCardDetailsbyStatus: '/api/RateCardDigitization/GetRateCardDetailsbyStatus'
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
