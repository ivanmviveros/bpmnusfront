import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { errorHandleDefault } from 'utils';
import { getProjectsList } from './tableServices';
import { 
  changeCurrentView,
  enqueueSnackbar as enqueueSnackbarAction,
  setBackdropOpen
} from 'features/frame/mainFrameSlice';
import { 
    setRecords,
    setOrderBy,
    setSelected,
    setPage,
    setDense,
    setRowsPerPage,
    setRows,
    selectRows,
    selectSelected,
    selectOrder,
    selectOrderBy,
    selectPage,
    selectDense,
    selectRowsPerPage,
    selectApiName,
    selectRecords,
    selectHeaders,
    setLoading,
    selectFilter
} from './tableSlice';
import { EnhancedTableHead } from './TableHead';
import { EnhancedTableToolbar } from './TableToolbar';
import { IconButton } from '@mui/material';
import { views } from 'views';
import { setId } from 'features/projects/projectFormSlice';

export default function EnhancedTable(props) {
    const order = useSelector(selectOrder)
    const orderBy = useSelector(selectOrderBy)
    const selected = useSelector(selectSelected)
    const page = useSelector(selectPage)
    const dense = useSelector(selectDense)
    const rowsPerPage = useSelector(selectRowsPerPage)
    const records = useSelector(selectRecords)
    const rows = useSelector(selectRows)
    const apiName = useSelector(selectApiName)
    const headers = useSelector(selectHeaders)
    const filter = useSelector(selectFilter)
    const dispatch = useDispatch();
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
    const { title, addView } = props;

    const loadData = (data) => {
      return async (dispatch) => {
        dispatch(setBackdropOpen(true));
        dispatch(setLoading('loading'))
        const response = await getProjectsList(data)
        .then(
          (restult) => {
            dispatch(setRows(restult.data.data))
            dispatch(setRecords(restult.data.recordsFiltered))
          }
        )
        .catch(
          (error) => errorHandleDefault(error, enqueueSnackbar, dispatch)
        )
        .finally(
          () => {
            dispatch(setBackdropOpen(false));
            dispatch(setLoading('idle'))
          }
        )
      }
    }

    const getFilters = (headers) => {
      return headers.map(
        (element) => {
          const filter = { ...element.filter_details};
          filter.id = element.id;
          if (element.filter_details.options.data_type === 'date') {
            if (filter.value !== '')
              filter.value = new  Date(filter.value).toISOString().split('T')[0]
            if (filter.value2 !== '')
              filter.value2 = new  Date(filter.value2).toISOString().split('T')[0]
          }
          return filter;
        }
      )
    }

    React.useEffect(() => {
        dispatch(loadData({ 
          "start": page * rowsPerPage,
          "length": rowsPerPage,
          "order": order,
          "orderBy": orderBy,
          "filters": getFilters(headers)
        }))
    }, [page, order, orderBy, rowsPerPage, apiName, filter, dispatch]);
    

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        dispatch(setOrderBy({
            "order": isAsc ? 'desc' : 'asc',
            "orderBy": property
          })
        );
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelecteds = rows.map((n) => n[headers[0].id]);
          dispatch(setSelected(newSelecteds));
          return;
        }
        dispatch(setSelected([]));
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
         newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
        dispatch(setSelected(newSelected));
    };

    const handleClickEdit = (event, name) => {
      dispatch(changeCurrentView(views.PROJECTS_FORM));
      dispatch(setId(name));
    };

    const handleChangePage = (event, newPage) => {
        dispatch(setPage(newPage));
    };

    const handleChangeRowsPerPage = (event) => {
        dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
        dispatch(setPage(0));
    };

    const handleChangeDense = (event) => {
        dispatch(setDense(event.target.checked));
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = Math.max(0, rowsPerPage - rows.length)

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.selected,
      },
      // hide last border
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    }));

    return (
        <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} title={title} addView={addView} />
            <TableContainer>
            <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
            >
                <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                />
                <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                    rows.slice().sort(getComparator(order, orderBy)) */}
                {rows.map((row, index) => {
                    const isItemSelected = isSelected(row[headers[0].id]);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                        <StyledTableRow
                          hover
                          onClick={(event) => handleClick(event, row[headers[0].id])}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={index}
                          selected={isItemSelected}
                        >
                        <TableCell padding="checkbox">
                            <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                                'aria-labelledby': labelId,
                            }}
                            />
                        </TableCell>
                        {headers.map( (cell, index2) => {
                          return index2 == 0 ? 
                          <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              key= {'' + index + '-' + index2}
                          >
                            {row[cell.id]}
                          </TableCell> :
                          <TableCell 
                            align="left"
                            key= {'' + index + '-' + index2}
                          >
                            {row[cell.id]}
                          </TableCell>
                        })}
                        <TableCell>
                        <IconButton>
                          <EditIcon onClick={(event) => handleClickEdit(event, row[headers[0].id])}/>
                        </IconButton>
                        </TableCell>
                        </StyledTableRow>
                    );
                    })}
                {emptyRows > 0 && (
                    <TableRow
                    style={{
                        height: (dense ? 33 : 53) * emptyRows,
                    }}
                    >
                    <TableCell colSpan={6} />
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={records}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
        />
        </Box>
    );
}
