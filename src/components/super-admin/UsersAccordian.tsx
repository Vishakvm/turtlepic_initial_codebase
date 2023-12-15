import React, { useState, useEffect, useRef } from 'react';
import axios from 'src/utils/axios';
import {
  Typography,
  styled,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
} from '@mui/material';

import { Folder } from 'src/components/auth/signup/views/SignupPlanView';
import { useSnackbar } from 'notistack';
interface Props {
  userType: string;
}
const CardWrapper = styled('div')(({ theme }) => ({
  minWidth: '340px',
  backgroundColor: theme.palette.grey[300],
  borderRadius: '4px',
  boxShadow: '0px 20px 60px rgba(0, 23, 28, 0.5)',
  cursor: 'pointer',
  margin: theme.spacing(2, 1),
}));
const CustomTableHeader = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.grey[100],
}));
const CustomTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const LabelStyle = styled('div')(({ theme }) => ({
  background: theme.palette.primary.main,
  padding: theme.spacing(0.15, 2.5),
  width: 'fit-content',
}));

const LabelWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '-10px',
  left: '-3px',
}));
const Triangle = styled('div')(({ theme }) => ({
  borderBottom: `8px solid ${theme.palette.primary.main}`,
  borderLeft: '5px solid rgba(0, 0, 0, 0)',
  borderRight: '5px solid rgba(0, 0, 0, 0)',
  display: 'inline-block',
  height: 0,
  verticalAlign: 'top',
  width: 0,
  transform: 'rotate(180deg)',
}));
interface AllListProps {
  id: number;
  name: string;
}
export default function UsersAccordian(props: Props): React.ReactElement {
  const [allUsers, setAllUsers] = useState<AllListProps[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const isMounted = useRef(false);
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        await axios.get('/api/admin/agencies?limit=3').then((response) => {
          if (!isMounted.current) {
            const { data } = response.data;
            setAllUsers(data);
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
    <Folder>
      <LabelWrapper>
        <LabelStyle>
          <Typography variant="subtitle2" color="common.black" textTransform="capitalize">
            {props.userType}
          </Typography>
        </LabelStyle>
        <Triangle />
      </LabelWrapper>
      <CardWrapper>
        <TableContainer>
          <Table aria-label="simple table" sx={{ margin: '8px auto', textTransform: 'capitalize' }}>
            <TableBody>
              <TableRow sx={{ marginBottom: '25px' }}>
                <CustomTableHeader>S.no</CustomTableHeader>
                <CustomTableHeader>Name</CustomTableHeader>
                <CustomTableHeader>Plan</CustomTableHeader>
              </TableRow>
              {allUsers.map((row, index) => (
                <TableRow key={index}>
                  <CustomTableCell>{index + 1}.</CustomTableCell>
                  <CustomTableCell>{row.name ? row.name : '-'}</CustomTableCell>
                  <CustomTableCell>-</CustomTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardWrapper>
    </Folder>
  );
}
