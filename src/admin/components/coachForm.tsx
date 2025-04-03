import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Coach, CoachFormData } from '../coachTypes';
import { coachesApi } from '../api/coachesApi';
import QuillEditor from './quillEditor';

const CoachForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState<CoachFormData>({
    name_en: '',
    name_es: null,
    name_ru: null,
    role_en: '',
    role_es: null,
    role_ru: null,
    license: null,
    bio_en: '',
    bio_es: null,
    bio_ru: null,
    photo_url: null,
    sort_order: 0,
    is_active: true
  });

  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  // Additional states for languages
  const [showRussian, setShowRussian] = useState(false);
  const [showSpanish, setShowSpanish] = useState(false);

  // Load coach data when editing
  useEffect(() => {
    const fetchCoachData = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const coachData = await coachesApi.getCoachById(parseInt(id, 10));
          
          setFormData({
            name_en: coachData.name_en,
            name_es: coachData.name_es,
            name_ru: coachData.name_ru,
            role_en: coachData.role_en,
            role_es: coachData.role_es,
            role_ru: coachData.role_ru,
            license: coachData.license,
            bio_en: coachData.bio_en,
            bio_es: coachData.bio_es,
            bio_ru: coachData.bio_ru,
            photo_url: coachData.photo_url,
            sort_order: coachData.sort_order || 0,
            is_active: coachData.is_active
          });

          // Show additional languages if they are filled
          if (coachData.name_ru || coachData.bio_ru) {
            setShowRussian(true);
          }
          
          if (coachData.name_es || coachData.bio_es) {
            setShowSpanish(true);
          }

          // Set photo preview
          if (coachData.photo_url) {
            setPreviewPhotoUrl(coachData.photo_url);
          }
          
          setError(null);
        } catch (err) {
          console.error('Error loading coach data:', err);
          setError('Failed to load coach data');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchCoachData();
  }, [id, isEditMode]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // For checkbox, handle value specially
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  // Handle text editor changes
  const handleEditorChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle photo change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Upload photo if selected
      let photoUrl = formData.photo_url;
      if (photoFile) {
        photoUrl = await coachesApi.uploadCoachPhoto(photoFile);
      }
      
      // Prepare data for saving
      const coachData: CoachFormData = {
        ...formData,
        photo_url: photoUrl,
        // Set empty values for unused languages
        name_ru: showRussian ? formData.name_ru : null,
        bio_ru: showRussian ? formData.bio_ru : null,
        role_ru: showRussian ? formData.role_ru : null,
        name_es: showSpanish ? formData.name_es : null,
        bio_es: showSpanish ? formData.bio_es : null,
        role_es: showSpanish ? formData.role_es : null,
      };
      
      // Save data
      if (isEditMode && id) {
        await coachesApi.updateCoach(parseInt(id, 10), coachData);
      } else {
        await coachesApi.createCoach(coachData);
      }
      
      // Redirect to coaches list
      navigate('/admin/coaches');
      
    } catch (err) {
      console.error('Error saving coach:', err);
      setError('Failed to save coach data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name_en) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Coach' : 'Create Coach'}
        </h1>
        <button
          onClick={() => navigate('/admin/coaches')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to List
        </button>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* English version */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">English Version</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="role_en"
              value={formData.role_en}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <QuillEditor
            label="Biography"
            value={formData.bio_en}
            onChange={(value) => handleEditorChange('bio_en', value)}
            required
          />
        </div>
        
        {/* Russian version */}
        <div className="mb-6">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Russian Version</h2>
            <button 
              type="button"
              onClick={() => setShowRussian(!showRussian)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showRussian ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showRussian && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (RU)
                </label>
                <input
                  type="text"
                  name="name_ru"
                  value={formData.name_ru || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role (RU)
                </label>
                <input
                  type="text"
                  name="role_ru"
                  value={formData.role_ru || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <QuillEditor
                label="Biography (RU)"
                value={formData.bio_ru || ''}
                onChange={(value) => handleEditorChange('bio_ru', value)}
              />
            </>
          )}
        </div>
        
        {/* Spanish version */}
        <div className="mb-6">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Spanish Version</h2>
            <button 
              type="button"
              onClick={() => setShowSpanish(!showSpanish)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showSpanish ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showSpanish && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (ES)
                </label>
                <input
                  type="text"
                  name="name_es"
                  value={formData.name_es || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role (ES)
                </label>
                <input
                  type="text"
                  name="role_es"
                  value={formData.role_es || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <QuillEditor
                label="Biography (ES)"
                value={formData.bio_es || ''}
                onChange={(value) => handleEditorChange('bio_es', value)}
              />
            </>
          )}
        </div>
        
        {/* Additional information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Additional Information</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License
            </label>
            <input
              type="text"
              name="license"
              value={formData.license || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
        </div>

        {/* Coach photo */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Coach Photo</h2>
          
          {previewPhotoUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current photo:</p>
              <img 
                src={previewPhotoUrl} 
                alt="Coach Preview" 
                className="max-w-full h-auto max-h-48 border object-cover"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload new photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full p-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended size: 300x400 pixels
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/admin/coaches')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoachForm;