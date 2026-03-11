import React, { useState } from 'react';
import './ChickenBodyMapImproved.css';

/**
 * IMPROVED CHICKEN BODY MAP - 16 Precise Regions
 * Interactive SVG chicken silhouette with clickable body parts
 * Based on PoultryDVM design + our improved 16-category system
 */

const ChickenBodyMapImproved = ({ selectedBodyParts = [], onBodyPartToggle }) => {
  const [hoveredPart, setHoveredPart] = useState(null);

  // 16 IMPROVED BODY PART REGIONS
  const bodyParts = [
    {
      id: 'comb_wattles',
      name: 'Comb & Wattles',
      color: '#FF6B6B',
      path: 'M 280 80 Q 285 65 290 60 L 295 55 L 300 60 L 295 70 L 290 75 Z M 285 95 L 280 100 L 275 95 Z M 295 95 L 300 100 L 305 95 Z'
    },
    {
      id: 'eyes',
      name: 'Eyes',
      color: '#4ECDC4',
      circle: { cx: 295, cy: 85, r: 6 }
    },
    {
      id: 'beak_mouth',
      name: 'Beak & Mouth',
      color: '#FFE66D',
      path: 'M 310 90 L 325 88 L 320 95 L 310 93 Z'
    },
    {
      id: 'ears',
      name: 'Ears',
      color: '#95E1D3',
      circle: { cx: 290, cy: 90, r: 4 }
    },
    {
      id: 'face',
      name: 'Face',
      color: '#F38181',
      path: 'M 285 75 Q 290 70 295 75 Q 300 80 295 85 Q 290 90 285 85 Z'
    },
    {
      id: 'neck',
      name: 'Neck',
      color: '#AA96DA',
      path: 'M 275 105 Q 280 120 270 140 L 250 145 Q 260 125 265 110 Z'
    },
    {
      id: 'crop',
      name: 'Crop',
      color: '#FCBAD3',
      ellipse: { cx: 255, cy: 150, rx: 18, ry: 15 }
    },
    {
      id: 'respiratory',
      name: 'Respiratory',
      color: '#A8E6CF',
      path: 'M 240 160 L 260 155 L 260 190 L 240 195 Z'
    },
    {
      id: 'wings',
      name: 'Wings',
      color: '#FFD3B6',
      path: 'M 230 170 Q 200 175 180 190 Q 185 200 200 205 Q 220 195 235 185 Z M 270 170 Q 300 175 320 190 Q 315 200 300 205 Q 280 195 265 185 Z'
    },
    {
      id: 'breast_keel',
      name: 'Breast & Keel',
      color: '#FFAAA5',
      path: 'M 235 200 L 265 200 L 260 240 L 240 240 Z'
    },
    {
      id: 'abdomen',
      name: 'Abdomen',
      color: '#FF8B94',
      ellipse: { cx: 250, cy: 260, rx: 30, ry: 35 }
    },
    {
      id: 'vent',
      name: 'Vent',
      color: '#FEC8D8',
      circle: { cx: 250, cy: 300, r: 12 }
    },
    {
      id: 'legs_feet',
      name: 'Legs & Feet',
      color: '#957DAD',
      path: 'M 230 310 L 235 360 L 220 365 L 210 370 M 235 360 L 245 365 L 240 370 M 235 360 L 250 365 L 255 370 M 270 310 L 265 360 L 280 365 L 290 370 M 265 360 L 255 365 L 260 370 M 265 360 L 250 365 L 245 370'
    },
    {
      id: 'skin_feathers',
      name: 'Skin & Feathers',
      color: '#D4A5A5',
      path: 'M 180 180 Q 150 200 140 240 Q 145 280 160 300 Q 180 290 200 280 M 320 180 Q 350 200 360 240 Q 355 280 340 300 Q 320 290 300 280'
    },
    {
      id: 'behavior',
      name: 'Behavior',
      color: '#9EC1CF',
      // Subtle outline around whole chicken
      opacity: 0.3
    },
    {
      id: 'systemic',
      name: 'General/Systemic',
      color: '#B4A7D6',
      // Full body overlay
      opacity: 0.3
    }
  ];

  const handleBodyPartClick = (partId) => {
    if (onBodyPartToggle) {
      onBodyPartToggle(partId);
    }
  };

  const isSelected = (partId) => selectedBodyParts.includes(partId);

  return (
    <div className="chicken-body-map-improved">
      <div className="chicken-svg-container">
        <svg
          viewBox="0 0 500 400"
          className="chicken-silhouette"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Chicken Silhouette - Black outline */}
          <g id="chicken-base" opacity="0.15">
            <ellipse cx="250" cy="200" rx="80" ry="120" fill="black"/>
            <circle cx="290" cy="85" r="35" fill="black"/>
            <ellipse cx="250" cy="280" rx="45" ry="55" fill="black"/>
            <path d="M 230 310 L 235 370 M 270 310 L 265 370" stroke="black" strokeWidth="8"/>
          </g>

          {/* Interactive Body Parts */}
          {bodyParts.map((part) => {
            const selected = isSelected(part.id);
            const hovered = hoveredPart === part.id;
            const opacity = part.opacity || (selected ? 0.8 : hovered ? 0.5 : 0.3);

            return (
              <g
                key={part.id}
                className={`body-part ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => handleBodyPartClick(part.id)}
                style={{ cursor: 'pointer' }}
              >
                {part.path && (
                  <path
                    d={part.path}
                    fill={part.color}
                    opacity={opacity}
                    stroke={selected ? '#000' : 'none'}
                    strokeWidth={selected ? 2 : 0}
                  />
                )}
                {part.circle && (
                  <circle
                    cx={part.circle.cx}
                    cy={part.circle.cy}
                    r={part.circle.r}
                    fill={part.color}
                    opacity={opacity}
                    stroke={selected ? '#000' : 'none'}
                    strokeWidth={selected ? 2 : 0}
                  />
                )}
                {part.ellipse && (
                  <ellipse
                    cx={part.ellipse.cx}
                    cy={part.ellipse.cy}
                    rx={part.ellipse.rx}
                    ry={part.ellipse.ry}
                    fill={part.color}
                    opacity={opacity}
                    stroke={selected ? '#000' : 'none'}
                    strokeWidth={selected ? 2 : 0}
                  />
                )}
              </g>
            );
          })}

          {/* Hover Label */}
          {hoveredPart && (
            <text
              x="250"
              y="30"
              textAnchor="middle"
              className="hover-label"
              fill="#333"
              fontSize="16"
              fontWeight="bold"
            >
              {bodyParts.find(p => p.id === hoveredPart)?.name}
            </text>
          )}
        </svg>
      </div>

      {/* Body Part Checkboxes */}
      <div className="body-parts-list">
        <h3>Select Body Areas</h3>
        <div className="body-parts-grid">
          {bodyParts.map((part) => (
            <label
              key={part.id}
              className={`body-part-checkbox ${isSelected(part.id) ? 'checked' : ''}`}
              onMouseEnter={() => setHoveredPart(part.id)}
              onMouseLeave={() => setHoveredPart(null)}
            >
              <input
                type="checkbox"
                checked={isSelected(part.id)}
                onChange={() => handleBodyPartClick(part.id)}
              />
              <span
                className="color-indicator"
                style={{ backgroundColor: part.color }}
              ></span>
              <span className="part-name">{part.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Selected Count */}
      {selectedBodyParts.length > 0 && (
        <div className="selection-summary">
          <strong>{selectedBodyParts.length}</strong> body area{selectedBodyParts.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};

export default ChickenBodyMapImproved;
