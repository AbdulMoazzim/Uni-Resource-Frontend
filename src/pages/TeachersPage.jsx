import { useState, useEffect } from "react";
import { fetchAPI } from '../utils/fetchAPI';
import {
  MessageSquare,
  LogOut,
  Menu,
  X,
  Calendar as CalendarIcon,
  ChevronDown,
  AlertTriangle,
  SidebarClose,
  Bell,
  Check,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { checkTokenExpiration } from "../utils/jwt_decode";
import {getTimeValue} from "../utils/sortTime"

function TeachersPage() {
  const decoded = checkTokenExpiration(localStorage.getItem("access_token"))
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState([]);
  const [scheduleData, setScheduleData] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  // State for message modal
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("1st Year");
  const [selectedSection, setSelectedSection] = useState("Section A");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [requestType, setRequestType] = useState("reschedule");
  const [preferredDay, setPreferredDay] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [teacherData, setTeacherData] = useState({});
  const [departmentInfo, setdepartmentInfo] = useState({});
  
  // State for notification panel
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // Fetch schedule data
  useEffect(() => {
    // Replace with your actual API call
    const fetchScheduleData = async () => {
      
        fetchAPI(`https://uni-resource.onrender.com/api/teacher/user/${decoded[1].id}`, "GET")
          .then((val) => {
            setTeacherData(val.teacher)
            fetchAPI(`https://uni-resource.onrender.com/api/schedule/${decoded[1].institution_id}/${decoded[1].department_id}/${val.teacher.name}`, "GET")
              .then((val) => {
                setScheduleData(val);
              })
              .catch(error => console.error("Error fetching schedule:", error));

            fetchAPI(`https://uni-resource.onrender.com/api/notification/${decoded[1].institution_id}/${decoded[1].department_id}/${val.teacher.id}`, "GET")
          .then((val) => {
            console.log(val)
            setNotification(val.notifications);

            const unreadCount = val.notifications.filter(notif => !notif.acknowledgement).length;
            setUnreadNotificationCount(unreadCount);
          })
          .catch(error => console.error("Error fetching time:", error));

          })
          .catch(error => console.error("Error fetching teacher:", error));
        fetchAPI(`https://uni-resource.onrender.com/api/department/${decoded[1].department_id}`, "GET")
          .then((val) => {
            setdepartmentInfo(val.department)
          })
          .catch(error => console.error("Error fetching department:", error));
        fetchAPI(`https://uni-resource.onrender.com/api/time/${decoded[1].institution_id}/${decoded[1].department_id}`, "GET")
          .then((val) => {
            let list = [];
            val.times.forEach(element => {
              list.push(element.time);
            });
            setTimeSlots(list.sort((a, b) => getTimeValue(a) - getTimeValue(b)));
          })
          .catch(error => console.error("Error fetching time:", error));

    
    
    };

    fetchScheduleData();
  }, []);
  
  // Function to handle acknowledging a notification
  const acknowledgeNotification = (notificationId) => {
    fetchAPI(`https://uni-resource.onrender.com/api/notification/update/${notificationId}`, "PUT", {})
      .then(() => {
        // Update the notification list with the acknowledged status
        const updatedNotifications = notification.map(notif => 
          notif.id === notificationId ? { ...notif, acknowledgement: true } : notif
        );
        setNotification(updatedNotifications);
        
        // Update unread count
        const unreadCount = updatedNotifications.filter(notif => !notif.acknowledgement).length;
        setUnreadNotificationCount(unreadCount);
      })
      .catch(error => console.error("Error acknowledging notification:", error));
  };

  // Function to send schedule change request - would be replaced with actual API call
  const sendScheduleChangeRequest = (e) => {
    e.preventDefault();
    
    // Create the request object
    const request = {
      teacherId: teacherData.id,
      teacherName: teacherData.name,
      subject: selectedSubject,
      currentDay: selectedDay,
      currentTime: selectedTime,
      requestType: requestType,
      preferredDay: preferredDay,
      preferredTime: preferredTime,
      message: messageContent,
      status: "pending",
      timestamp: new Date().toISOString(),
      response: ""
    };
    
    fetchAPI(`https://uni-resource.onrender.com/api/notification/register/${decoded[1].institution_id}/${decoded[1].department_id}`, "POST", request)
              .then((val) => {
                console.log(val)
                alert("Successful")
                  })
                  .catch(error => console.error("Error fetching schedule:", error));

    
    // Close the modal and reset the form
    setIsMessageModalOpen(false);
    resetMessageForm();
  };

  const resetMessageForm = () => {
    setMessageSubject("");
    setMessageContent("");
    setSelectedDay("");
    setSelectedTime("");
    setSelectedSubject("");
    setRequestType("reschedule");
    setPreferredDay("");
    setPreferredTime("");
  };

  // Open message modal with pre-filled class info
  const openMessageModal = (day, time, classInfo) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setSelectedSubject(classInfo.subject);
    setMessageSubject(`Request to change ${classInfo.subject} schedule`);
    setIsMessageModalOpen(true);
  };

  const getCurrentScheduleData = () => {
    if (!scheduleData[selectedYear]) return {};
    if (!scheduleData[selectedYear][selectedSection]) return {};
    return scheduleData[selectedYear][selectedSection];
  };
  
  // Get current section data based on selected year and section
  const currentScheduleData = getCurrentScheduleData();

  // Format notification date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (mobile responsive) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto`}
      >
        <div className="p-4 border-b border-blue-800">
          <div className="flex items-center justify-between space-x-4">
            <div>
              <h2 className="font-medium">{teacherData.name}</h2>
              <p className="text-sm text-blue-200">{departmentInfo.name}</p>
            </div>
            <div onClick={()=>{setIsSidebarOpen(false)}} className="md:hidden">
          <SidebarClose />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
            <Link to="/Login">
          <button className="flex items-center text-sm hover:bg-blue-800 w-full py-2 px-4 rounded-lg" onClick={()=> localStorage.clear()}>
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="block md:hidden mr-4"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold">Teacher Schedule</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Bell size={20} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex flex-wrap items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My Weekly Schedule</h2>

              <div className="flex justify-between items-center">
                <div className="flex items-center mt-2 px-4">
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

            <div className="flex items-center mt-2  px-4">
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
              </div>
            </div>



            {/* Schedule Table */}
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
                      <td className="py-3 px-4 border font-medium">{time}</td>
                      {days.map((day) => {
                        // Safely access the session data
                        const session = currentScheduleData[day]?.[time];
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
                                <p className="font-medium">{session.subject}</p>
                                <p className="text-sm text-gray-600">
                                  Room: {session.room}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {selectedYear}, {selectedSection}
                                </p>
                                <div className="mt-1 flex gap-1">
                                  <button
                                    onClick={() => openMessageModal(day, time, session)}
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                  >
                                    <MessageSquare size={12} className="mr-1" /> Request Change
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full min-h-10 flex items-center justify-center text-gray-300">
                                -
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>

      {/* Notification Panel */}
      {isNotificationPanelOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Notifications</h3>
            <button
              onClick={() => setIsNotificationPanelOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto h-full pb-20">
            {notification.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No notifications yet</p>
              </div>
            ) : (
              notification.filter((notif)=> {
                return !notif.acknowledgement
              }).map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 border-b ${!notif.acknowledged ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start mb-2">
                    {notif.status === "approved" ? (
                      <CheckCircle size={18} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    ) : notif.status === "rejected" ? (
                      <XCircle size={18} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                    ) : (
                      <AlertTriangle size={18} className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        {notif.requestType.charAt(0).toUpperCase() + notif.requestType.slice(1)}{" "}
                        Request {notif.status.charAt(0).toUpperCase() + notif.status.slice(1)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {notif.subject} on {notif.currentDay} at {notif.currentTime}
                      </p>
                      {notif.status !== "pending" && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <p className="font-medium">Response:</p>
                          <p>{notif.response || "No additional comments."}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">{formatDate(notif.timestamp)}</p>
                    </div>
                  </div>
                  
                  {
                  (notif.status === "Approved" || notif.status === "Rejected") && !notif.acknowledgement && (
                    <button
                      onClick={() => acknowledgeNotification(notif.id)}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <Check size={14} className="mr-1" /> Acknowledge
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Request Schedule Change</h3>
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={sendScheduleChangeRequest} className="p-4">
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <h4 className="font-medium text-blue-800">Selected Class</h4>
                  <p className="text-sm">
                    <span className="font-medium">{selectedSubject}</span> on{" "}
                    <span className="font-medium">{selectedDay}</span> at{" "}
                    <span className="font-medium">{selectedTime}</span>
                  </p>
                </div>

                {/* Request Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Request Type
                  </label>
                  <div className="relative">
                    <select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="reschedule">Reschedule Class</option>
                      <option value="substitute">Request Substitute</option>
                      <option value="cancel">Cancel Class</option>
                      <option value="room">Change Room</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Preferred Schedule (only for reschedule) */}
                {requestType === "reschedule" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Day
                      </label>
                      <div className="relative">
                        <select
                          value={preferredDay}
                          onChange={(e) => setPreferredDay(e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                          <option value="">Select day</option>
                          {days.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Time
                      </label>
                      <div className="relative">
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Details
                  </label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    placeholder="Please provide additional details about your request..."
                  ></textarea>
                </div>

                <div className="bg-yellow-50 p-3 rounded flex items-start gap-2">
                  <AlertTriangle size={18} className="text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    Your request will be sent to the Department Head for approval. You'll be notified once they review it.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeachersPage;