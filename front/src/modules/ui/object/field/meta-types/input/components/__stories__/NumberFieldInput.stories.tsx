import { useEffect } from 'react';
import { expect, jest } from '@storybook/jest';
import { Decorator, Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';

import { useSetHotkeyScope } from '@/ui/utilities/hotkey/hooks/useSetHotkeyScope';

import { FieldContextProvider } from '../../../__stories__/FieldContextProvider';
import { useNumberField } from '../../../hooks/useNumberField';
import { NumberFieldInput, NumberFieldInputProps } from '../NumberFieldInput';

const NumberFieldValueSetterEffect = ({ value }: { value: number }) => {
  const { setFieldValue } = useNumberField();

  useEffect(() => {
    setFieldValue(value);
  }, [setFieldValue, value]);

  return <></>;
};

type NumberFieldInputWithContextProps = NumberFieldInputProps & {
  value: number;
  entityId?: string;
};

const NumberFieldInputWithContext = ({
  entityId,
  value,
  onEnter,
  onEscape,
  onClickOutside,
  onTab,
  onShiftTab,
}: NumberFieldInputWithContextProps) => {
  const setHotKeyScope = useSetHotkeyScope();

  useEffect(() => {
    setHotKeyScope('hotkey-scope');
  }, [setHotKeyScope]);

  return (
    <div>
      <FieldContextProvider
        fieldDefinition={{
          fieldId: 'number',
          label: 'Number',
          type: 'NUMBER',
          metadata: {
            fieldName: 'number',
            placeHolder: 'Enter number',
          },
        }}
        entityId={entityId}
      >
        <NumberFieldValueSetterEffect value={value} />
        <NumberFieldInput
          onEnter={onEnter}
          onEscape={onEscape}
          onClickOutside={onClickOutside}
          onTab={onTab}
          onShiftTab={onShiftTab}
        />
      </FieldContextProvider>
      <div data-testid="data-field-input-click-outside-div" />
    </div>
  );
};

const enterJestFn = jest.fn();
const escapeJestfn = jest.fn();
const clickOutsideJestFn = jest.fn();
const tabJestFn = jest.fn();
const shiftTabJestFn = jest.fn();

const clearMocksDecorator: Decorator = (Story, context) => {
  if (context.parameters.clearMocks) {
    enterJestFn.mockClear();
    escapeJestfn.mockClear();
    clickOutsideJestFn.mockClear();
    tabJestFn.mockClear();
    shiftTabJestFn.mockClear();
  }
  return <Story />;
};

const meta: Meta = {
  title: 'UI/Data/Field/Input/NumberFieldInput',
  component: NumberFieldInputWithContext,
  args: {
    value: 1000,
    isPositive: true,
    onEnter: enterJestFn,
    onEscape: escapeJestfn,
    onClickOutside: clickOutsideJestFn,
    onTab: tabJestFn,
    onShiftTab: shiftTabJestFn,
  },
  argTypes: {
    onEnter: { control: false },
    onEscape: { control: false },
    onClickOutside: { control: false },
    onTab: { control: false },
    onShiftTab: { control: false },
  },
  decorators: [clearMocksDecorator],
  parameters: {
    clearMocks: true,
  },
};

export default meta;

type Story = StoryObj<typeof NumberFieldInputWithContext>;

export const Default: Story = {};

export const Enter: Story = {
  play: async () => {
    expect(enterJestFn).toHaveBeenCalledTimes(0);

    await waitFor(() => {
      userEvent.keyboard('{enter}');
      expect(enterJestFn).toHaveBeenCalledTimes(1);
    });
  },
};

export const Escape: Story = {
  play: async () => {
    expect(escapeJestfn).toHaveBeenCalledTimes(0);

    await waitFor(() => {
      userEvent.keyboard('{esc}');
      expect(escapeJestfn).toHaveBeenCalledTimes(1);
    });
  },
};

export const ClickOutside: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(clickOutsideJestFn).toHaveBeenCalledTimes(0);

    const emptyDiv = canvas.getByTestId('data-field-input-click-outside-div');

    await waitFor(() => {
      userEvent.click(emptyDiv);
      expect(clickOutsideJestFn).toHaveBeenCalledTimes(1);
    });
  },
};

export const Tab: Story = {
  play: async () => {
    expect(tabJestFn).toHaveBeenCalledTimes(0);

    await waitFor(() => {
      userEvent.keyboard('{tab}');
      expect(tabJestFn).toHaveBeenCalledTimes(1);
    });
  },
};

export const ShiftTab: Story = {
  play: async () => {
    expect(shiftTabJestFn).toHaveBeenCalledTimes(0);

    await waitFor(() => {
      userEvent.keyboard('{shift>}{tab}');
      expect(shiftTabJestFn).toHaveBeenCalledTimes(1);
    });
  },
};
