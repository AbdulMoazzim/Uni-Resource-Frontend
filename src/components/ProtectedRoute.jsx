import React, { useEffect, useState } from 'react';
import { checkTokenExpiration } from '../utils/jwt_decode';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ role, children }) {
    const navigate = useNavigate();
    const [authorized, setAuthorized] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const decoded = checkTokenExpiration(token);

        if (decoded[0] || decoded[1].role !== role) {
            navigate("/login");
        } else {
            setAuthorized(true);
        }
    }, [navigate, role]);

    if (authorized) {
        return <>{children}</>;
    }

    return null; // Or a loading spinner if desired
}
