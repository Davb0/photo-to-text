// Show image preview before processing
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

// Convert image to text
function convertImage() {
    const fileInput = document.getElementById("imageUpload");
    const textOutput = document.getElementById("textOutput");

    if (fileInput.files.length === 0) {
        alert("Please upload an image.");
        return;
    }

    const imageFile = fileInput.files[0];

    Tesseract.recognize(
        imageFile,
        "eng", // Language (English)
        {
            logger: (m) => console.log(m), // Logs OCR progress
        }
    ).then(({ data: { text } }) => {
        textOutput.textContent = text || "No text found in image";
    }).catch((error) => {
        textOutput.textContent = "Error processing image";
        console.error(error);
    });
}
