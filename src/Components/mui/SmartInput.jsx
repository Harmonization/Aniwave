import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function SmartInput({ pressChannel, defaultValue='', value=null, story = [], title='Умная строка', id='free-solo-2-demo', width=500, margin=15}) {
  return (
    <Autocomplete
      value={value || defaultValue}
      onKeyDown={pressChannel}
      onBlur={pressChannel}
      freeSolo
      id={id}
      disableClearable
      options={story}
      style={{ width: width, margin: margin }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={title}
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
        />
      )}
    />
  );
}