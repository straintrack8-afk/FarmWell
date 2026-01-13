import React from 'react';
import { CATEGORY_COLORS } from '../../utils/constants';

export default function CategoryBadge({ category, size = 'sm' }) {
    const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

    const sizes = {
        xs: 'px-1.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-sm'
    };

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ${colors.bg} ${colors.text} ${sizes[size]}`}
        >
            {category}
        </span>
    );
}
