import React, { useRef, useEffect } from "react";
import { TextField } from "@mui/material";

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ label, value, onChange }) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !ref.current) return;

    const autocomplete = new google.maps.places.Autocomplete(ref.current, {
      types: ["geocode"],
      componentRestrictions: { country: "us" }
    });
    
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    });
  }, [onChange]);

  return (
    <TextField
      label={label}
      inputRef={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      variant="outlined"
      fullWidth
      margin="normal"
    />
  );
};

export default LocationInput;

