import { FRONTEND_URL } from "../../config";
export default async function getStreamPermission(url) {
  await navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then(() => {
    window.open(FRONTEND_URL + url)
  })
  .catch(() => {
    window.location.href = FRONTEND_URL + "/denied"
  });
}