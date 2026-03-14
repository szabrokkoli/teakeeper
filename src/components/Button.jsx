import React from 'react';

// variant: 'primary' | 'secondary', icon: React elem, children: szöveg vagy elem, className: string, ...buttonProps
export default function Button({ variant = 'secondary', icon, children, className = '', ...buttonProps }) {
	const variantClass = variant === 'primary' ? 'button-primary' : 'button-secondary';
	const hasText = !!children;
	return (
		<button
			className={`button ${variantClass} ${className}`.trim()}
			{...buttonProps}
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: hasText ? '0.5rem' : 0
			}}
		>
			{icon && <span>{icon}</span>}
			{hasText && <span>{children}</span>}
		</button>
	);
}
