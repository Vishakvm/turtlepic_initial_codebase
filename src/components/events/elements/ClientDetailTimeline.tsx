import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { styled, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ACCEPTED, TRANSFERRED } from 'src/utils/constants';

const TimelineCircle = styled(CheckCircleIcon)(({ theme }) => ({
  width: '2.2rem',
  height: '2.2rem',
}));

interface Props {
  status: string;
}

export default function BasicTimeline({ status }: Props) {
  let accept;
  let transfer;
  if (status === ACCEPTED) {
    accept = '#7dd78d';
  } else if (status === TRANSFERRED) {
    transfer = '#7dd78d';
  }

  return (
    <>
      <Timeline>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot>
              <TimelineCircle color="primary" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="body1" color="grey.100">
              Requested
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot>
              <TimelineCircle sx={{ color: accept || transfer }} />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="body1" color="grey.100">
              Accepted
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot>
              <TimelineCircle sx={{ color: transfer }} />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="body1" color="grey.100">
              Transferred
            </Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </>
  );
}
