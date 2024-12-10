import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    // minWidth: '750px',
    width: '100%',
    margin: '15px',
    backgroundColor: 'rgba(0,0,0,0.01)',
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 127, 80, .90)"
      : "rgba(255, 127, 80, .90)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  backgroundColor: "rgba(119, 204, 247, .01)",
}));

export default function HiddenImage({ component1, component2, title='' }) {
  const [expanded, setExpanded] = React.useState("imaged");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
        <Accordion disabled={component1 ? false : true}
            expanded={expanded === 'image'}
            onChange={handleChange('image')}
          >
            <AccordionSummary
              aria-controls={`imaged-content`}
              id={`imaged-header`}
            >
              <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Stack spacing={2}>
              {component1}
              {component2}
            </Stack>
            </AccordionDetails>
          </Accordion>
    </div>
  );
}
