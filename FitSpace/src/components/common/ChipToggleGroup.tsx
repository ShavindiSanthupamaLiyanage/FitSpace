import { MdCheck } from 'react-icons/md';
import '../../styles/controls.css';

interface ChipToggleGroupProps<T extends string> {
  label: string; // read out by screen readers, e.g. "Fitness interests"
  options: T[]; // each value is also the text on its chip
  selected: T[];
  onToggle: (value: T) => void;
}

function ChipToggleGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: ChipToggleGroupProps<T>) {
  return (
    <div className="chip-group chip-group-toggle" role="group" aria-label={label}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            className="chip"
            aria-pressed={isSelected}
            onClick={() => onToggle(option)}
          >
            {/* The tick means the state is not shown by colour alone */}
            {isSelected && <MdCheck aria-hidden="true" />}
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default ChipToggleGroup;