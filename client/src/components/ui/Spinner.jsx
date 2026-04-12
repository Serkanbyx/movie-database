const sizeMap = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

const Spinner = ({ size = 'md', text, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-primary border-t-transparent`}
      />
      {text && (
        <p className="text-sm text-text-muted dark:text-text-muted-dark">{text}</p>
      )}
    </div>
  );
};

export default Spinner;
