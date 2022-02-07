import Link from "next/link";
import CameraSelect from "../../components/webRTC/devices/CameraSelect";
import MicSelect from "../../components/webRTC/devices/MicSelect";
import SpeakerSelect from "../../components/webRTC/devices/SpeakerSelect";
import MyFace from "../../components/webRTC/MyFace";
import styles from "../../scss/web-conference/check-devices.module.scss";


export default CheckDevices;

function CheckDevices() {
  return <div className={styles.container}>
      <div className={styles.videoContainer}>
        <div><MyFace /></div>
        <div className={styles.selectContainer}>
          <label htmlFor="camera-select">카메라</label><br/>
          <CameraSelect id="camera-select" /><br/>
          <label htmlFor="mic-select">마이크</label><br/>
          <MicSelect id="mic-select" /><br/>
          <label htmlFor="speaker-select">스피커</label><br/>
          <SpeakerSelect id="speaker-select" /><br/>
        </div>
        <Link href="/web-conference">
          <a className={styles.nextBtn}
          >
            <button><h1>NEXT</h1></button>
          </a>
        </Link>
      </div>
    </div>
}