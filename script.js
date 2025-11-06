class QRCodeGenerator {
    constructor() {
        this.canvas = document.getElementById('qr-canvas');
        this.generateBtn = document.getElementById('generate-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.qrTypeSelect = document.getElementById('qr-type');
        this.inputFields = document.getElementById('input-fields');
        this.qrContainer = document.getElementById('qr-container');
        this.libraryStatus = document.getElementById('library-status');
        
        // Check if QR library is loaded
        this.isQRLibraryLoaded = false;
        
        // Updated to use image files instead of emojis
        this.logos = {
            facebook: 'logos/facebook.png',
            instagram: 'logos/instagram.png',
            linkedin: 'logos/linkedin.png',
            meetup: 'logos/meetup.png',
            website: 'logos/website.png',
            discord: 'logos/discord.png',
            email: 'logos/email.png',
            phone: 'logos/phone.png',
            wifi: 'logos/wifi.png',
            twitter: 'logos/twitter.png',
            youtube: 'logos/youtube.png',
            tiktok: 'logos/tiktok.png'
        };

        this.checkLibraryAndInit();
    }

    checkLibraryAndInit() {
        // Check multiple times if library is loaded
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds total
        
        const checkLibrary = () => {
            attempts++;
            
            if (typeof QRCode !== 'undefined') {
                this.isQRLibraryLoaded = true;
                this.initEventListeners();
                this.updateInputFields();
                this.showPlaceholder();
                this.updateLibraryStatus(true);
                return;
            }
            
            if (attempts < maxAttempts) {
                setTimeout(checkLibrary, 100);
            } else {
                this.updateLibraryStatus(false);
                this.showError('Failed to load QR code library. Please refresh the page and try again.');
            }
        };
        
        checkLibrary();
    }

    updateLibraryStatus(loaded) {
        if (loaded) {
            this.libraryStatus.innerHTML = '<div class="success">✓ QR Code library loaded successfully</div>';
            setTimeout(() => {
                this.libraryStatus.innerHTML = '';
            }, 3000);
        } else {
            this.libraryStatus.innerHTML = '<div class="error">✗ Failed to load QR Code library. Please check your internet connection and refresh the page.</div>';
        }
    }

    initEventListeners() {
        this.qrTypeSelect.addEventListener('change', () => {
            this.updateInputFields();
        });

        this.generateBtn.addEventListener('click', () => {
            this.generateQRCode();
        });

        this.downloadBtn.addEventListener('click', () => {
            this.downloadQRCode();
        });
    }

    showPlaceholder() {
        this.qrContainer.innerHTML = '<div class="placeholder-text">Your QR code will appear here</div>';
    }

    updateInputFields() {
        const type = this.qrTypeSelect.value;
        let html = '';

        switch (type) {
            case 'text':
                html = `
                    <div class="input-group">
                        <label for="text-input">Text:</label>
                        <textarea id="text-input" placeholder="Enter your text here..."></textarea>
                    </div>
                `;
                break;

            case 'url':
                html = `
                    <div class="input-group">
                        <label for="url-input">Website URL:</label>
                        <input type="url" id="url-input" placeholder="https://example.com">
                    </div>
                `;
                break;

            case 'custom-url':
                html = `
                    <div class="input-group">
                        <label for="custom-url-input">Custom URL:</label>
                        <input type="url" id="custom-url-input" placeholder="https://your-custom-link.com">
                        <small class="input-help">This QR code will redirect to your custom URL when scanned</small>
                    </div>
                `;
                break;

            case 'wifi':
                html = `
                    <div class="input-group">
                        <label for="wifi-ssid">Network Name (SSID):</label>
                        <input type="text" id="wifi-ssid" placeholder="MyWiFiNetwork">
                    </div>
                    <div class="input-group">
                        <label for="wifi-password">Password:</label>
                        <input type="text" id="wifi-password" placeholder="Password">
                    </div>
                    <div class="input-group">
                        <label for="wifi-security">Security Type:</label>
                        <select id="wifi-security">
                            <option value="WPA">WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">None</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>
                            <input type="checkbox" id="wifi-hidden"> Hidden Network
                        </label>
                    </div>
                `;
                break;

            case 'contact':
                html = `
                    <div class="input-group">
                        <label for="contact-name">Full Name:</label>
                        <input type="text" id="contact-name" placeholder="John Doe">
                    </div>
                    <div class="input-group">
                        <label for="contact-phone">Phone:</label>
                        <input type="tel" id="contact-phone" placeholder="+1234567890">
                    </div>
                    <div class="input-group">
                        <label for="contact-email">Email:</label>
                        <input type="email" id="contact-email" placeholder="john@example.com">
                    </div>
                    <div class="input-group">
                        <label for="contact-organization">Organization:</label>
                        <input type="text" id="contact-organization" placeholder="Company Name">
                    </div>
                    <div class="input-group">
                        <label for="contact-url">Website:</label>
                        <input type="url" id="contact-url" placeholder="https://example.com">
                    </div>
                `;
                break;

            case 'email':
                html = `
                    <div class="input-group">
                        <label for="email-address">Email Address:</label>
                        <input type="email" id="email-address" placeholder="recipient@example.com">
                    </div>
                    <div class="input-group">
                        <label for="email-subject">Subject:</label>
                        <input type="text" id="email-subject" placeholder="Subject line">
                    </div>
                    <div class="input-group">
                        <label for="email-body">Message:</label>
                        <textarea id="email-body" placeholder="Email message..."></textarea>
                    </div>
                `;
                break;

            case 'phone':
                html = `
                    <div class="input-group">
                        <label for="phone-number">Phone Number:</label>
                        <input type="tel" id="phone-number" placeholder="+1234567890">
                    </div>
                `;
                break;

            case 'sms':
                html = `
                    <div class="input-group">
                        <label for="sms-number">Phone Number:</label>
                        <input type="tel" id="sms-number" placeholder="+1234567890">
                    </div>
                    <div class="input-group">
                        <label for="sms-message">Message:</label>
                        <textarea id="sms-message" placeholder="SMS message..."></textarea>
                    </div>
                `;
                break;

            case 'social':
                html = `
                    <div class="input-group">
                        <label for="social-platform">Platform:</label>
                        <select id="social-platform">
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter</option>
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="social-username">Username/Profile:</label>
                        <input type="text" id="social-username" placeholder="@username or profile URL">
                    </div>
                `;
                break;
        }

        this.inputFields.innerHTML = html;
    }

    getQRData() {
        const type = this.qrTypeSelect.value;
        let data = '';

        try {
            switch (type) {
                case 'text':
                    data = document.getElementById('text-input').value;
                    break;

                case 'url':
                    const url = document.getElementById('url-input').value;
                    data = url.startsWith('http') ? url : `https://${url}`;
                    break;

                case 'custom-url':
                    const customUrl = document.getElementById('custom-url-input').value;
                    data = customUrl.startsWith('http') ? customUrl : `https://${customUrl}`;
                    break;

                case 'wifi':
                    const ssid = document.getElementById('wifi-ssid').value;
                    const password = document.getElementById('wifi-password').value;
                    const security = document.getElementById('wifi-security').value;
                    const hidden = document.getElementById('wifi-hidden').checked;
                    data = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
                    break;

                case 'contact':
                    const name = document.getElementById('contact-name').value;
                    const phone = document.getElementById('contact-phone').value;
                    const email = document.getElementById('contact-email').value;
                    const org = document.getElementById('contact-organization').value;
                    const contactUrl = document.getElementById('contact-url').value;
                    
                    data = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nORG:${org}\nURL:${contactUrl}\nEND:VCARD`;
                    break;

                case 'email':
                    const emailAddr = document.getElementById('email-address').value;
                    const subject = document.getElementById('email-subject').value;
                    const body = document.getElementById('email-body').value;
                    data = `mailto:${emailAddr}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    break;

                case 'phone':
                    const phoneNum = document.getElementById('phone-number').value;
                    data = `tel:${phoneNum}`;
                    break;

                case 'sms':
                    const smsNumber = document.getElementById('sms-number').value;
                    const smsMessage = document.getElementById('sms-message').value;
                    data = `sms:${smsNumber}?body=${encodeURIComponent(smsMessage)}`;
                    break;

                case 'social':
                    const platform = document.getElementById('social-platform').value;
                    const username = document.getElementById('social-username').value;
                    
                    const socialUrls = {
                        facebook: `https://facebook.com/${username.replace('@', '')}`,
                        instagram: `https://instagram.com/${username.replace('@', '')}`,
                        linkedin: `https://linkedin.com/in/${username.replace('@', '')}`,
                        twitter: `https://twitter.com/${username.replace('@', '')}`,
                        youtube: `https://youtube.com/@${username.replace('@', '')}`,
                        tiktok: `https://tiktok.com/@${username.replace('@', '')}`
                    };
                    
                    data = username.startsWith('http') ? username : socialUrls[platform];
                    break;
            }

            if (!data.trim()) {
                throw new Error('Please fill in the required fields');
            }

            return data;
        } catch (error) {
            throw new Error(`Error generating QR data: ${error.message}`);
        }
    }

    async generateQRCode() {
        // Check if library is loaded before generating
        if (!this.isQRLibraryLoaded || typeof QRCode === 'undefined') {
            this.showError('QR Code library is not loaded. Please refresh the page and try again.');
            return;
        }

        try {
            this.clearMessages();
            this.showLoading();

            const data = this.getQRData();
            const size = parseInt(document.getElementById('size').value);
            const foregroundColor = document.getElementById('foreground-color').value;
            const backgroundColor = document.getElementById('background-color').value;
            const selectedLogo = document.getElementById('logo').value;

            const options = {
                width: size,
                height: size,
                color: {
                    dark: foregroundColor,
                    light: backgroundColor
                },
                errorCorrectionLevel: 'H' // Higher error correction for logos
            };

            // Generate QR code
            await QRCode.toCanvas(this.canvas, data, options);
            
            // Add logo if selected
            if (selectedLogo && this.logos[selectedLogo]) {
                await this.addLogoToCanvas(selectedLogo, size);
            }

            this.qrContainer.classList.add('has-qr');
            this.downloadBtn.style.display = 'block';
            this.showSuccess('QR Code generated successfully!');

        } catch (error) {
            this.showError(error.message);
            console.error('QR Code generation error:', error);
        }
    }

    async addLogoToCanvas(logoType, canvasSize) {
        return new Promise((resolve, reject) => {
            const ctx = this.canvas.getContext('2d');
            const logoImage = new Image();
            
            logoImage.onload = () => {
                try {
                    const logoSize = Math.floor(canvasSize * 0.12); // Slightly smaller for better scanning
                    const x = (canvasSize - logoSize) / 2;
                    const y = (canvasSize - logoSize) / 2;

                    // Create a white background circle for the logo
                    const padding = 8;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(canvasSize / 2, canvasSize / 2, (logoSize + padding) / 2, 0, 2 * Math.PI);
                    ctx.fill();

                    // Draw a subtle border
                    ctx.strokeStyle = '#e0e0e0';
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Draw the logo image
                    ctx.drawImage(logoImage, x, y, logoSize, logoSize);
                    resolve();
                } catch (error) {
                    console.warn('Failed to add logo to canvas:', error);
                    resolve(); // Continue without logo
                }
            };

            logoImage.onerror = () => {
                console.warn(`Failed to load logo: ${this.logos[logoType]}`);
                resolve(); // Continue without logo
            };

            logoImage.src = this.logos[logoType];
        });
    }

    showLoading() {
        this.qrContainer.innerHTML = '<div class="loading"></div>';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        this.inputFields.appendChild(errorDiv);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.textContent = message;
        this.inputFields.appendChild(successDiv);
    }

    clearMessages() {
        const messages = this.inputFields.querySelectorAll('.error, .success');
        messages.forEach(msg => msg.remove());
    }

    downloadQRCode() {
        try {
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = this.canvas.toDataURL();
            link.click();
        } catch (error) {
            this.showError('Error downloading QR code. Please try again.');
            console.error('Download error:', error);
        }
    }
}

// Initialize the QR Code Generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit more for libraries to load
    setTimeout(() => {
        new QRCodeGenerator();
    }, 500);
});
