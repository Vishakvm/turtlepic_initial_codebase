/*
 * Feedback Dialog
 */

import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import IconHateSVG from 'src/assets/shared/svg/icon_hate';
import IconLikeSvg from 'src/assets/shared/svg/icon_like';
import IconDislikeSVG from 'src/assets/shared/svg/icon_dislike';
import IconNeutralSVG from 'src/assets/shared/svg/icon_neutral';
import IconLoveSVG from 'src/assets/shared/svg/icon_love';
import UpArrowKeyboard from 'src/assets/shared/images/UpArrowKeyboard.png';
import TextField from '@mui/material/TextField';
import Logo2 from 'src/components/Logo2';
import axios from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import { LoadingButton } from '@mui/lab';

type PropsType = {
  //   dialogContent: string | React.ReactElement;
  eventId?: string;
  isDialogOpen: boolean;
  onClose: () => void;
  onFeedbackSuccess: () => void;
  onFeedbackFailure: () => void;
};

const CloseIconIn = styled(CloseIcon)(({ theme }) => ({
  fontSize: '1.2rem',
  //   position:'absolute',
  //   left:'-3rem',
}));

const ContentWrapper = styled('div')(({ theme }) => ({
  //   width: '80%',
  marginLeft: 'auto',
  marginRight: 'auto',
  //   margin:'10px',
  [theme.breakpoints.down('sm')]: {
    width: '95%',
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: '0',
  top: '-6%',
  backgroundColor: '#3B3A3A',
  color: 'white',
  padding: '5px',
}));

const FeedBackInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  // height: '100%',
  padding: '10px',
  fontStyle: 'normal',
  color: 'black',
  backgroundColor: '#E9E9E8',
  // paddingBottom: '20px',
  margin: '0',
  height: '120px',
  '& .MuiInputBase-input': {
    color: 'black',
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'gray',
    fontStyle: 'normal',
    fontSize: '15px',
  },
}));

const SendButton = styled(LoadingButton)(({ theme }) => ({
  color: 'black',
  height: '30px',
  backgroundColor: '#E9E9E8',
  '&:hover': {
    backgroundColor: '#5DBD6F',
    color: '#FFFFFF',
  },
}));

interface Icon {
  icon: string;
  component: JSX.Element;
  isSelected: boolean;
  value: number;
}

export default function FeedbackDialog(props: PropsType): React.ReactElement {

  const [selectedIcon, setSelectedIcon] = useState<Icon>({
    icon: '',
    component: <></>,
    isSelected: false,
    value: 0,
  });

  const [hoveredIcon, setHoveredIcon] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const reactionIcons = [
    {
      icon: 'Hate',
      component: <IconHateSVG />,
      isSelected: false,
      value: 1,
    },
    {
      icon: 'Dislike',
      component: <IconDislikeSVG />,
      isSelected: false,
      value: 2,
    },
    {
      icon: 'Neutral',
      component: <IconNeutralSVG />,
      isSelected: false,
      value: 3,
    },
    {
      icon: 'Like',
      component: <IconLikeSvg />,
      isSelected: false,
      value: 4,
    },
    {
      icon: 'Love',
      component: <IconLoveSVG />,
      isSelected: false,
      value: 5,
    },
  ];
  const [icons, setIcons] = useState(reactionIcons);

  const handleButtonClick = (iconName: string) => {
    const updatedIcons = icons.map((icon) => {
      if (icon.icon === iconName) {
        setSelectedIcon({
          ...icon,
          isSelected: true,
        });
        return {
          ...icon,
          isSelected: true,
        };
      } else {
        return {
          ...icon,
          isSelected: false,
        };
      }
    });
    setIcons(updatedIcons);
  };

  const handleMouseEnter = (iconName: string) => {
    setHoveredIcon(iconName);
  };

  const handleMouseLeave = () => {
    setHoveredIcon('');
  };

  const handleInputChange = (event: any) => {
    setFeedbackText(event.target.value);
  };

  const onSubmit = async () => {
    setLoading(true);
    const feedbackData = new FormData();
    feedbackData.append('event_id', props?.eventId!);
    feedbackData.append('email_id', user?.email);
    feedbackData.append('user_id', user?.id);
    feedbackData.append('feedback_rating', selectedIcon?.value?.toString());
    feedbackData.append('feedback', feedbackText);
    feedbackData.append('is_showcase', '0');

    try {
      await axios.post(`/api/events/newfeedback`, feedbackData);
      setLoading(false);
      // alert('done');
      props.onClose();
      props.onFeedbackSuccess();
    } catch (error) {
      setLoading(false);
      props.onFeedbackFailure();
      console.error(error);
    }
    // console.log(feedbackData.get('email_id'));
    // console.log(feedbackData.get('feedback_rating'));
    // console.log(feedbackData.get('feedback'));
    // console.log(feedbackData.get('event_id'));
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          backgroundColor: 'white',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          position: 'absolute',
          right: 0,
          margin: 'auto',
          maxWidth: '388px',
          // height: '279px',
          overflowY: 'unset',
          //   backgroundColor:'white'
        },
      }}
      //   maxWidth={'md'}
      onClose={props.onClose}
      //   aria-labelledby={props.dialogId}
      open={props.isDialogOpen}
      BackdropProps={{ style: { backgroundColor: 'transparent' }, invisible: true }}
    >
      <DialogContent>
        <ContentWrapper>
          {!selectedIcon.isSelected && (
            <Box display="flex" justifyContent="center" sx={{ paddingBottom: '0', marginTop: '0' }}>
              <Typography
                mb={3}
                mt={2}
                variant="h4"
                color="black"
                align="center"
                sx={{ margin: 'auto 0', padding: 3, paddingTop: 1, width: '70%' }}
              >
                How would you rate your experience ?
              </Typography>
            </Box>
          )}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            sx={{ paddingBottom: '0', marginBottom: '0' }}
          >
            {icons.map((reactionIcon) => (
              <IconButton
                onMouseEnter={() => handleMouseEnter(reactionIcon.icon)}
                onMouseLeave={handleMouseLeave}
                disableRipple
                key={reactionIcon.icon}
                onClick={() => handleButtonClick(reactionIcon.icon)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingBottom: '0',
                  marginBottom: '0',
                  transition: 'opacity 3s ease-in-out',
                }}
              >
                {React.cloneElement(reactionIcon.component, {
                  color: selectedIcon.isSelected ? reactionIcon.isSelected : true,
                })}
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  sx={{
                    marginLeft: '12px',
                    marginTop: '5px',
                    height: '20px',
                  }}
                >
                  {reactionIcon.isSelected ? reactionIcon.icon : ''}
                  {hoveredIcon === reactionIcon.icon && !reactionIcon.isSelected
                    ? reactionIcon.icon
                    : ''}
                </Typography>

                <Box sx={{ height: '8px' }}>
                  {reactionIcon.isSelected && (
                    <img
                      src={UpArrowKeyboard}
                      width="18px"
                      style={{ marginLeft: '12px', transition: 'opacity 1s ease-in-out' }}
                      alt="up-arrow"
                    />
                  )}
                </Box>
              </IconButton>
            ))}
          </Box>
          {selectedIcon.isSelected && (
            <FeedBackInput
              placeholder="Tell us about your experience (optional)"
              variant="standard"
              hiddenLabel
              multiline
              maxRows={4}
              InputProps={{ disableUnderline: true, autoFocus: true }}
              InputLabelProps={{ sx: { fontStyle: 'normal' } }}
              onChange={handleInputChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
            />
          )}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDirection="row"
            sx={{ paddingBottom: '0', marginBottom: '0', marginTop: 2 }}
          >
            <Box display="flex" flexDirection="row" sx={{ paddingBottom: '0', marginBottom: '0' }}>
              <Box
                sx={{
                  width: 36,
                  backgroundColor: 'black',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Logo2 disabledLink />
              </Box>
              <Typography
                variant="subtitle1"
                textAlign="center"
                color={'#000'}
                sx={{
                  marginLeft: '12px',
                  marginTop: '5px',
                  height: '20px',
                  transition: 'opacity 1s ease-in-out',
                }}
              >
                Powered By{' '}
                <u
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.open(`https://www.turtlepic.com/`, '_blank')}
                >
                  turtlepic
                </u>
              </Typography>
            </Box>
            {selectedIcon.isSelected && (
              <SendButton loading={loading} onClick={onSubmit}>
                Send
              </SendButton>
            )}
          </Box>
        </ContentWrapper>
      </DialogContent>
      {/* <DialogActions> */}
      <CloseButton onClick={props.onClose} disableRipple>
        <CloseIconIn />
      </CloseButton>
      {/* </DialogActions> */}
    </Dialog>
  );
}
