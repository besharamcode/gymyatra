import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiImage, FiSave } from 'react-icons/fi';
import { updateProfile, reset } from '../../redux/authSlice';

const Profile = () => {
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );
  
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePic: '',
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user.name,
        email: user.user.email,
        profilePic: user.user.profilePic || '',
      });
    }
  }, [user]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    
    if (isSuccess) {
      toast.success('Profile updated successfully');
    }
    
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      name: formData.name,
      email: formData.email,
      profilePic: formData.profilePic,
    };
    
    dispatch(updateProfile(userData));
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden mb-4 md:mb-0 md:mr-6">
              {formData.profilePic ? (
                <img 
                  src={formData.profilePic} 
                  alt={formData.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-primary text-4xl" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{formData.name}</h2>
              <p className="text-gray-600">{formData.email}</p>
              {user && (
                <p className="text-sm mt-1 bg-primary/10 text-primary px-2 py-1 rounded inline-block">
                  {user.user.role === 'admin' ? 'Admin' : 'Member'}
                </p>
              )}
            </div>
          </div>
          
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    className="form-input pl-10"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <FiMail />
                  </span>
                  <input
                    type="email"
                    className="form-input pl-10"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="Your email address"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="profilePic">
                  Profile Picture URL
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <FiImage />
                  </span>
                  <input
                    type="text"
                    className="form-input pl-10"
                    id="profilePic"
                    name="profilePic"
                    value={formData.profilePic}
                    onChange={onChange}
                    placeholder="URL to your profile picture"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Enter a URL to your profile picture. Leave empty to use default.
                </p>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full flex justify-center items-center mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
                {!isLoading && <FiSave className="ml-2" />}
              </button>
            </div>
          </form>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-700 font-medium">Account Created</h3>
              <p className="text-gray-600">
                {user && user.user.createdAt
                  ? new Date(user.user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-700 font-medium">Account Type</h3>
              <p className="text-gray-600">
                {user && user.user.role === 'admin' ? 'Administrator' : 'Member'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 