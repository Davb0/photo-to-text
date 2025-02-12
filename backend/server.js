const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path;

    try {
        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
        fs.unlinkSync(imagePath); // Delete the file after processing
        res.json({ text });
    } catch (error) {
        res.status(500).json({ error: 'OCR processing failed' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
