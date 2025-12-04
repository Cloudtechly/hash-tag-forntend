import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AuctionLoadingPage from './AuctionLoadingPage';
import AuctionInfoPage from './AuctionInfoPage';
import AuctionTermsPage from './AuctionTermsPage';
import AuctionVerificationPage from './AuctionVerificationPage';
import AuctionAllSetPage from './AuctionAllSetPage';

const AuctionFlow: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const steps = ['/auction', '/auction/info'];
        const currentStepIndex = steps.indexOf(location.pathname);

        if (currentStepIndex !== -1 && currentStepIndex < steps.length - 1) {
            const delay = location.pathname === '/auction' ? 3000 : 1500;
            const timer = setTimeout(() => {
                navigate(steps[currentStepIndex + 1]);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [location, navigate]);

    return (
        <Routes>
            <Route path="/" element={<AuctionLoadingPage />} />
            <Route path="/info" element={<AuctionInfoPage onNext={() => navigate('/auction/terms')} />} />
            <Route path="/terms" element={<AuctionTermsPage onNext={() => navigate('/auction/verification')} />} />
            <Route path="/verification" element={<AuctionVerificationPage onNext={() => navigate('/auction/all-set')} />} />
            <Route path="/all-set" element={<AuctionAllSetPage />} />
        </Routes>
    );
};

export default AuctionFlow;
