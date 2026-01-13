import React, { useState, useRef } from 'react';
import { compressImage, validateImageFile } from '../../../utils/hatchery/imageUtils';
import '../../../hatchery.css';

/**
 * PhotoUpload Component
 * Handles photo upload, compression, and gallery display
 */
function PhotoUpload({ photos = [], onPhotosChange, maxPhotos = 10 }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);

        if (photos.length + files.length > maxPhotos) {
            setError(`Maximum ${maxPhotos} photos allowed`);
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const newPhotos = [];

            for (const file of files) {
                // Validate file
                const validation = validateImageFile(file);
                if (!validation.valid) {
                    setError(validation.error);
                    continue;
                }

                // Compress image
                const compressed = await compressImage(file, 200, 1024);

                newPhotos.push({
                    id: Date.now() + Math.random(),
                    data: compressed,
                    filename: file.name,
                    uploadedAt: new Date().toISOString()
                });
            }

            onPhotosChange([...photos, ...newPhotos]);
        } catch (err) {
            setError('Failed to upload photos: ' + err.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = (photoId) => {
        onPhotosChange(photos.filter(p => p.id !== photoId));
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
                <button
                    type="button"
                    onClick={handleBrowseClick}
                    className="btn-hatchery btn-outline"
                    disabled={uploading || photos.length >= maxPhotos}
                >
                    {uploading ? '📤 Uploading...' : '📷 Add Photos'}
                </button>
                <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
                    {photos.length} / {maxPhotos} photos
                </span>
            </div>

            {error && (
                <div className="alert error" style={{ marginBottom: '1rem' }}>
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {photos.length > 0 && (
                <div className="photo-gallery">
                    {photos.map((photo) => (
                        <div key={photo.id} className="photo-item">
                            <img src={photo.data} alt={photo.filename} />
                            <button
                                type="button"
                                className="photo-delete"
                                onClick={() => handleDelete(photo.id)}
                                title="Delete photo"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PhotoUpload;
