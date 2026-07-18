import Joi from 'joi';

export const registerJoiSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .pattern(/^[A-Za-z\s]+$/)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name cannot exceed 100 characters',
            'string.pattern.base': 'Name can only contain letters and spaces',
            'any.required': 'Name is required',
        }),

    email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required',
    }),

    phone: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please enter a valid 10-digit phone number',
        }),

    avatar: Joi.string().trim().uri().optional().allow(null, '').messages({
        'string.uri': 'Avatar must be a valid URL',
    }),

    password: Joi.string()
        .min(8)
        .max(50)
        .pattern(/[a-z]/, 'lowercase')
        .pattern(/[A-Z]/, 'uppercase')
        .pattern(/[0-9]/, 'number')
        .pattern(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'special character')
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password cannot exceed 50 characters',
            'string.pattern.name':
                'Password must contain at least one {#name}.',
            'any.required': 'Password is required',
        }),
});
