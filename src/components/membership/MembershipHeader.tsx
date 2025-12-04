import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const MembershipHeader = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center p-4 bg-white">
            <button onClick={() => navigate(-1)}>
                <FiArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold mx-auto">Membership</h1>
            <div className="w-6"></div>
        </div>
    );
};

export default MembershipHeader;
