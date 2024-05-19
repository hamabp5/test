const webcamElement = document.getElementById('webcam');
const statusElement = document.getElementById('status');
let model;

async function setupWebcam() {
    return new Promise((resolve, reject) => {
        const navigatorAny = navigator;
        navigator.getUserMedia = navigator.getUserMedia ||
            navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
            navigatorAny.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                { video: true },
                stream => {
                    webcamElement.srcObject = stream;
                    webcamElement.addEventListener('loadeddata', () => resolve(), false);
                },
                error => reject(error)
            );
        } else {
            reject(new Error('getUserMedia is not supported in this browser'));
        }
    });
}

async function init() {
    try {
        const modelURL = 'model/model.json'; // モデルのURLを指定
        const metadataURL = 'model/metadata.json'; // メタデータのURLを指定

        model = await tmImage.load(modelURL, metadataURL);
        await setupWebcam();
        predict();
    } catch (error) {
        console.error(error);
        statusElement.innerText = 'カメラの起動に失敗しました: ' + error.message;
    }
}

async function predict() {
    const prediction = await model.predict(webcamElement);
    statusElement.innerText = prediction[0].className === "整頓済み" ? "デスクは整頓されています" : "デスクが散らかっています";
    requestAnimationFrame(predict);
}

init();
