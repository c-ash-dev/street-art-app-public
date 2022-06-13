/*
  Application Constants
*/

export const Device = {
  Platform: {
    Android: 'Android',
    Browser: 'browser',
  },
  Model: {
    Pixel: 'Pixel 2',
    Chrome: 'Chrome',
  },
}

// pages controlled by Vuejs
export const Routes = {
  SPLASH: 'Splash',
  LOGIN: 'Login',
  SIGNUP: 'SignUp',
  APPMAIN: 'AppMain',
}

export const ImageCaptureMethods = {
  CAMERA: '--camera--',
  GALLERY: '--gallery--',
}

export const ImageCaptureDefaults = {
  quality: 50,
  maxDimension: 2000,
}

export const GeoLocationUpdateFrequency = 2000

export const SplashScreenDelay = 2000

export const ProgressDialogContent = {
  Upload: 'Uploading your awesome image.',
}
