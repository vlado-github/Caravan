import Selector from '../Custom/Selector/Selector';
import useGroupSelectorModel from './useGroupSelectorModel';

interface GroupSelectorProps {
  label?: string,
  placeholder?: string,
  shouldSetInitialValue?: boolean,
  value?: string,
  disabled?: boolean,
  onChange?: (value: string) => void;
  actions?: React.ReactNode;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  label,
  placeholder,
  shouldSetInitialValue,
  value,
  disabled,
  onChange,
  actions
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
      disabled={disabled}
      actions={actions} 
      onChange={onChange}/>
  );
};

export default GroupSelector;