// [S04] Added: UI demo page to validate primitives quickly.

import { PageShell } from "@ui/PageShell";
import { Card } from "@ui/Card";
import { Stack } from "@ui/Stack";
import { Button } from "@ui/Button";
import { Heading, Text } from "@ui/Text";


export function UiDemoPage() {
  return (
    <PageShell>
      <Stack gap={18}>
        <Heading level={1}>UI Demo</Heading>
        <Text muted>
          Validate primitives: Card, Stack, Button, Text, Heading. No domain imports.
        </Text>

        <Card>
          <Stack gap={12}>
            <Heading level={2}>Card</Heading>
            <Text>This is a Card using tokens for radius/border/surface.</Text>

            <Stack direction="row" gap={10} wrap="wrap">
              <Button onClick={() => alert("Solid clicked")}>Solid</Button>
              <Button variant="ghost" onClick={() => alert("Ghost clicked")}>
                Ghost
              </Button>
            </Stack>

            <Text mono muted>
              tokens: --bg, --fg, --surface, --border, --r-lg, --shadow-1
            </Text>
          </Stack>
        </Card>
      </Stack>
    </PageShell>
  );
}
