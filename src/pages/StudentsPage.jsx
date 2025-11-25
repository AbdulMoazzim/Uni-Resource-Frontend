import { useState, useEffect, useRef } from "react";
import { 
  Download, 
  BookOpen
} from "lucide-react";
import { checkTokenExpiration } from "../utils/jwt_decode";
import { fetchAPI } from "../utils/fetchAPI";
import html2pdf from 'html2pdf.js';
import { Link } from "react-router-dom";
import {getTimeValue} from "../utils/sortTime"
export default function StudentsPage() {
  
  const decoded = checkTokenExpiration(localStorage.getItem("access_token"));
  const pdfRef = useRef();

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
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState({});
  const [departmentInfo, setdepartmentInfo] = useState({});

  // Fetch schedule data
  useEffect(() => {
    // Replace with your actual API call
    const fetchScheduleData = async () => {
      setLoading(true);
      try {
           fetchAPI(`http://127.0.0.1:5000/api/student/user/${decoded[1].id}`, "GET")
              .then((val) => {
                setStudentInfo(val.student)
                fetchAPI(`http://127.0.0.1:5000/api/schedule/${decoded[1].institution_id}/${decoded[1].department_id}/${val.student.year}/Section ${val.student.section}`, "GET")
                  .then((val) => {
                    console.log(val);
                    setScheduleData(val);
                  })
                  .catch(error => console.error("Error fetching schedule:", error));
              })
              .catch(error => console.error("Error fetching schedule:", error));
           fetchAPI(`http://127.0.0.1:5000/api/department/${decoded[1].department_id}`, "GET")
              .then((val) => {
                setdepartmentInfo(val.department)
              })
              .catch(error => console.error("Error fetching schedule:", error));
            fetchAPI(`http://127.0.0.1:5000/api/time/${decoded[1].institution_id}/${decoded[1].department_id}`, "GET")
              .then((val) => {
                let list = [];
                val.times.forEach(element => {
                  list.push(element.time);
                });
                setTimeSlots(list.sort((a, b) => getTimeValue(a) - getTimeValue(b)));
              })
              .catch(error => console.error("Error fetching schedule:", error));
        
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);
  console.log(studentInfo)
  console.log(scheduleData)
  // Function to get classes for a specific day and time
  const getClassForTimeSlot = (day, time) => {
    if (
      scheduleData[studentInfo.year] &&
      scheduleData[studentInfo.year]["Section "+studentInfo.section] &&
      scheduleData[studentInfo.year]["Section "+studentInfo.section][day] &&
      scheduleData[studentInfo.year]["Section "+studentInfo.section][day][time]
    ) {
      return scheduleData[studentInfo.year]["Section "+studentInfo.section][day][time];
    }
    return null;
  };

  const downloadSchedule = () => {
  console.log("Starting PDF download");
  const element = pdfRef.current;
  
  if (!element) {
    console.error("PDF reference element is null or undefined");
    return;
  }
  
  console.log("PDF reference element found:", element);
  
  // Create a clone of the element to avoid modifying the original
  const clonedElement = element.cloneNode(true);
  
  // Create a header div for the department name
  const headerDiv = document.createElement('div');
  headerDiv.style.textAlign = 'center';
  headerDiv.style.marginBottom = '20px';
  headerDiv.style.padding = '10px';
  
  // Create and style the department name heading
  const departmentHeading = document.createElement('h1');
  departmentHeading.textContent = departmentInfo.name || 'Department Schedule';
  departmentHeading.style.fontSize = '24px';
  departmentHeading.style.fontWeight = 'bold';
  departmentHeading.style.textAlign = 'center';
  departmentHeading.style.margin = '0';
  
  // Append the heading to the header div
  headerDiv.appendChild(departmentHeading);
  
  // If you have student info, add it below the department name
  const studentInfoDiv = document.createElement('div');
  studentInfoDiv.style.textAlign = 'center';
  studentInfoDiv.style.fontSize = '14px';
  studentInfoDiv.style.marginTop = '10px';
  
  studentInfoDiv.textContent = `Year ${studentInfo.year || ''}, Section ${studentInfo.section || ''}`;
  headerDiv.appendChild(studentInfoDiv);
  
  // Insert the header at the beginning of the cloned element
  clonedElement.insertBefore(headerDiv, clonedElement.firstChild);
  
  // Apply a style to override any problematic color functions
  const styleOverride = document.createElement('style');
  styleOverride.textContent = `
    * {
      color: black !important;
      background: white !important;
      border-color: #ccc !important;
    }
    .bg-blue-100 {
      background-color: #dbeafe !important;
      border-left-color: #3b82f6 !important;
    }
    .bg-green-100 {
      background-color: #d1fae5 !important;
      border-left-color: #10b981 !important;
    }
    .border-blue-500 {
      border-color: #3b82f6 !important;
    }
    .border-green-500 {
      border-color: #10b981 !important;
    }
    .text-gray-500, .text-gray-600, .text-gray-300 {
      color: #6b7280 !important;
    }
  `;
  
  // Add the style to our cloned element
  clonedElement.appendChild(styleOverride);
  
  // Define options for better PDF generation
  const options = {
    margin: [20, 10, 10, 10], // top, right, bottom, left
    filename: `${departmentInfo.name || 'Department'}_Schedule.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 1,
      useCORS: true,
      onclone: function(clonedDoc) {
        console.log("Document cloned for PDF generation");
      }
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };
  
  try {
    html2pdf()
      .set(options)
      .from(clonedElement)
      .save()
      .then(() => {
        console.log("PDF generated successfully");
      })
      .catch(error => {
        console.error("Error generating PDF:", error);
      });
  } catch (error) {
    console.error("Exception in html2pdf:", error);
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Beautiful Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="text-white h-8 w-8" />
                <span className="ml-2 text-xl font-bold text-white">EduSchedule</span>
              </div>
            </div>
            <Link to="/Login" className="flex items-center">
            <button className="text-white font-bold" onClick={()=> localStorage.clear()}>Logout</button>
            </Link>
            
          </div>

        </div>

      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">My Class Schedule</h2>
              <div className="mt-2 text-gray-600">
                <p><span className="font-medium">Name:</span> {studentInfo.name}</p>
                <p><span className="font-medium">Student ID:</span> {studentInfo.id}</p>
                <p><span className="font-medium">Department:</span> {departmentInfo.name}</p>
                <p>
                  <span className="font-medium">Year & Section:</span> {studentInfo.year}, Section {studentInfo.section}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button
                onClick={downloadSchedule}
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download size={18} />
                <span>Download</span>
              </button>
            </div>
          </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto print:overflow-visible" ref={pdfRef}>
          <table className="min-w-full bg-white border" >
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
                    {time}
                  </td>
                  {days.map((day) => {
                    const session = getClassForTimeSlot(day, time);
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
                            <p className="font-medium mt-2">{session.subject}</p>
                            <p className="text-sm text-gray-600 mt-2">
                              {session.teacher}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              Room: {session.room}
                            </p>
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center text-gray-300">
                            No Class
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

        {/* Legend */}
        <div className="mt-4 flex gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-l-4 border-green-500 mr-2"></div>
            <span className="text-sm">Lecture</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border-l-4 border-blue-500 mr-2"></div>
            <span className="text-sm">Lab Session</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 rounded-lg shadow mt-6 mb-6 mx-6">
        <div className="p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © 2025 <a href="#" className="hover:underline">EduPortal™</a>. All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 sm:mt-0">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">About</a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">Help</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Contact</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
    </div>
  );
}