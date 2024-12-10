import * as React from "react";
import { useLoaderData } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
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
  backgroundColor: "rgba(119, 204, 247, .70)",
  backgroundImage: 'url(https://github.com/Harmonization/Aniwave/blob/main/static/2.jpg?raw=true)',
  backgroundSize: 'cover'
}));

export default function PreloadHiddenText({ indxSection }) {
  const [expanded, setExpanded] = React.useState("panel1");

  const { text } = useLoaderData();
  const section = text[indxSection];

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      {Object.keys(section).map((title, indx) => {
        const key = `accordion-item-${indx}`;
        const name = `panel${indx}`;
        return (
          <Accordion
            key={key}
            expanded={expanded === name}
            onChange={handleChange(name)}
          >
            <AccordionSummary
              aria-controls={`${name}d-content`}
              id={`${name}d-header`}
            >
              <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{section[title]}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
