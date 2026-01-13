import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md',
        secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
        success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
        xl: 'w-6 h-6'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <Loader2 className={`${iconSizes[size]} animate-spin ${children ? 'mr-2' : ''}`} />
            )}

            {!loading && Icon && iconPosition === 'left' && (
                <Icon className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} />
            )}

            {children}

            {!loading && Icon && iconPosition === 'right' && (
                <Icon className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} />
            )}
        </button>
    );
}
