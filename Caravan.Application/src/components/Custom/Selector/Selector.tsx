import {
  Input,
  CloseButton,
  Combobox,
  InputBase,
  Loader,
  useCombobox,
} from "@mantine/core";

import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import type SelectorModel from "./SelectorModel";
import type { SelectionItem } from "./SelectorModel";

interface SelectorProps {
  model: SelectorModel;
  maxHeight?: number;
  shouldSetInitialValue?: boolean;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  actions?: React.ReactNode;
  onChange?: (value: string) => void;
}

const Selector: React.FC<SelectorProps> = ({
  model,
  maxHeight = 200,
  shouldSetInitialValue = true,
  value,
  disabled = false,
  placeholder = "Select...",
  label = "",
  actions,
  onChange
}) => {
  const [initialValueIsSet, setInitialValueIsSet] = useState(false);

  useEffect(() => {
    if (
      shouldSetInitialValue &&
      !initialValueIsSet &&
      model.records.length > 0 &&
      model.selectorParams.value === ""
    ) {
      const currentRecord = model.records.find(x => x.value == value);
      const record = currentRecord ?? model.records[0];
      model.selectorParams.setValue(record.label);
      model.selectorParams.setSearch(record.label);
      setInitialValueIsSet(true);
    }
  }, [
    model.selectorParams.value,
    model.records,
    shouldSetInitialValue,
    initialValueIsSet,
    model.selectorParams,
  ]);

  // Intersection observer
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { ref, entry } = useIntersection({
    threshold: 0.1,
    // eslint-disable-next-line react-hooks/refs
    root: containerRef.current,
  });

  useEffect(() => {
    if (
      entry?.isIntersecting &&
      model.hasNextPage &&
      !model.isFetching &&
      !model.isLoading
    ) {
      model.onBottomReached();
    }
  }, [
    entry?.isIntersecting,
    model.hasNextPage,
    model.isFetching,
    model.isLoading,
    model.onBottomReached,
  ]);

  const combobox = useCombobox({
    onDropdownClose: () => {},
  });

  const options = model.records.map((item: SelectionItem) => (
    <Combobox.Option
      value={JSON.stringify({ label: item.label, value: item.value })}
      key={item.value}
    >
      {item.label}
    </Combobox.Option>
  ));

  return (
    <Input.Label>{label}
      <Combobox
        disabled={disabled}
        store={combobox}
        withinPortal={false}
        onOptionSubmit={(val) => {
          const selectedValue = JSON.parse(val);
          const selected = model.records.find(
            (r) => r.value === selectedValue.value
          );
          model.selectorParams.setValue(selected?.label || "");
          model.selectorParams.setSearch(selected?.label || "");
          onChange?.(selectedValue.value);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            value={model.selectorParams.search}
            onChange={(event) => {
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
              model.selectorParams.setSearch(event.currentTarget.value);
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => {
              combobox.closeDropdown();
              model.selectorParams.setSearch(model.selectorParams.value || "");
            }}
            placeholder={placeholder}
            rightSection={
              model.selectorParams.value !== null ? (
                <CloseButton
                  size="sm"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    model.selectorParams.setSearch("");
                    combobox.openDropdown();
                  }}
                  aria-label="Clear value"
                />
              ) : (
                <Combobox.Chevron />
              )
            }
          />
        </Combobox.Target>

        <Combobox.Dropdown
          mah={maxHeight}
          ref={containerRef}
          style={{ overflowY: "auto" }}
        >
          <Combobox.Header>
            {actions}
          </Combobox.Header>
          <Combobox.Options>
            {options.length > 0 ? (
              options
            ) : (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            )}
          </Combobox.Options>
          <div ref={ref}>{model.isLoading && <Loader size="sm" />}</div>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Label>
  );
};

export default Selector;
