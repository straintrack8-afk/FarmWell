import React, { useState, useRef } from 'react';
import { compressImage, validateImageFile } from '../../../utils/hatchery/imageUtils';
import { useLanguage } from "../../../../../contexts/LanguageContext";
import '../../../hatchery.css';

/**
 * PhotoUpload Component
 * Handles photo upload, compression, and gallery display
 */
function PhotoUpload({ photos = [], onPhotosChange, maxPhotos = 10 }) {
    const { language } = useLanguage();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const translations = {
        addPhotos: {
            en: "Add Photos",
            id: "Tambah Foto",
            vi: "Thêm Ảnh"
        },
        uploading: {
            en: "Uploading...",
            id: "Mengunggah...",
            vi: "Đang tải lên..."
        },
        photos: {
            en: "photos",
            id: "foto",
            vi: "ảnh"
        },
        photo: {
            en: "photo",
            id: "foto",
            vi: "ảnh"
        },
        maxPhotosError: {
            en: `Maximum ${maxPhotos} photos allowed`,
            id: `Maksimal ${maxPhotos} foto diizinkan`,
            vi: `Tối đa ${maxPhotos} ảnh được phép`
        },
        uploadError: {
            en: "Failed to upload photos",
            id: "Gagal mengunggah foto",
            vi: "Tải lên ảnh thất bại"
        },
        deletePhoto: {
            en: "Delete photo",
            id: "Hapus foto",
            vi: "Xóa ảnh"
        }
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);

        if (photos.length + files.length > maxPhotos) {
            setError(translations.maxPhotosError[language]);
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
            setError(translations.uploadError[language] + ': ' + err.message);
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
                    className="btn-hatchery btn-primary"
                    disabled={uploading || photos.length >= maxPhotos}
                >
                    {uploading ? translations.uploading[language] : translations.addPhotos[language]}
                </button>
                <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
                    {photos.length} / {maxPhotos} {photos.length === 1 ? translations.photo[language] : translations.photos[language]}
                </span>
            </div>

            {error && (
                <div className="alert error" style={{ marginBottom: '1rem' }}>
                    <span></span>
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
                                title={translations.deletePhoto[language]}
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
