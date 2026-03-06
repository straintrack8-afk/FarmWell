import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ isOffline = false, onBack = null }) => {
    const navigate = useNavigate();

    const handleBackToPoultry = () => {
        if (onBack) {
            onBack();
        }
        navigate('/poultry');
    };

    return null;
};

export default Header;
