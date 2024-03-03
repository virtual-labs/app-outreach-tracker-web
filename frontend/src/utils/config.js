const API_URL = "http://localhost:5050";
const CLIENT_ID =
  "235297947063-g1b35c68kqaodn1g5j4q3tnbg7jdmegs.apps.googleusercontent.com";

function validateURL(url) {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  if (!urlRegex.test(url)) {
    return "Invalid URL. Please enter a valid URL.";
  }
  return null;
}

export { API_URL, CLIENT_ID, validateURL };
