/*
 * Upload Pictures View
 *
 */
import React, { useState } from 'react';

import { Button, styled } from '@mui/material';

import FolderList from '../elements/FolderList';
import CreateEventFooterView from '../elements/CreateEventFooter';
import IconGoSVG from 'src/assets/shared/svg/icon_go';
import PictureGridElement from '../elements/PictureGrid';
import { useSelector } from 'react-redux';
import { AGENCY, CLIENT, TRANSFERRED } from 'src/utils/constants';
import useAuth from 'src/hooks/useAuth';

interface TabUploadNextProps {
  uploadTemplateTabRedirect: (index: number) => void;
  nextIndex: number;
}

const FooterWrapper = styled('div')(({ theme }) => ({
  textAlign: 'end',
}));

export default function UploadPicturesView({
  uploadTemplateTabRedirect,
  nextIndex,
}: TabUploadNextProps): React.ReactElement {
  const [openFolder, setOpenFolder] = useState<boolean>(false);
  const { user } = useAuth();

  const eventDetails = useSelector((state: any) => state.createEvent.value);

  const handleFolder = () => {
    setOpenFolder(true);
  };

  const handleNext = () => {
    uploadTemplateTabRedirect(nextIndex);
  };

  return (
    <>
      {!openFolder && <FolderList onClick={handleFolder} />}
      {openFolder && (
        <PictureGridElement
          onClick={(): void => {
            setOpenFolder(false);
          }}
        />
      )}

      <CreateEventFooterView
        footerAction={
          <FooterWrapper>
            <Button
              disabled={
                user?.account_type === AGENCY &&
                eventDetails.client_status === TRANSFERRED &&
                eventDetails.eventType === CLIENT
              }
              size="small"
              onClick={handleNext}
              color="primary"
              endIcon={<IconGoSVG color="#7DD78D" />}
            >
              Next
            </Button>
          </FooterWrapper>
        }
      />
    </>
  );
}
