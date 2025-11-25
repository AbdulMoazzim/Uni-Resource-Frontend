import { useState, Fragment, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Filter,
  LogOut,
  Menu,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { X, User, Building, BookOpen } from "lucide-react";
import { fetchAPI } from "../utils/fetchAPI";
import { checkTokenExpiration } from "../utils/jwt_decode";
import { useNavigate } from "react-router-dom";
import {getTimeValue} from "../utils/sortTime"

// Main App Component
export default function DepartmentHeadDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-blue-800 text-white ${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <h2 className="text-xl font-bold">Edu Portal</h2>
          ) : (
            <h2 className="text-xl font-bold">EP</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white p-1 rounded hover:bg-blue-700"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="mt-8 flex flex-col flex-1">
          <NavItem
            icon={<Calendar size={20} />}
            label="Dashboard"
            isActive={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Students"
            isActive={activeTab === "students"}
            onClick={() => setActiveTab("students")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<Clock size={20} />}
            label="Schedule"
            isActive={activeTab === "schedule"}
            onClick={() => setActiveTab("schedule")}
            sidebarOpen={sidebarOpen}
          />
        </div>

        <div className="mt-auto mb-4">
          <NavItem
            icon={<LogOut size={20} />}
            label="Logout"
            isActive={false}
            onClick={() => {
              navigate("/login");
              localStorage.clear()
            }}
            sidebarOpen={sidebarOpen}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-scroll">
        <header className="bg-white px-4 py-8 shadow">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {activeTab === "dashboard" && "Department Head Dashboard"}
              {activeTab === "students" && "Student Management"}
              {activeTab === "schedule" && "Schedule Management"}
            </h1>
          </div>
        </header>

        <main className="p-6">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "students" && <StudentsContent />}
          {activeTab === "schedule" && <ScheduleContent />}
        </main>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, label, isActive, onClick, sidebarOpen }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center p-3 my-1 ${
        isActive ? "bg-blue-700 font-medium" : "hover:bg-blue-700"
      } rounded-lg transition mx-2`}
    >
      <span className="mr-3">{icon}</span>
      {sidebarOpen && <span>{label}</span>}
    </button>
  );
}

// Dashboard Content
function DashboardContent() {
  const [expandedRequest, setExpandedRequest] = useState(null);
  const decoded = checkTokenExpiration(localStorage.getItem("access_token"));
  const [changeRequests, setChangeRequests] = useState([]);
  const [res, setRes] = useState("")

  useEffect(() => {
    fetchAPI(
      `http://127.0.0.1:5000/api/notification/pending/${decoded[1].institution_id}/${decoded[1].department_id}`,
      "GET"
    ).then((data) => {
      setChangeRequests(data.pending_schedules);
    });
  }, []);

console.log(changeRequests)
  const toggleRequest = (id) => {
    if (expandedRequest === id) {
      setExpandedRequest(null);
    } else {
      setExpandedRequest(id);
    }
  };

  const handleUpdateRequest = (id, status)=> {
    console.log(status)
    console.log(res)
    fetchAPI(
      `http://127.0.0.1:5000/api/notification/update/deptHead/${id}`,
      "PUT", {
        response: res,
        status
      }
    ).then((data) => {
      console.log(data)
      setChangeRequests((prevState)=> {
        prevState.filter((s)=> {
          return s.id === id
        })
      })

    });
  }

  return (
    <div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4 flex-wrap">
          <h2 className="text-lg font-semibold">Period Change Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              
              {changeRequests && changeRequests.map((request) => (
                <Fragment key={request.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{request.teacherName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{request.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="text-orange-500 font-medium"
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleRequest(request.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {expandedRequest === request.id ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRequest === request.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex justify-between items-center flex-wrap">
                            <div>
                            <p className="text-sm font-medium text-gray-500">
                              Current Day
                            </p>
                            <p className="text-sm">{request.currentDay}</p>

                            </div>
                            <div className="px-4"> 
                            <p className="text-sm font-medium text-gray-500">
                              Current Time
                            </p>
                            <p className="text-sm">{request.currentTime}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center flex-wrap">
                            <div>
                            <p className="text-sm font-medium text-gray-500">
                              Preferred Day
                            </p>
                            <p className="text-sm">{request.preferredDay}</p>

                            </div>
                            <div className="px-4"> 
                            <p className="text-sm font-medium text-gray-500">
                              Preferred Time
                            </p>
                            <p className="text-sm">{request.preferredTime}</p>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">
                              Reason
                            </p>
                            <p className="text-sm">{request.message}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center flex-wrap mt-4">

                          <div className=" flex justify-between items-center flex-wrap mb-4">
                          <label htmlFor="response">Message for Teacher</label>
                          <input type="text" value={res} name="response" onChange={(e)=> setRes(e.target.value)} className="border-1 border-black rounded mx-4"/>
                          </div>
                        <div className="flex justify-end items-center space-x-2 mb-4">
                          <button className="bg-green-500 text-white px-3 py-1 rounded text-sm" onClick={()=> {
                            handleUpdateRequest(request.id, "Approved")
                          }}>
                            Approve
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded text-sm" onClick={()=> {
                            handleUpdateRequest(request.id, "Rejected")
                          }}>
                            Reject
                          </button >
                        </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Students Management Content
function StudentsContent() {
  const decoded = checkTokenExpiration(localStorage.getItem("access_token"));
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    year: "",
    section: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const [selectedYear, setSelectedYear] = useState("1st Year");
  const [selectedSection, setSelectedSection] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchAPI(
      `http://127.0.0.1:5000/api/student/${decoded[1].institution_id}`,
      "GET"
    ).then((data) => {
      console.log(data)
      setStudents(data.students);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const deleteUser = (id) => {
    fetchAPI(`http://127.0.0.1:5000/api/user/${id}`, 'DELETE').catch(error => {
      console.error('Error fetching:', error);
    });
    setStudents(students.filter((student)=> student.id !== id))
    };

  const handleDeleteRequest = (id) => {
    fetchAPI(`http://127.0.0.1:5000/api/student/${id}`, "DELETE")
      .then(() => {
        setStudents((students) =>
          students.filter((student) => student.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error fetching institutions:", error);
      });
  };

  const handleSubmit = async () => {
  fetchAPI("http://127.0.0.1:5000/api/user/register", "POST", {
    ...formData,
    department_id: decoded[1].department_id,
    institution_id: decoded[1].institution_id,
    role: "Student",
  }).then((data) => {
    fetchAPI("http://127.0.0.1:5000/api/student", "POST", {
      ...formData,
      department_id: decoded[1].department_id,
      institution_id: decoded[1].institution_id,
      user_id: data.user.id,
    }).then((data) => {
      // 👇 Update the students list immediately
      setStudents((prev) => [
        ...prev,
        {
          id: data.studentData.id,
          name: data.studentData.name,
          email: data.studentData.email,
          year: data.studentData.year,
          section: data.studentData.section,
          user_id: data.studentData.user_id
        },
      ]);

      // 👇 Reset form
      setFormData({
        full_name: "",
        email: "",
        password: "",
        year: "",
        section: "",
      });
      setShowAddForm(false);
    });
  });
};

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Student Management</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>

        {showAddForm && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">Add New Student</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Section</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Year:</span>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none bg-gray-100 py-2 pl-3 pr-8 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Section:</span>
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="appearance-none bg-gray-100 py-2 pl-3 pr-8 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center ml-auto">
            <button className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-2 rounded">
              <Filter size={16} />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students
                .filter((s) => !selectedYear || s.year.includes(selectedYear))
                .filter(
                  (s) => !selectedSection || s.section.includes(selectedSection)
                )
                .map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 whitespace-nowrap">
                      {student.id}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {student.year}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      Section {student.section}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {student.email}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => {
                            handleDeleteRequest(student.id);
                            deleteUser(student.user_id)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


function ScheduleContent() {
  let decoded = checkTokenExpiration(localStorage.getItem("access_token"));
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlotsWithoutID, setTimeSlotsWithoutID] = useState([]);
  const [selectedYear, setSelectedYear] = useState("1st Year");
  const [selectedSection, setSelectedSection] = useState("Section A");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeManagementModalOpen, setTimeManagementModalOpen] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState("");

  // Available teachers list
  const [teachersInfo, setTeachersInfo] = useState([]);
  const [names, setNames] = useState([]);

  // State for schedule data from API
  const [scheduleData, setScheduleData] = useState({
    "1st Year": { "Section A": {}, "Section B": {}, "Section C": {} },
      "2nd Year": { "Section A": {}, "Section B": {}, "Section C": {} },
      "3rd Year": { "Section A": {}, "Section B": {}, "Section C": {} },
      "4th Year": { "Section A": {}, "Section B": {}, "Section C": {} }
  });

  // Fetch teachers and schedule data
  useEffect(() => {
    // Fetch teachers
    fetchAPI(`http://127.0.0.1:5000/api/teacher/${decoded[1].institution_id}`, "GET")
      .then((val) => {
        setTeachersInfo(val.teachers)
        setNames(val.teachers.map((teacher) => teacher.name));
      })
      .catch(error => console.error("Error fetching teachers:", error));
    
    // Fetch schedule data
    fetchAPI(`http://127.0.0.1:5000/api/schedule/${decoded[1].institution_id}/${decoded[1].department_id}`, "GET")
      .then((val) => {
        setScheduleData(val);
      })
      .catch(error => console.error("Error fetching schedule:", error));
    fetchAPI(`http://127.0.0.1:5000/api/time/${decoded[1].institution_id}/${decoded[1].department_id}`, "GET")
      .then((val) => {
        let list1 = [];
        let list2 = [];
        val.times.forEach(element => {
          list1.push([element.id, element.time]);
          list2.push(element.time);
        });

        setTimeSlots(list1.sort((a, b) => getTimeValue(a[1]) - getTimeValue(b[1])));
        setTimeSlotsWithoutID(list2.sort((a, b) => getTimeValue(a) - getTimeValue(b)));
      })
      .catch(error => console.error("Error fetching schedule:", error));
  }, []);


  // Function to check if a teacher is available at the specified time slot
  const isTeacherAvailable = (teacherToCheck, dayToCheck, timeToCheck) => {
    // Skip the check if we're editing the same slot
    if (
      selectedDay === dayToCheck && 
      selectedTime === timeToCheck && 
      scheduleData[selectedYear]?.[selectedSection]?.[selectedDay]?.[selectedTime]?.teacher === teacherToCheck
    ) {
      return true;
    }

    // Check all years and sections for the given day and time
    for (const year in scheduleData) {
      for (const section in scheduleData[year]) {
        if (scheduleData[year][section][dayToCheck]?.[timeToCheck]?.teacher === teacherToCheck) {
          return false; // Teacher already booked
        }
      }
    }
    return true; // Teacher is available
  };

  const postSchedule = (year, section) => {
    if (!year || !section) {
      alert("Please select a year, section, and day to post.");
      return;
    }

    const daySchedule = scheduleData[year]?.[section];
    if (!daySchedule || Object.keys(daySchedule).length === 0) {
      alert("No classes to post for this day.");
      return;
    }

    fetchAPI(`http://127.0.0.1:5000/api/schedule/${year}/${section}`, "POST", daySchedule)
      .then((data) => {
        alert("Schedule successfully posted!");
      })
      .catch((e) => {
        console.error("Error posting schedule:", e);
        alert("Failed to post schedule. Please try again.");
      });
    };



  // Function to check if a room is available at the specified time slot
  const isRoomAvailable = (roomToCheck, dayToCheck, timeToCheck) => {
    // Skip the check if we're editing the same slot
    if (
      selectedDay === dayToCheck && 
      selectedTime === timeToCheck && 
      scheduleData[selectedYear]?.[selectedSection]?.[selectedDay]?.[selectedTime]?.room === roomToCheck
    ) {
      return true;
    }

    // Check all years and sections for the given day and time
    for (const year in scheduleData) {
      for (const section in scheduleData[year]) {
        if (scheduleData[year][section][dayToCheck]?.[timeToCheck]?.room === roomToCheck) {
          return false; // Room already booked
        }
      }
    }
    return true; // Room is available
  };

  // Function to get available teachers for a specific day and time
  const getAvailableTeachers = (dayToCheck, timeToCheck) => {
    // If we're editing, include the current teacher in the available list
    const currentTeacher = scheduleData[selectedYear]?.[selectedSection]?.[dayToCheck]?.[timeToCheck]?.teacher;
    
    return names.filter(teacher => {
      if (currentTeacher === teacher) {
        return true; // Include current teacher when editing
      }
      return isTeacherAvailable(teacher, dayToCheck, timeToCheck);
    });
  };

 const addTimeSlot = () => {
  if (!newTimeSlot) {
    alert("Please enter a valid time slot");
    return;
  }

  // Check if time slot already exists
  if (timeSlots.includes(newTimeSlot)) {
    alert("Time slot already exists");
    return;
  }

  const updatedTimeSlots = [...timeSlotsWithoutID, newTimeSlot];

  // Sort based on time
  updatedTimeSlots.sort((a, b) => getTimeValue(a) - getTimeValue(b));
  setTimeSlotsWithoutID(updatedTimeSlots);
  setNewTimeSlot("");
};
  const [timeID, setTimeId] = useState(null);
  const openAddModal = (day = "", time = "", time_ID) => {
    setSelectedDay(day);
    setSelectedTime(time);
    if (time_ID) setTimeId(time_ID);
    resetFormFields();
    
    // If day and time are provided, reset the teacher dropdown to only show available teachers
    if (day && time) {
      // Set default teacher to empty to force selection of available teacher
      setTeacherName("");
    }
    
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetFormFields();
  };
  const publishTimeSlot = () => {
    fetchAPI(`http://127.0.0.1:5000/api/time/${decoded[1].institution_id}/${decoded[1].department_id}`, "POST", timeSlotsWithoutID)
      .then((data) => {
        const filterData = data.time.filter((d)=> {return [d.id, d.time]})
        setTimeSlots( [...timeSlots, [filterData[0].id, filterData[0].time]].sort((a, b) => {
          return getTimeValue(a[1]) - getTimeValue(b[1]
          )}))})
      .catch((e) => {
        console.error("Error posting schedule:", e);
        alert("Failed to post schedule. Please try again.");
      });
  }
  const DeleteTimeSlot = (id,name) => {
  fetchAPI(`http://127.0.0.1:5000/api/time/${id}`, "DELETE")
    .then(() => {
      setTimeSlots((prevState) => prevState.filter((p) => p[0] !== id));
      setTimeSlotsWithoutID((prevState) => prevState.filter((p) => p !== name));
    })
    .catch((e) => {
      console.error("Error deleting time:", e);
      alert("Failed to delete time. Please try again.");
    });

  fetchAPI(`http://127.0.0.1:5000/api/timeSlot/${id}`, "DELETE")
    .then(() => {
      const time = timeSlots.find((t) => t[0] === id); // Use `find` instead of `filter`
      if (!time) return;

      const timeKey = time[1]; // Assuming this is the time identifier

      setScheduleData((prevState) => {
        const newState = { ...prevState };
        if (
          newState[selectedYear] &&
          newState[selectedYear][selectedSection] &&
          newState[selectedYear][selectedSection][selectedDay]
        ) {
          newState[selectedYear][selectedSection][selectedDay][timeKey] = {};
        }
        return newState;
      });
    })
    .catch((e) => {
      console.error("Error deleting timeSlot:", e);
      alert("Failed to delete time slot. Please try again.");
    });
};

  // Form states
  const [subjectName, setSubjectName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [classType, setClassType] = useState("lecture");

  const resetFormFields = () => {
    setSubjectName("");
    setTeacherName("");
    setRoomNumber("");
    setClassType("lecture");
  };

  const handleEditClass = (day, time) => {
    const classData = scheduleData[selectedYear][selectedSection][day][time];
    if (classData) {
      setSubjectName(classData.subject);
      setTeacherName(classData.teacher);
      setRoomNumber(classData.room);
      setClassType(classData.type);
      setSelectedDay(day);
      setSelectedTime(time);
      setModalOpen(true);
    }
  };

  const handleRemoveClass = (day, time) => {
    if (window.confirm("Are you sure you want to remove this class?")) {
      setScheduleData((prevData) => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        delete updatedData[selectedYear][selectedSection][day][time];
        return updatedData;
      });
    }
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!subjectName || !teacherName || !roomNumber || !selectedDay || !selectedTime) {
      alert("Please fill in all fields");
      return;
    }

    // Check if teacher is already booked at this time
    if (!isTeacherAvailable(teacherName, selectedDay, selectedTime)) {
      alert(`Teacher ${teacherName} is already booked at this time on ${selectedDay}`);
      return;
    }

    // Check if room is already booked at this time
    if (!isRoomAvailable(roomNumber, selectedDay, selectedTime)) {
      alert(`Room ${roomNumber} is already booked at this time on ${selectedDay}`);
      return;
    }
    const newClass = {
      subject: subjectName,
      teacher: teacherName,
      room: roomNumber,
      type: classType,
      department_id: decoded[1].department_id,
      institution_id: decoded[1].institution_id,
      time_ID: timeID,
      teacher_id: teachersInfo.find((teacher)=> {return teacher.name === teacherName}).id
    };
    setScheduleData((prevData) => {
      const updatedData = JSON.parse(JSON.stringify(prevData));
      
      // Ensure the structure exists
      if (!updatedData[selectedYear]) updatedData[selectedYear] = {};
      if (!updatedData[selectedYear][selectedSection]) updatedData[selectedYear][selectedSection] = {};
      if (!updatedData[selectedYear][selectedSection][selectedDay]) updatedData[selectedYear][selectedSection][selectedDay] = {};
      
      // Add the class
      updatedData[selectedYear][selectedSection][selectedDay][selectedTime] = newClass;
      return updatedData;
    });
    
    closeModal();
  };
  // Safely get current schedule data for selected year and section
  const getCurrentScheduleData = () => {
    if (!scheduleData[selectedYear]) return {};
    if (!scheduleData[selectedYear][selectedSection]) return {};
    return scheduleData[selectedYear][selectedSection];
  };
  
  // Get current section data based on selected year and section
  const currentScheduleData = getCurrentScheduleData();
  // Get available teachers for the selected day and time
  const availableTeachers = selectedDay && selectedTime 
    ? getAvailableTeachers(selectedDay, selectedTime) 
    : names;

  return (
    <div className="relative">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Schedule Management</h2>

          <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Year:</span>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none bg-gray-100 py-2 pl-3 pr-8 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Section:</span>
              <div className="relative">
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="appearance-none bg-gray-100 py-2 pl-3 pr-8 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Section A</option>
                  <option>Section B</option>
                  <option>Section C</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            <button
              onClick={() => openAddModal()}
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              <span>Add Class</span>
            </button>

            <button
              onClick={() => setTimeManagementModalOpen(true)}
              className="flex items-center gap-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <Clock size={18} />
              <span>Manage Time Slots</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="py-3 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time}>
                  <td className="py-3 px-4 border font-medium">
                    <span>{time[1]}</span>
                    <button
                        onClick={() => DeleteTimeSlot(time[0], time[1])}
                        className="text-red-600 hover:text-red-800 px-6"
                      >
                        <Trash2 size={16} />
                      </button>
                  </td>
                  {days.map((day) => {
                    // Safely access the session data
                    const session = currentScheduleData[day]?.[time[1]];
                    return (
                      <td key={`${day}-${time}`} className="py-2 px-3 border">
                        {session ? (
                          <div
                            className={`p-2 rounded ${
                              session.type === "lab"
                                ? "bg-blue-100 border-l-4 border-blue-500"
                                : "bg-green-100 border-l-4 border-green-500"
                            }`}
                          >
                            <p className="font-medium">{session.subject || "No Subject"}</p>
                            <p className="text-sm text-gray-600">
                              {session.teacher || "No Teacher"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Room: {session.room || "No Room"}
                            </p>
                            <div className="mt-1 flex gap-1">
                              <button 
                                onClick={() => handleEditClass(day, time[1])}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleRemoveClass(day, time[1])}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => openAddModal(day, time[1], time[0])}
                            className="w-full h-full min-h-10 flex items-center justify-center text-gray-400 hover:bg-gray-50"
                          >
                            <Plus size={18} />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end p-6">
            <button 
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" 
              onClick={() => postSchedule(selectedYear, selectedSection)}
            >
              Post Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Class Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">
                {scheduleData[selectedYear]?.[selectedSection]?.[selectedDay]?.[selectedTime] 
                  ? "Edit Class" 
                  : "Add New Class"}{" "}
                {selectedDay && selectedTime
                  ? `(${selectedDay} at ${selectedTime})`
                  : ""}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="p-4">
              <div className="space-y-4">
                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>Subject</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Mathematics"
                  />
                </div>

                {/* Teacher Field - Changed to only show available teachers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>Teacher {selectedDay && selectedTime ? "(Only showing available teachers)" : ""}</span>
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      disabled={availableTeachers.length === 0}
                    >
                      <option value="">Select teacher</option>
                      {availableTeachers.map((teacher) => (
                        <option key={teacher} value={teacher}>
                          {teacher}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                  {selectedDay && selectedTime && availableTeachers.length === 0 && (
                    <p className="text-red-500 text-sm mt-1">
                      No teachers available at this time. All are already scheduled.
                    </p>
                  )}
                </div>

                {/* Room Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Building size={16} />
                      <span>Room</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 101 or Lab 2"
                  />
                </div>

                {/* Class Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Type
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="lecture"
                        name="classType"
                        value="lecture"
                        checked={classType === "lecture"}
                        onChange={(e) => setClassType(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor="lecture">Lecture</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="lab"
                        name="classType"
                        value="lab"
                        checked={classType === "lab"}
                        onChange={(e) => setClassType(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor="lab">Lab</label>
                    </div>
                  </div>
                </div>

                {/* Day & Time Selectors (only if not pre-selected) */}
                {(!selectedDay || !selectedTime) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Day</span>
                        </div>
                      </label>
                      <select
                        value={selectedDay}
                        onChange={(e) => {
                          setSelectedDay(e.target.value);
                          // Reset teacher on day change to ensure only available teachers are shown
                          if (selectedTime) {
                            setTeacherName("");
                          }
                        }}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select day</option>
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>Time</span>
                        </div>
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => {
                          setSelectedTime(e.target.value);
                          // Reset teacher on time change to ensure only available teachers are shown
                          if (selectedDay) {
                            setTeacherName("");
                          }
                        }}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time[0]} value={time[1]}>
                            {time[1]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={selectedDay && selectedTime && availableTeachers.length === 0}
                  onClick={()=> {
                    const tID = timeSlots.filter((t)=> t[1] === selectedTime)
                    setTimeId(tID[0][0])
                  }}
                >
                  {scheduleData[selectedYear]?.[selectedSection]?.[selectedDay]?.[selectedTime] 
                    ? "Update Class" 
                    : "Add Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Time Slot Management Modal */}
      {timeManagementModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Manage Time Slots</h3>
              <button
                onClick={() => setTimeManagementModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add New Time Slot
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 flex gap-2">
                    <select
                      className="w-16 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        const hour = e.target.value;
                        const minutes =
                          newTimeSlot.split(":")[1]?.split(" ")[0] || "00";
                        const meridiem = newTimeSlot.split(" ")[1] || "AM";
                        setNewTimeSlot(`${hour}:${minutes} ${meridiem}`);
                      }}
                      value={newTimeSlot.split(":")[0] || ""}
                    >
                      <option value="">Hour</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <select
                      className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        const hour = newTimeSlot.split(":")[0] || "12";
                        const meridiem = newTimeSlot.split(" ")[1] || "AM";
                        setNewTimeSlot(`${hour}:${e.target.value} ${meridiem}`);
                      }}
                      value={newTimeSlot.split(":")[1]?.split(" ")[0] || ""}
                    >
                      <option value="">Min</option>
                      {["00", "15", "30", "45"].map((min) => (
                        <option key={min} value={min}>
                          {min}
                        </option>
                      ))}
                    </select>
                    <select
                      className="w-16 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        const [timePart] = newTimeSlot.split(" ");
                        setNewTimeSlot(
                          `${timePart || "12:00"} ${e.target.value}`
                        );
                      }}
                      value={newTimeSlot.split(" ")[1] || ""}
                    >
                      <option value="">AM/PM</option>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  <button
                    onClick={addTimeSlot}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Current Time Slots
                </h4>
                <ul className="divide-y border rounded overflow-hidden">
                  {timeSlotsWithoutID.map((time) => (
                    (<li
                      key={time}
                      className="flex justify-between items-center p-3 hover:bg-gray-50"
                    >
                      <span>{time}</span>
                    
                    </li>)
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {setTimeManagementModalOpen(false)
                    publishTimeSlot();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}