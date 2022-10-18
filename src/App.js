import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [id, setId] = useState(0);
  const videoRef = useRef(null);
  const photoRef = useRef(null);

  useEffect(() => {
    getUserCamera();
  }, [videoRef]);

  const idb =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  const getUserCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => console.log(error));
  };

  const capture = () => {
    let width = 250;
    let height = width / (16 / 9);
    let photo = photoRef.current;
    let video = videoRef.current;
    photo.width = width;
    photo.height = height;
    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, photo.width, photo.height);
    const dataURL = photo.toDataURL();

    setId(id + 1);
    let body = {
      id,
      link: dataURL,
    };
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ body });
    }
    idb.open("pwa-carscan", 2);
  };

  return (
    <div className="App">
      <div className="videoContainer">
        <h3 className="title">Click on the icon below to capture image</h3>
        <video className="videoBox" ref={videoRef}></video>
        <button className="captureBtn" onClick={capture}>
          <img className="captureImg" src="logo192.png" alt="click" />
        </button>
      </div>
      <canvas ref={photoRef} className="clickedImg"></canvas>
    </div>
  );
}

export default App;
