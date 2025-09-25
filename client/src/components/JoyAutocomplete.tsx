import * as React from "react";
import { Input, List, ListItem, Sheet, Typography } from "@mui/joy";
import { ClickAwayListener } from "@mui/base/ClickAwayListener"; // ✅ important

type OptionType = { label: string; value: string };

interface JoyAutocompleteProps {
  options: OptionType[];
  value: string;
  placeholder?: string;
  loading?: boolean;
  onChange: (val: string) => void;
}

export default function JoyAutocomplete({
  options,
  value,
  placeholder,
  loading,
  onChange,
  sx,
}: JoyAutocompleteProps & { sx?: any }) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Sheet sx={{ position: "relative", ...sx }}>
        <Input
          size="sm"
          value={options.find((o) => o.value === value)?.label || query}
          placeholder={loading ? "Loading..." : placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            onChange(""); // reset until option picked
          }}
          onFocus={() => setOpen(true)}
        />

        {open && filtered.length > 0 && (
          <List
            sx={{
              position: "absolute",
              zIndex: 20,
              bgcolor: "background.body",
              width: "100%",
              maxHeight: 200,
              overflowY: "auto",
              border: "1px solid",
              borderColor: "neutral.outlinedBorder",
              borderRadius: "sm",
            }}
          >
            {filtered.map((opt) => (
              <ListItem
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setQuery(opt.label);
                  setOpen(false);
                }}
                sx={{ cursor: "pointer" }}
              >
                {opt.label}
              </ListItem>
            ))}
          </List>
        )}
        {open && !loading && filtered.length === 0 && (
          <Typography
            level="body-sm"
            sx={{
              position: "absolute",
              zIndex: 20,
              bgcolor: "background.body",
              p: 1,
              borderRadius: "sm",
              border: "1px solid",
              borderColor: "neutral.outlinedBorder",
              width: "100%",
            }}
          >
            No results
          </Typography>
        )}
      </Sheet>
    </ClickAwayListener>
  );
}
