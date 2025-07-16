import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';
import HideImageIcon from '@mui/icons-material/HideImage';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function IndexField({menuComponent, defaultValue='', pressEnter, buttonClear, button3d, story, derivButton, backgButton, component1, component2, component3, component4, component5, buttonClickMode}) {
  return (
    <Paper
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}
    >
      {menuComponent}

      <Autocomplete
        sx={{ ml: 1, flex: 1 }}
        value={defaultValue}
        onKeyDown={pressEnter}
        onBlur={pressEnter}
        freeSolo
        // id={id}
        disableClearable
        options={story}
        // style={{ width: width, margin: margin }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={"HSI индекс"}
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
            sx={{
              // Root class for the input field
              "& .MuiOutlinedInput-root": {
                color: "#000",
                // fontFamily: "Arial",
                // fontWeight: "bold",
                // Class for the border around the input field
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FFFFFF",
                  borderWidth: "2px",
                },
              },
              // Class for the label of the input field
              "& .MuiInputLabel-outlined": {
                color: "#1E90FF",
                fontWeight: "bold",
              },
            }}
          />
        )}
      />
          
      {/* <InputBase
        defaultValue={defaultValue}
        onKeyDown={pressEnter}
        onBlur={pressEnter}
        sx={{ ml: 1, flex: 1 }}
        placeholder="HSI индекс"
        inputProps={{ 'aria-label': 'search google maps', spellCheck: false }}
      /> */}
      <IconButton type="button" sx={{ p: '10px' }} aria-label="clear" color='primary' onClick={buttonClear}>
        <LayersClearIcon />
      </IconButton>
      {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={button3d}>
        <ThreeDRotationIcon />
      </IconButton> */}
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={derivButton}>
        <MultilineChartIcon />
      </IconButton>
      {/* <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={backgButton}>
        <HideImageIcon />
      </IconButton> */}
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      {/* <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={backgButton}>
        <HideImageIcon />
      </IconButton> */}
      {buttonClickMode}
      {component1}
      {component2}
      {component3}
      {component4}
      {component5}
    </Paper>
  );
}
