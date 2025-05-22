import svg1 from '../assets/college students-pana.svg';
import svg2 from '../assets/Graduation-rafiki.svg';
import svg3 from '../assets/college campus-amico.svg';
import svg4 from '../assets/Teaching-pana.svg';
import svg5 from '../assets/Exams-rafiki.svg';
import icon1 from '../assets/clock.png';
import icon2 from '../assets/resource.png';
import icon3 from '../assets/notification.svg';
import {Users, Clock, CheckCircle, Settings } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function EducationalSchedulingLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar condition={false} />
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Get The Best Online <span className="text-blue-600">Scheduling System</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-md">
              The easiest way to manage class and lab allocations for students and teachers. Perfect solution for educational institutions.
            </p>
            <div className="mt-8">
              <Link to="/register" className="px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 flex justify-center">
            <div className="relative h-64 w-64 lg:h-96 lg:w-96">
              <div className="absolute inset-0 bg-gray-300 rounded-full  flex items-center justify-center">

              <img 
                src={svg1} 
                alt="svg1"
                className="relative z-10"
              />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Use Our System */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Use EduSchedule?</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              We offer the best scheduling system designed specifically for educational institutions with role-based access control.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Easy To Use</h3>
              <p className="mt-2 text-gray-500">
                Simple interface for creating and managing schedules for classes and labs with just a few clicks.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Multiple User Roles</h3>
              <p className="mt-2 text-gray-500">
                Support for different user roles including super admin, institution admin, department heads, teachers, and students.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                <Settings className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Flexible Management</h3>
              <p className="mt-2 text-gray-500">
                Teachers can request schedule changes, and administrators can easily manage and approve these requests.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="bg-[#cde6ff] py-16" id='features'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex justify-center mb-10 lg:mb-0">
              <div className="relative">
                <div className="relative z-10 bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-200">
                  <img 
                    src={svg2}
                    alt="svg2" 
                    className="w-56 h-auto"
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold ">#1 Platform For Educational Scheduling</h2>
              <p className="mt-">
                The most comprehensive scheduling platform designed specifically for educational institutions of all sizes.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 " />
                  <span className="ml-2 ">100% Customizable Features</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 " />
                  <span className="ml-2 ">Real-time Schedule Updates</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5" />
                  <span className="ml-2 ">Role-based Access Control</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 " />
                  <span className="ml-2 ">Advanced Reporting System</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Features</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Explore our comprehensive features designed to make educational scheduling efficient and user-friendly.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <img 
                src={svg3} 
                alt="Institution Management" 
                className="m-auto h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900">Institution Management</h3>
              <p className="mt-2 text-gray-500">
                Create and manage multiple institutions with customized settings and user roles.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <img 
                src={svg5}
                alt="Schedule Management" 
                className="m-auto h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900">Schedule Management</h3>
              <p className="mt-2 text-gray-500">
                Create, edit, and manage class and lab schedules with conflict detection.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <img 
                src={svg4} 
                alt="User Role Management" 
                className="m-auto h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900">User Role Management</h3>
              <p className="mt-2 text-gray-500">
                Define user roles with specific permissions and access levels.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-gray-900">More Features</h3>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center">
                <img 
                  src={icon1} 
                  alt="Feature" 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="ml-4 text-left">
                  <h4 className="text-base font-medium text-gray-900">Automated Time Slot Generation</h4>
                  <p className="mt-1 text-sm text-gray-500">Smart scheduling system</p>
                </div>
              </div>

              <div className="flex items-center">
                <img 
                  src={icon2}
                  alt="Feature" 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="ml-4 text-left">
                  <h4 className="text-base font-medium text-gray-900">Resource Management</h4>
                  <p className="mt-1 text-sm text-gray-500">Track rooms and equipment</p>
                </div>
              </div>

              <div className="flex items-center">
                <img 
                  src={icon3} 
                  alt="Feature" 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="ml-4 text-left">
                  <h4 className="text-base font-medium text-gray-900">Notification System</h4>
                  <p className="mt-1 text-sm text-gray-500">Real-time alerts for changes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to simplify your educational scheduling?</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Join thousands of educational institutions already using our platform to manage their schedules efficiently.
          </p>
          <div className="mt-8">
            <Link to="/register" className="px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Get Started
              </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}