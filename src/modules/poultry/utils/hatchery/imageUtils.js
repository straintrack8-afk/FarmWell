/**
 * Image compression and handling utilities
 */

/**
 * Compress image file to base64 string
 * @param {File} file - Image file
 * @param {number} maxSizeKB - Maximum size in KB (default: 200KB)
 * @param {number} maxWidth - Maximum width in pixels (default: 1024)
 * @returns {Promise<string>} Base64 encoded image string
 */
export async function compressImage(file, maxSizeKB = 200, maxWidth = 1024) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);

                // Try different quality levels to meet size requirement
                let quality = 0.9;
                let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

                // Reduce quality until size is acceptable
                while (getBase64Size(compressedDataUrl) > maxSizeKB * 1024 && quality > 0.1) {
                    quality -= 0.1;
                    compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                }

                resolve(compressedDataUrl);
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Get size of base64 string in bytes
 */
function getBase64Size(base64String) {
    const stringLength = base64String.length - 'data:image/jpeg;base64,'.length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    return sizeInBytes;
}

/**
 * Validate image file
 */
export function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB original file size limit

    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Invalid file type. Please upload JPG, PNG, or WebP images.'
        };
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File too large. Maximum size is 10MB.'
        };
    }

    return { valid: true };
}

/**
 * Create thumbnail from image
 */
export async function createThumbnail(base64Image, maxSize = 150) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate thumbnail dimensions (square)
            const size = Math.min(img.width, img.height);
            const x = (img.width - size) / 2;
            const y = (img.height - size) / 2;

            canvas.width = maxSize;
            canvas.height = maxSize;

            // Draw cropped and resized image
            ctx.drawImage(img, x, y, size, size, 0, 0, maxSize, maxSize);

            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };

        img.onerror = () => {
            reject(new Error('Failed to create thumbnail'));
        };

        img.src = base64Image;
    });
}

/**
 * Convert data URL to Blob
 */
export function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
}

/**
 * Download image from base64
 */
export function downloadImage(base64Data, filename) {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Capture image from camera
 */
export async function captureFromCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });

        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            // Wait for video to be ready
            video.onloadedmetadata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0);

                // Stop the stream
                stream.getTracks().forEach(track => track.stop());

                const imageData = canvas.toDataURL('image/jpeg', 0.9);
                resolve(imageData);
            };

            video.onerror = () => {
                stream.getTracks().forEach(track => track.stop());
                reject(new Error('Failed to access camera'));
            };
        });
    } catch (error) {
        throw new Error('Camera access denied or not available');
    }
}
