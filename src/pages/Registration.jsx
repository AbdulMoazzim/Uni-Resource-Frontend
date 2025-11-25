import { useState } from 'react';
import { Building, Mail, Phone, Globe, MapPin, Calendar, Users, Award, FileText, ChevronLeft, Icon, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function InstitutionRegistration() {
  const navigate = useNavigate();
  const [hide1, setHide1] = useState(true);
  const [hide3, setHide3] = useState(true);
  const [hide4, setHide4] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    year_established: '',
    institution_code: '',
    website_url: '',
    country: '',
    state_province: '',
    city: '',
    postal_code: '',
    full_address: '',
    accreditation_details: '',
    additional_notes: '',
    admin_phone_number: '',
    admin_full_name: '',

  });

  const handleChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (!(phoneRegex.test(formData.admin_phone_number))) {
      console.log("Valid phone number");
      setHide1(false);
      setTimeout(() => {
        setHide1(true);
      }, 3000);
      return;
    }
    const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    if (formData.website_url.length > 0 && !urlRegex.test(formData.website_url)) { 
      setHide3(false);
      setTimeout(() => {
        setHide3(true);
      }, 3000);
      return;
    }
    const date = new Date();
    if (Number(formData.year_established) > date.getFullYear() && formData.year_established.length > 0) { 
      setHide4(false);
      setTimeout(() => {
        setHide4(true);
      }, 3000);
      return;
    }
    

    fetch('http://127.0.0.1:5000/api/institution/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(response => {
      if (response.ok) {
        setFormData({
          name: '',
          year_established: '',
          institution_code: '',
          website_url: '',
          country: '',
          state_province: '',
          city: '',
          postal_code: '',
          full_address: '',
          accreditation_details: '',
          additional_notes: '',
          admin_phone_number: '',
          admin_full_name: '',

        });
        navigate("/waiting");
      } else {
        alert('Failed to register institution. Please try again.');
      }
    }).catch(error => {
      console.error('Error:', error);
      alert('An error occurred while registering the institution. Please try again.');
    });
  };

 

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <Navbar condition={true} />
      {/* Form Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Institution Registration</h1>
          <p className="text-gray-600 mt-1">
            Please complete the form below to register your educational institution.
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 md:p-8 border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Institution Name<span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                        placeholder="Enter institution name"
                        required={true}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <label htmlFor="year_established" className="block text-sm font-medium text-gray-700 mb-1">
                        Year Established
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="year_established"
                          id="year_established"
                          value={formData.year_established}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                          placeholder="YYYY"
                        />
                      </div>
                    </div>
                    <p className={`text-sm text-red-500 ${hide4 ? "opacity-0" : "opacity-100"}`}>Year should be valid</p>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="institution_code" className="block text-sm font-medium text-gray-700 mb-1">
                      Institution Code<span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="institution_code"
                        id="institution_code"
                        value={formData.institution_code}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                        placeholder="Unique institution code"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
                  
                  
                  <div>
                    <p className={`text-sm text-red-500 ${hide3 ? "opacity-0" : "opacity-100"}`}>Please provide a valid URL.</p>
                    <div className="mb-4">
                      <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="website_url"
                          id="website_url"
                          value={formData.website_url}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                          placeholder="https://www.institution.edu"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Admin Information Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Admin Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
                  <div>
                  <p className='opacity-0'>Poka</p>
                    <div className="mb-4">
                      <label htmlFor="official_email" className="block text-sm font-medium text-gray-700 mb-1">
                        Admin's Full Name<span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name='admin_full_name'
                          value={formData.admin_full_name}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                          placeholder="John Doe"
                          required={true}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className={`text-sm text-red-500 ${hide1 ? "opacity-0" : "opacity-100"}`}>Please provide a valid Contact No for official communication.</p>
                    <div className="mb-4">
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                        Admin's Contact<span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="admin_phone_number"
                          id="phone_number"
                          value={formData.admin_phone_number}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                          placeholder="+1 (123) 456-7890"
                          required={true}
                        />
                      </div>
                    </div>
                  </div>
                  
                 
                </div>
              </div>

              {/* Location Information Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Location Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
                  <div className="mb-4">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country<span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="country"
                        id="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                        placeholder="Enter country"
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="state_province" className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province<span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="state_province"
                        id="state_province"
                        value={formData.state_province}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                        placeholder="Enter state or province"
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City<span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                        placeholder="Enter city"
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code<span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="postal_code"
                        id="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                        placeholder="Enter postal code"
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">

                      <div className="mb-4">
                      <label htmlFor="full_address" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address<span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          name="full_address"
                          id="full_address"
                          rows="3"
                          onChange={handleChange}
                          value={formData.full_address}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                          placeholder="Enter complete street address"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>



                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">

                  <div className="md:col-span-2">
                    
                    <div className="mb-4">
                      <label htmlFor="accreditation_details" className="block text-sm font-medium text-gray-700 mb-1">
                        Accreditation Details
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                          <Award className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          name="accreditation_details"
                          id="accreditation_details"
                          rows="3"
                          onChange={handleChange}
                          value={formData.accreditation_details}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                          placeholder="Enter accreditation information if applicable"
                          
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label htmlFor="additional_notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          name="additional_notes"
                          id="additional_notes"
                          rows="3"
                          value={formData.additional_notes}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                          placeholder="Any other information you would like to provide"
                         
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Register Institution
                </button>
              </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}