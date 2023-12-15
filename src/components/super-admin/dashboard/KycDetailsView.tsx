import React, { useState, useEffect, useRef } from 'react';

import {
  Typography,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  Button,
  Grid,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';

import {
  TitleWrapper,
  CardWrapper,
  CustomTableHeader,
  CustomTableCell,
} from 'src/pages/superAdmin/Dashboard';
import { PENDING, REJECTED, UPLOADED } from 'src/utils/constants';
import axios from 'src/utils/axios';
import IconGoSVG from 'src/assets/shared/svg/icon_go';
import { PATH_MAIN_ADMIN } from 'src/routes/paths';
import { useNavigate } from 'react-router';

interface AllListProps {
  id: number;
  name: string;
  contact: string;
  email: string;
  gst_no: string;
  pan: number;
  address_line_1: string;
  created_at: string;
  city: string;
  verification_status: string;
}

export default function KycDetailView(): React.ReactElement {
  const [allKycList, setAllKycList] = useState<AllListProps[]>([]);
  const navigate = useNavigate();

  const isMounted = useRef(false);

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const PRIMARY_INFO = theme.palette.info.main;
  const ERROR_MAIN = theme.palette.error.main;
  const PRIMARY_MAIN = theme.palette.primary.main;

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        await axios
          .post('/api/admin/agencies/search?limit=3', {
            filters: [{ field: 'verification_status', operator: '!=', value: UPLOADED }],
          })
          .then((response) => {
            if (!isMounted.current) {
              const { data } = response.data;
              setAllKycList(data);
            }
          });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getAllUsers();
    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar]);

  return (
    <Grid container>
      <Grid item lg={6} md={8} sm={12} xs={12}>
        <TitleWrapper>
          <Typography variant="h3" pr={2}>
            Recent KYC Requests
          </Typography>
          <Button
            onClick={() => navigate(PATH_MAIN_ADMIN.kyc)}
            color="primary"
            size="small"
            endIcon={<IconGoSVG color={PRIMARY_MAIN} />}
          >
            View All
          </Button>
        </TitleWrapper>
        <CardWrapper>
          <TableContainer>
            <Table aria-label="simple table" sx={{ margin: '8px auto' }}>
              <TableBody>
                <TableRow sx={{ marginBottom: '25px' }}>
                  <CustomTableHeader>S.no</CustomTableHeader>
                  <CustomTableHeader>Name</CustomTableHeader>
                  <CustomTableHeader>Location</CustomTableHeader>
                  <CustomTableHeader>Status</CustomTableHeader>
                </TableRow>
                {allKycList?.map((row, index) => {
                  let color = '';
                  let { verification_status } = row;
                  if (verification_status === PENDING) {
                    color = PRIMARY_INFO;
                  } else if (verification_status === REJECTED) {
                    color = ERROR_MAIN;
                  } else {
                    color = PRIMARY_MAIN;
                  }
                  return (
                    <TableRow key={index} sx={{ textTransform: 'capitalize' }}>
                      <CustomTableCell>{index + 1}.</CustomTableCell>
                      <CustomTableCell>{row.name ? row.name : '-'}</CustomTableCell>
                      <CustomTableCell>{row.city ? row.city : '-'}</CustomTableCell>
                      <CustomTableCell>
                        <Typography color={color}>{row.verification_status}</Typography>
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardWrapper>
      </Grid>
    </Grid>
  );
}
