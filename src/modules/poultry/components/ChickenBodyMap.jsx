/**
 * ChickenBodyMap Component
 * Interactive SVG chicken diagram with clickable body regions
 */

import React from 'react';
import './ChickenBodyMap.css';

const ChickenBodyMap = ({ selectedParts = [], onPartClick }) => {
  const isSelected = (partId) => selectedParts.includes(partId);

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  return (
    <div className="chicken-body-map">
      <svg 
        viewBox="0 0 400 500" 
        xmlns="http://www.w3.org/2000/svg"
        className="chicken-svg"
      >
        {/* Background chicken silhouette */}
        <g id="chicken-base" opacity="0.3">
          <ellipse cx="200" cy="200" rx="80" ry="100" fill="#333" />
          <ellipse cx="200" cy="120" rx="40" ry="50" fill="#333" />
          <path d="M 180 300 L 170 400 L 180 420 L 190 400 Z" fill="#333" />
          <path d="M 220 300 L 230 400 L 220 420 L 210 400 Z" fill="#333" />
          <path d="M 240 180 L 280 200 L 240 210 Z" fill="#333" />
          <path d="M 160 180 L 120 200 L 160 210 Z" fill="#333" />
        </g>

        {/* Interactive Regions */}
        
        {/* 1. Head & Respiratory */}
        <g 
          id="head-respiratory" 
          className={`body-part ${isSelected('respiratory') ? 'selected' : ''}`}
          onClick={() => handlePartClick('respiratory')}
          style={{ cursor: 'pointer' }}
        >
          <ellipse cx="200" cy="120" rx="45" ry="55" fill="currentColor" opacity="0.6" />
          <text x="200" y="80" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">
            Head
          </text>
        </g>

        {/* 2. Digestive System */}
        <g 
          id="digestive" 
          className={`body-part ${isSelected('digestive') ? 'selected' : ''}`}
          onClick={() => handlePartClick('digestive')}
          style={{ cursor: 'pointer' }}
        >
          <ellipse cx="200" cy="220" rx="60" ry="70" fill="currentColor" opacity="0.6" />
          <text x="200" y="220" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">
            Digestive
          </text>
        </g>

        {/* 3. Nervous System (overlay on head/body) */}
        <g 
          id="nervous" 
          className={`body-part ${isSelected('nervous') ? 'selected' : ''}`}
          onClick={() => handlePartClick('nervous')}
          style={{ cursor: 'pointer' }}
        >
          <path 
            d="M 200 100 L 200 280" 
            stroke="currentColor" 
            strokeWidth="20" 
            fill="none" 
            opacity="0.6"
          />
          <text x="150" y="190" fontSize="12" fill="#fff" fontWeight="bold">
            Nervous
          </text>
        </g>

        {/* 4. Musculoskeletal (legs) */}
        <g 
          id="musculoskeletal" 
          className={`body-part ${isSelected('musculoskeletal') ? 'selected' : ''}`}
          onClick={() => handlePartClick('musculoskeletal')}
          style={{ cursor: 'pointer' }}
        >
          <rect x="160" y="300" width="30" height="120" rx="5" fill="currentColor" opacity="0.6" />
          <rect x="210" y="300" width="30" height="120" rx="5" fill="currentColor" opacity="0.6" />
          <text x="200" y="360" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">
            Legs
          </text>
        </g>

        {/* 5. Integumentary (skin/feathers - outer layer) */}
        <g 
          id="integumentary" 
          className={`body-part ${isSelected('integumentary') ? 'selected' : ''}`}
          onClick={() => handlePartClick('integumentary')}
          style={{ cursor: 'pointer' }}
        >
          <ellipse cx="200" cy="200" rx="85" ry="105" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.6" />
          <text x="280" y="200" fontSize="12" fill="#fff" fontWeight="bold">
            Skin
          </text>
        </g>

        {/* 6. Reproductive (lower abdomen) */}
        <g 
          id="reproductive" 
          className={`body-part ${isSelected('reproductive') ? 'selected' : ''}`}
          onClick={() => handlePartClick('reproductive')}
          style={{ cursor: 'pointer' }}
        >
          <ellipse cx="200" cy="280" rx="50" ry="40" fill="currentColor" opacity="0.6" />
          <text x="200" y="285" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">
            Reproductive
          </text>
        </g>

        {/* 7. General (whole body - background) */}
        <g 
          id="general" 
          className={`body-part ${isSelected('general') ? 'selected' : ''}`}
          onClick={() => handlePartClick('general')}
          style={{ cursor: 'pointer' }}
        >
          <rect x="10" y="10" width="380" height="480" rx="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.4" strokeDasharray="10,5" />
          <text x="200" y="470" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">
            General / Systemic
          </text>
        </g>
      </svg>

      {/* Legend */}
      <div className="body-map-legend">
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <span className="legend-color"></span>
          <span>Click to select</span>
        </div>
      </div>
    </div>
  );
};

export default ChickenBodyMap;
