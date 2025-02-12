let videoStream;

// Open Camera and Show Live Preview
function openCamera() {
    const cameraContainer = document.getElementById("cameraContainer");
    const cameraFeed = document.getElementById("cameraFeed");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoStream = stream;
            cameraFeed.srcObject = stream;
            cameraContainer.style.display = "block";
        })
        .catch(err => {
            alert("Camera access denied!");
            console.error(err);
        });
}

function copyText() {
    const textOutput = document.getElementById("textOutput").textContent;

    if (!textOutput || textOutput === "Your text will appear here.") {
        alert("No text to copy!");
        return;
    }

    navigator.clipboard.writeText(textOutput)
        .then(() => alert("Text copied to clipboard!"))
        .catch(err => console.error("Failed to copy text: ", err));
}


// Capture Photo from Camera
function capturePhoto() {
    const cameraFeed = document.getElementById("cameraFeed");
    const uploadedImage = document.getElementById("uploadedImage");

    const canvas = document.createElement("canvas");
    canvas.width = cameraFeed.videoWidth;
    canvas.height = cameraFeed.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

    // Convert to image URL and display it
    uploadedImage.src = canvas.toDataURL("image/png");
    document.querySelector(".image-preview").style.display = "block";

    // Stop camera stream
    videoStream.getTracks().forEach(track => track.stop());
    document.getElementById("cameraContainer").style.display = "none";
}

// Show image preview when file is uploaded
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const uploadedImage = document.getElementById("uploadedImage");
            uploadedImage.src = e.target.result;
            document.querySelector(".image-preview").style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}

// Convert Image to Text using Tesseract.js
function convertImage() {
    const uploadedImage = document.getElementById("uploadedImage");
    const textOutput = document.getElementById("textOutput");

    if (!uploadedImage.src) {
        alert("Please upload an image or take a photo.");
        return;
    }

    Tesseract.recognize(
        uploadedImage.src,
        "eng",
        {
            logger: (m) => console.log(m),
        }
    ).then(({ data: { text } }) => {
        textOutput.textContent = text || "No text found in image";
    }).catch((error) => {
        textOutput.textContent = "Error processing image";
        console.error(error);
    });
}
