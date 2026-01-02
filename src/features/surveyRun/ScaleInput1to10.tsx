// [S05] Added: 1–10 scale input as buttons. Pure component, no effects.

import { Stack } from "@ui/Stack";
import { Button } from "@ui/Button";


type Props = {
  min: number;
  max: number;
  value: number | null;
  onPickValue: (value: number) => void;
};

export function ScaleInput1to10({ min, max, value, onPickValue }: Props) {
  const nums = [];
  for (let n = min; n <= max; n++) nums.push(n);

  return (
    <Stack direction="row" gap={8} wrap="wrap">
      {nums.map((n) => {
        const selected = value === n;
        return (
          <Button
            key={n}
            variant={selected ? "solid" : "ghost"}
            onClick={() => onPickValue(n)}
            style={{
              minWidth: 44,
              justifyContent: "center",
              opacity: selected ? 1 : 0.9,
            }}
            aria-pressed={selected}
          >
            {n}
          </Button>
        );
      })}
    </Stack>
  );
}
