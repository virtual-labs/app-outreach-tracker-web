const API_URL =
  process.env.REACT_APP_MODE === "production"
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL_DEV;

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function validateURL(url) {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  if (!urlRegex.test(url)) {
    return "Invalid URL. Please enter a valid URL.";
  }
  return null;
}

export { API_URL, CLIENT_ID, validateURL };
