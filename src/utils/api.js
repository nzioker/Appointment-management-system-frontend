const isDevelopment = process.env.NODE_ENV === 'development'

export const myBaseUrl = isDevelopment
  ? process.env.REACT_APP_API_BASE_URL_LOCAL
  : process.env.REACT_APP_API_BASE_URL_DEPLOY
