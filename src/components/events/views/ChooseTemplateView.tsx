/*
 * Choose Template View
 *
 */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Grid, styled, ToggleButton, ToggleButtonGroup, Typography, Button } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { useNavigate } from 'react-router';

import axios from 'src/utils/axios';

import CreateEventFooterView from '../elements/CreateEventFooter';
import IconBackDarkSVG from 'src/assets/shared/svg/icon_back_dark';
import IconTickSVG from 'src/assets/shared/svg/icon_tick';

import { useSelector } from 'src/redux/store';
import { useSnackbar } from 'notistack';
import { AGENCY, CLIENT, WORKSPACE, TRANSFERRED } from 'src/utils/constants';
import useAuth from 'src/hooks/useAuth';
import { PATH_MAIN } from 'src/routes/paths';

interface TabNextProps {
  chooseTemplateTabRedirect: (index: number) => void;
  nextIndex: number;
  prevIndex: number;
}

interface Templates {
  id: number;
  name: string;
  display_name: string;
  accent_color?: null;
  active: boolean;
  default: boolean;
  image: {
    id: number;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    original_url: string;
    thumbnail_url: string;
  };
}

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(4, 0, 2, 2),
}));

const Wrapper2 = styled('div')(({ theme }) => ({
  padding: theme.spacing(4, 0, 2, 2),
}));

const LayoutSelectWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1, 0, 0, 0),
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    textAlign: 'center',
  },
}));

const ToggleLayoutBtnGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  background: 'none',
  border: 'none',
  [theme.breakpoints.down('xl')]: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
}));

const ToggleLayoutBtn = styled(ToggleButton)(({ theme }) => ({
  '&.MuiToggleButtonGroup-grouped': {
    border: 'none',
    borderRadius: '4px !important',
  },
}));

const ToggleThemeBtnGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  background: 'none',
  border: 'none',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
}));

const ToggleThemeBtn = styled(ToggleButton)(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    padding: theme.spacing(2, 2, 5, 2),
    marginBottom: theme.spacing(1.5),
    '&.MuiToggleButtonGroup-grouped': {
      margin: 0,
    },
  },
  [theme.breakpoints.up('xl')]: {
    padding: theme.spacing(2, 2, 3, 2),
  },
}));

const TickLayoutIcon = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '40%',
  right: '50%',
  transform: 'translate(50%)',
  [theme.breakpoints.down('sm')]: {
    top: '20%',
  },
}));

const TickThemeIcon = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '20%',
  right: '50%',
  transform: 'translate(50%)',
  [theme.breakpoints.down('xl')]: {
    position: 'absolute',
    top: '30%',
    right: '50%',
    transform: 'translate(50%)',
  },

  [theme.breakpoints.down('sm')]: {
    position: 'absolute',
    top: '35%',
    right: '50%',
    transform: 'translate(50%)',
  },
  '@media (min-width: 1500px)': {
    position: 'absolute',
    top: '40%',
    right: '50%',
    transform: 'translate(50%)',
  },
}));
const ChooseThemeGrid = styled(Grid)(({ theme }) => ({
  borderLeft: '1px solid #6d6d6d',
}));
const ThemeWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

const ButtonWrapper = styled('div')(({ theme }) => ({
  textAlign: 'end',
  padding: theme.spacing(3, 3, 3, 0),
}));

const Title = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '80%',
  left: 17,

  [theme.breakpoints.down('md')]: {
    position: 'absolute',
    top: '88%',
    left: 17,
  },
  [theme.breakpoints.up('xl')]: {
    position: 'absolute',
    top: '85%',
    left: 17,
  },
  '@media (min-width: 1700px)': {
    position: 'absolute',
    top: '90%',
    left: 17,
  },
}));

const FooterWrapper = styled('div')(({ theme }) => ({
  textAlign: 'end',
}));

export default function ChooseTemplateView({
  chooseTemplateTabRedirect,
  prevIndex,
  nextIndex,
}: TabNextProps): React.ReactElement {
  const [layout, setLayout] = useState();
  const [theme, setTheme] = useState();
  const [themes, setThemes] = useState<Templates[]>([]);
  const [layouts, setLayouts] = useState<Templates[]>([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();
  const eventDetail = useSelector((state) => state.createEvent.value);

  const handleLayoutChange = async (
    event: React.MouseEvent<HTMLElement>,
    selectedLayout: React.SetStateAction<undefined>
  ) => {
    if (selectedLayout !== null) {
      const layout_id = selectedLayout;
      try {
        const response = await axios.patch(`/api/events/${eventDetail.id}/template`, {
          layout_id,
        });
        const { message } = response.data;
        enqueueSnackbar(message, { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
      setLayout(selectedLayout);
    }
  };

  const handleThemeChange = async (
    event: React.MouseEvent<HTMLElement>,
    selectedTheme: React.SetStateAction<undefined>
  ) => {
    if (selectedTheme !== null) {
      const theme_id = selectedTheme;
      try {
        const response = await axios.patch(`/api/events/${eventDetail.id}/template`, {
          theme_id,
        });
        const { message } = response.data;
        enqueueSnackbar(message, { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
      setTheme(selectedTheme);
    }
  };

  const isMounted = useRef(false);

  useLayoutEffect(() => {
    const getThemes = async () => {
      try {
        const response = await axios.get(`/api/events/${eventDetail.id}/themes`);
        if (!isMounted.current) {
          const { data } = response.data;
          setThemes(data);
          data.map((ele: any) => ele.selected && setTheme(ele.id));
        }
      } catch (error) {
        console.error(error);
      }
    };
    const getLayouts = async () => {
      try {
        const response = await axios.get(`/api/events/${eventDetail.id}/layouts`);
        if (!isMounted.current) {
          const { data } = response.data;
          setLayouts(data);
          data.map((ele: any) => ele.selected && setLayout(ele.id));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getThemes();
    getLayouts();

    return () => {
      isMounted.current = true;
    };
  }, [eventDetail.id]);

  const handleBack = () => {
    chooseTemplateTabRedirect(prevIndex);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Wrapper>
            <Typography py={1} variant="h6">
              Choose Layout
            </Typography>
            <Typography variant="body1">Select a layout for your template</Typography>
          </Wrapper>
          <LayoutSelectWrapper>
            <ToggleLayoutBtnGroup
              color="primary"
              exclusive
              value={layout}
              onChange={handleLayoutChange}
            >
              {layouts.map(({ display_name, id, image }: Templates) => (
                <ToggleLayoutBtn key={id} value={id}>
                  <img src={String(image.original_url)} alt={display_name} />
                  {layout === id ? (
                    <TickLayoutIcon>
                      <IconTickSVG />
                    </TickLayoutIcon>
                  ) : null}
                </ToggleLayoutBtn>
              ))}
            </ToggleLayoutBtnGroup>
          </LayoutSelectWrapper>
        </Grid>
        <ChooseThemeGrid item xs={12} sm={12} md={6} lg={6}>
          <Wrapper2>
            <Typography py={1} variant="h6">
              Choose Theme
            </Typography>
            <Typography variant="body1">Select a theme for your template</Typography>
          </Wrapper2>
          <ThemeWrapper>
            <ToggleThemeBtnGroup
              color="primary"
              exclusive
              value={theme}
              onChange={handleThemeChange}
            >
              {themes.map(({ display_name, id, image }: Templates) => (
                <ToggleThemeBtn key={id} value={id}>
                  <img src={String(image.thumbnail_url)} alt={display_name} />
                  {theme === id ? (
                    <TickThemeIcon>
                      <IconTickSVG />
                    </TickThemeIcon>
                  ) : null}
                  <Title variant="body1">{display_name}</Title>
                </ToggleThemeBtn>
              ))}
            </ToggleThemeBtnGroup>

            <ButtonWrapper>
              {eventDetail.eventType === WORKSPACE && (
                <Button
                  color="secondary"
                  variant="contained"
                  size="small"
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={() => window.open(PATH_MAIN.previewEvent, '_blank')}
                >
                  Preview Event
                </Button>
              )}
              {user?.account_type === AGENCY && eventDetail.eventType === CLIENT && (
                <Button
                  color="secondary"
                  variant="contained"
                  size="small"
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={() => window.open(PATH_MAIN.previewEvent, '_blank')}
                >
                  Preview Event
                </Button>
              )}
              {user?.account_type === CLIENT && eventDetail.eventType === CLIENT && (
                <Button
                  color="secondary"
                  variant="contained"
                  disabled={eventDetail.client_status !== TRANSFERRED}
                  size="small"
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={() => window.open(PATH_MAIN.previewEvent, '_blank')}
                >
                  Preview Event
                </Button>
              )}
            </ButtonWrapper>
          </ThemeWrapper>
        </ChooseThemeGrid>
      </Grid>

      <CreateEventFooterView
        footerAction={
          <FooterWrapper>
            <Button
              onClick={handleBack}
              size="small"
              color="inherit"
              startIcon={<IconBackDarkSVG />}
            >
              Back
            </Button>
          </FooterWrapper>
        }
      />
    </>
  );
}
