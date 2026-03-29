export default function Button({ variant = 'secondary', icon, children, className = '', ...buttonProps }) {
	const variantClass = {
		primary: 'button-primary',
		danger: 'button-danger',
		secondary: 'button-secondary',
	}[variant] || 'button-secondary';
	const hasText = !!children;
	return (
		<button
			className={`button ${variantClass} ${hasText ? 'button-has-text' : ''} ${className}`.trim()}
			{...buttonProps}
		>
			{icon && <span className="button-icon">{icon}</span>}
			{hasText && <span className="button-text">{children}</span>}
		</button>
	);
}