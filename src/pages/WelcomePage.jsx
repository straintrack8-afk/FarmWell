import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const WelcomePage = () => {
    const navigate = useNavigate();

    const modules = [
        {
            id: 'swine',
            title: 'Swine Module',
            description: 'Identify swine diseases based on clinical signs and age group with high accuracy.',
            icon: '/images/PigWell_Logo.png',
            color: 'blue',
            path: '/swine'
        },
        {
            id: 'poultry',
            title: 'Poultry Module',
            description: 'Advanced diagnostic algorithms for poultry health monitoring and disease identification.',
            icon: '/images/PoultryWell_Logo.png',
            color: 'emerald',
            path: '/poultry'
        }
    ];

    return (
        <div className="portal-container">
            <div className="farmwell-card">
                <div className="logo-section">
                    <img
                        src="/images/FarmWell_Logo.png"
                        alt="FarmWell"
                        className="main-logo"
                    />
                    <p className="text-gray-500 text-lg font-medium opacity-70">
                        Livestock Diagnostic Tools
                    </p>
                </div>

                <div className="module-grid">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            onClick={() => navigate(module.path)}
                            className="module-card group cursor-pointer"
                        >
                            <img
                                src={module.icon}
                                alt={module.title}
                                className="module-icon"
                            />
                            <h2 className="module-title">{module.title}</h2>
                            <p className="module-desc mb-6">
                                {module.description}
                            </p>

                            <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                                Launch Module <ChevronRight className="w-5 h-5 ml-1" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="footer-branding">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-6">
                        Powered By
                    </p>
                    <div className="flex justify-center items-center">
                        <img
                            src="/images/Vaksindo_logo.png"
                            alt="Vaksindo"
                            className="vaksindo-logo"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
