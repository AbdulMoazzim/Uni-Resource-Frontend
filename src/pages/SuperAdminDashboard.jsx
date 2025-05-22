import React, { useEffect, useState } from 'react';
import { School,  Bell,  Search,  Check, X  } from 'lucide-react';
import { fetchAPI } from '../utils/fetchAPI';
import { Link } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showNewAdminForm, setShowNewAdminForm] = useState([false, null]);
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    // Fetch institutions and pending requests from API

    fetchAPI('https://uni-resource.onrender.com/api/institution', 'GET').then(data => {
      setInstitutions(data);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching institutions:', error);
    });
  }, []);
  useEffect(() => {
    setActiveInstitutions(institutions.filter(inst => inst.active === true));
  }, [institutions]);

  useEffect(() => {
    if (showNewAdminForm[0]) {
      setNewAdmin(prevState => ({
        ...prevState,
        full_name: showNewAdminForm[1].admin_full_name,
        phone: showNewAdminForm[1].admin_phone_number
      }));
    }
  }, [showNewAdminForm]);
  
  // State for forms
  const pendingRequests = institutions.filter(institution => institution.active === false);
  const [activeInstitutions,setActiveInstitutions] = useState([]);

  const [showModal, setModal] = useState([false, null]);
  const [newAdmin, setNewAdmin] = useState({});
  // Analytics data
  const analyticsData = {
    totalInstitutions: institutions.length,
    activeInstitutions: activeInstitutions.length,
    pendingRequests: pendingRequests.length
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleNewAdminSubmit = async(e) => {
    try {
      e.preventDefault();
      let institutionId = showNewAdminForm[1].id;
      const myuser = await fetchAPI(`https://uni-resource.onrender.com/api/user/register`, `POST`, {email: newAdmin.email, password: newAdmin.password, role: 'admin', institution_id: institutionId, department_id: null});
      await fetchAPI(`https://uni-resource.onrender.com/api/institution/${institutionId}/admin/register`, `POST`, {...newAdmin, user_id: myuser.user.id});
      setShowNewAdminForm(false);
      setNewAdmin({
        institutionName: '',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        adminPassword: ''
      });
      fetchAPI('https://uni-resource.onrender.com/api/institution', 'GET').then(data => {
        setInstitutions(data);
      }).catch(error => {
        console.error('Error fetching institutions:', error);
      });
  
      alert("New admin account created successfully!");
    }
    catch (error) {
        console.error('Error creating new admin:', error);
        alert("Error creating new admin account. Please try again.");
    }
  };

  const deleteAllUsers = (id) => {
    fetchAPI(`https://uni-resource.onrender.com/api/user/institution/${id}`, 'DELETE').catch(error => {
      console.error('Error fetching institutions:', error);
    });
  };
  //Handle request rejection
  const handleRejectRequest = (requestId) => {

    fetchAPI(`https://uni-resource.onrender.com/api/institution/${requestId}`, 'DELETE').then(data => {

      setInstitutions((prevInstitutions) => prevInstitutions.filter((institution) => institution.id !== requestId));
    }).catch(error => {
      console.error('Error fetching institutions:', error);
    });
  };
  

  if (loading) return <div className='text-center'>Loading...</div>


  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="lg:w-64 bg-indigo-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">EduScheduler</h1>
          <p className="text-indigo-200 text-sm">Super Admin Panel</p>
        </div>
        
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <Link to="/Login"><p className="font-bold" onClick={()=> {
              localStorage.clear()
            }}>LogOut</p>
            </Link>
          </div>
        </header>

        <main className="px-6 py-8">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">Total Institutions</h3>
                <School className="text-indigo-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{analyticsData.totalInstitutions}</p>
              <p className="text-green-500 text-sm mt-2">{analyticsData.activeInstitutions} active</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">Pending Requests</h3>
                <Bell className="text-indigo-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{analyticsData.pendingRequests}</p>
              <p className="text-orange-500 text-sm mt-2">Requires attention</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">System Status</h3>
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
              </div>
              <p className="md:text-3xl font-bold text-gray-800 mt-2">Operational</p>
              <p className="text-gray-500 text-sm mt-2">All services running</p>
            </div>
          </div>

          {/* Pending Requests Section */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b px-6 py-4 flex items-center justify-between flex-wrap">
              <h2 className="text-lg font-semibold text-gray-800">Pending Institution Requests</h2>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium my-2">
                {pendingRequests.length} pending
              </span>
            </div>
            <div className="overflow-x-auto">
              {pendingRequests.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{request.name}</div>
                          <div className="text-sm text-gray-500">ID: #{request.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{request.official_email}</div>
                          <div className="text-sm text-gray-500">{request.phone_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.created_at}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => setShowNewAdminForm([true, {...request}])}
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100">
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleRejectRequest(request.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                              <X size={18} />
                            </button>
                            
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-500">No pending requests</div>
              )}
            </div>
          </div>

          {/* Registered Institutions */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b px-6 py-4 flex items-center justify-between flex-wrap">
              <h2 className="text-lg font-semibold text-gray-800">Registered Institutions</h2>
              <div className="relative my-2">
                <input type="text" onChange={(e)=> {
                  const searchValue = e.target.value.toLowerCase();
                  const filteredInstitutions = institutions.filter(institution => institution.name.toLowerCase().startsWith(searchValue));
                  console.log(filteredInstitutions);
                  setActiveInstitutions(filteredInstitutions);
                }} placeholder="Filter institutions..." className="w-[25vw] px-4 py-2 pl-10 overflow-clip border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
            <div className="overflow-x-auto">
              
               
              {activeInstitutions.length > 0 ? (<table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeInstitutions.map((institution) => (
                    <tr key={institution.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{institution.name}</div>
                        <div className="text-sm text-gray-500">ID: #{institution.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {institution.admin.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {institution.created_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium  bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            
                            <button 
                              onClick={() => setModal([true, institution.id])}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                              <X size={18} />
                            </button>
                            
                          </div>
                        </td>
                    </tr>
                  ))}  
                </tbody>
              </table>) : (<p className='text-center py-8'>No Institutions Registered</p>) }
            </div>
              <div className="px-6 py-4 text-sm text-gray-500">
                Showing {institutions.length} institutions
              </div>
          </div>
        </main>
      </div>

      {/* New Admin Modal */}
      {showNewAdminForm[0] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Add New Institution Admin</h2>
              <button 
                onClick={() => setShowNewAdminForm([false, {}])}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleNewAdminSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adminName">
                  Admin's Full Name
                </label>
                <input
                name='full_name'
                  type="text"
                  id="adminName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter admin name"
                  value={showNewAdminForm[1].admin_full_name}
                  required
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adminEmail">
                  Admin Email
                </label>
                <input
                name='email'
                  type="email"
                  id="adminEmail"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter admin email"
                  value={newAdmin.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adminPhone">
                  Admin Phone
                </label>
                <input
                name='phone'
                  type="tel"
                  id="adminPhone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter admin phone"
                  value={showNewAdminForm[1].admin_phone_number}
                  required
                  readOnly
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adminPassword">
                  Initial Password
                </label>
                <input
                name="password"
                  type="password"
                  id="adminPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Set initial password"
                  value={newAdmin.adminPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewAdminForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewAdminSubmit}
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Admin Modal */}
      {showModal[0] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Are you sure? to delete Admin's account!!!</h2>
            </div>
            <div className='p-6 flex items-center justify-end'>
              <button className="py-2 mx-2 px-6 rounded-md border-black border-1" onClick={()=> setModal(false, null)}>Cancel</button>
              <button className='py-2 mx-2 px-6 rounded-md bg-indigo-600 text-white' onClick={()=> {
                handleRejectRequest(showModal[1]);
                deleteAllUsers(showModal[1])
                setModal(false, null)
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;

// service_iqqqebh