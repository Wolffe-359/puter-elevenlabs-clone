# Puter Voice Studio

A lightweight web-based text-to-speech application powered by Puter.js and ElevenLabs.

## Overview

Puter Voice Studio provides a simple interface for generating high-quality AI voiceovers directly in the browser without requiring an ElevenLabs API key.

The application uses Puter's ElevenLabs integration to convert text into speech and is designed to run entirely client-side, making it suitable for deployment on GitHub Pages or any static web host.

## Features

### Text-to-Speech

Generate realistic AI speech from text using ElevenLabs voices.

### Multiple Models

Choose between supported ElevenLabs models:

* eleven_multilingual_v2
* eleven_flash_v2_5
* eleven_turbo_v2_5
* eleven_v3

### Audio Formats

Generate audio in supported output formats:

* MP3 Standard
* MP3 High Quality

### Batch Generation

Generate multiple voiceovers from a single input.

Separate scripts using:

---

Example:

Hello world.

---

This is another script.

---

Third script.

### Generation History

Recently generated scripts are stored locally in your browser.

### Auto-Save

Text entered into the editor is automatically saved to local storage and restored when the page is reopened.

### Download Support

Generated audio can be downloaded for offline use.

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Puter.js
* ElevenLabs Text-to-Speech

## Installation

### Local Usage

1. Download or clone the repository.
2. Open index.html in a modern browser.
3. Generate speech directly from the interface.

### GitHub Pages Deployment

1. Create a new GitHub repository.

2. Upload:

   * index.html
   * style.css
   * app.js
   * README.md

3. Open Repository Settings.

4. Navigate to Pages.

5. Select:

   * Source: Deploy from branch
   * Branch: main
   * Folder: / (root)

6. Save.

After deployment, GitHub will provide a public URL for the application.

## Authentication

Depending on Puter's current platform requirements, users may be prompted to sign in before generating audio.

This authentication process is handled directly by Puter and does not require any server-side configuration.

## Project Structure

puter-elevenlabs-clone/

├── index.html

├── style.css

├── app.js

└── README.md

## Disclaimer

This project is an unofficial interface built on top of Puter's ElevenLabs integration.

Availability, authentication requirements, supported models, and usage limits are controlled by Puter and may change over time.

## License

This project is provided as-is for educational and personal use.
