import React, { useRef, useEffect } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  onChange,
  onClear,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google) {
      console.warn("❌ Google Maps SDK is not loaded yet");
      return;
    }
    if (!ref.current) {
      console.warn("❌ Input ref is not attached yet");
      return;
    }

    console.log("✅ Initializing Autocomplete...");
    const autocomplete = new google.maps.places.Autocomplete(ref.current, {
      types: ["geocode"],
      componentRestrictions: { country: "us" },
    });

    console.log("✅ Autocomplete instance created:", autocomplete);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      console.log("📍 Place selected:", place);

      if (place.formatted_address) {
        onChange(place.formatted_address);
      } else {
        console.warn("⚠ No formatted address found in selected place");
      }
    });
  }, [onChange]);

  return (
    <TextField
      label={label}
      inputRef={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      fullWidth
      margin="normal"
      InputProps={{
        endAdornment: value && onClear ? (
          <InputAdornment position="end">
            <IconButton
              aria-label={`clear ${label}`}
              onClick={onClear}
              size="small"
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

export default LocationInput;
