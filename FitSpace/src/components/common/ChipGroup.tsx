import '../../styles/controls.css';

interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipGroupProps<T extends string> {
  label: string; // read out by screen readers, e.g. "Filter by level"
  options: ChipOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
  variant?: 'chips' | 'segmented'; // "segmented" is the joined pill toggle
}

function ChipGroup<T extends string>({
  label,
  options,
  selected,
  onSelect,
  variant = 'chips',
}: ChipGroupProps<T>) {
  return (
    <div
      className={variant === 'segmented' ? 'chip-group chip-group-segmented' : 'chip-group'}
      role="group"
      aria-label={label}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="chip"
          aria-pressed={option.value === selected}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ChipGroup;