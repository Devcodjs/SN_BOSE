import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import MapPicker from '../components/MapPicker';
import './pages.css';

const categories = ['Roads', 'Garbage', 'Water', 'Electricity', 'Sanitation', 'Other'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

const CreateIssuePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    address: '',
    latitude: '',
    longitude: '',
    image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleLocationChange = useCallback((location) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate
    if (!formData.title.trim()) return setError('Title is required');
    if (!formData.description.trim()) return setError('Description is required');
    if (!formData.category) return setError('Category is required');

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('priority', formData.priority);
      data.append('address', formData.address);
      data.append('latitude', formData.latitude);
      data.append('longitude', formData.longitude);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await API.post('/issues', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Issue reported successfully!');
      setTimeout(() => {
        navigate(`/issues/${res.data.data._id}`);
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create issue. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" id="create-issue-page">
      <div className="container-custom" style={{ maxWidth: '800px' }}>
        <div className="page-header">
          <h1>📝 Report an Issue</h1>
          <p>Help improve your community by reporting civic issues</p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          {error && (
            <div className="alert-custom alert-error">⚠️ {error}</div>
          )}
          {success && (
            <div className="alert-custom alert-success">✅ {success}</div>
          )}

          <form onSubmit={handleSubmit} id="create-issue-form">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Issue Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control-custom"
                placeholder="e.g., Pothole on MG Road causing accidents"
                value={formData.title}
                onChange={handleChange}
                maxLength={200}
                required
              />
            </div>

            {/* Category + Priority */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  className="form-control-custom"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  className="form-control-custom"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  {priorities.map((pri) => (
                    <option key={pri} value={pri}>{pri}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-control-custom"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={handleChange}
                maxLength={2000}
                rows={4}
                required
              />
              <small style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
                {formData.description.length}/2000 characters
              </small>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label>Photo Evidence</label>
              <div className="image-upload-area" id="image-upload-area">
                <input
                  type="file"
                  id="image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={() => {
                        setFormData({ ...formData, image: null });
                        setImagePreview(null);
                      }}
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <label htmlFor="image" className="image-upload-label">
                    <span className="upload-icon">📷</span>
                    <span>Click to upload a photo</span>
                    <span className="upload-hint">JPEG, PNG or WebP — Max 5MB</span>
                  </label>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label htmlFor="address">Location Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-control-custom"
                placeholder="e.g., Near City Mall, MG Road, Bangalore"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Map */}
            <div className="form-group">
              <label>Pin Location on Map</label>
              <MapPicker onChange={handleLocationChange} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              id="submit-issue"
              disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              {loading ? '📤 Submitting...' : '📤 Submit Issue Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIssuePage;
