import Selector from '../Custom/Selector/Selector';
import useGroupSelectorModel from './useGroupSelectorModel';

interface GroupSelectorProps {
    label?: string,
    placeholder?: string,
    shouldSetInitialValue?: boolean,
    value?: string,
    onChange?: (value: string) => void,
    disabled?: boolean,
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  label,
  placeholder,
  shouldSetInitialValue,
  value,
  onChange,
  disabled,
}) => {
  const model = useGroupSelectorModel();

  return (
    <Selector 
      label={label}
      model={model} 
      maxHeight={200}
      placeholder={placeholder}
      shouldSetInitialValue={shouldSetInitialValue}
      value={value}
      onChange={onChange ? (val) => onChange(val) : undefined}
      disabled={disabled} />
  );
};

export default GroupSelector;