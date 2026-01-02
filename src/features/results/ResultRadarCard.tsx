// [S07] Added: Results radar card (semantic wrapper).

import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Heading, Text } from "@ui/Text";
import { RadarChart } from "@ui/charts/RadarChart";



type Axis = { label: string; value: number };

type Props = {
  title?: string;
  axes: Axis[];
  max: number;
};

export function ResultRadarCard({ title = "Category Radar", axes, max }: Props) {
  return (
    <Card>
      <Stack gap={12} align="center">
        <Stack gap={6} style={{ width: "100%" }}>
          <Heading level={2}>{title}</Heading>
          <Text muted>Values are mapped onto a radar chart (null averages are treated as 0).</Text>
        </Stack>

        <RadarChart axes={axes} max={max} size={340} />
      </Stack>
    </Card>
  );
}
