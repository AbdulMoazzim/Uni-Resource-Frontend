import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from '../utils/jwt_decode';

export default function HomePageAuthRoute({children, condition}) {
    let navigate = useNavigate();
    let token = localStorage.getItem("access_token");
    let decoded = checkTokenExpiration(token);
    useEffect(()=>{
        if (decoded[0]) return navigate("");
        if (decoded[1].role === "admin") return navigate("/institutionAdminPage");
        if (decoded[1].role === "superAdmin") return navigate("/superAdmin");
        if (decoded[1].role === "DeptHead") return navigate("/deptHead");
        if (decoded[1].role === "Teacher") return navigate("/teachersPage");
        if (decoded[1].role === "Student") return navigate("/studentsPage");
    })
    if (!token) return (<>{children}</>)



  
}
