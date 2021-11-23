import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import Grid  from '@mui/material/Grid';
import Button  from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import MenuItem from '@mui/material/MenuItem';
import { errorHandleDefault } from 'utils';
import { 
  enqueueSnackbar as enqueueSnackbarAction,
  setBackdropOpen
} from 'features/frame/mainFrameSlice';
import { 
  setHeaders,
  selectHeaders,
  setFilter,
  selectFilter,
  selectSelected,
  setLoading
 } from 'features/table/tableSlice';
import { deleteBulk } from './tableServices';


export const EnhancedTableToolbar = (props) => {
  const headers = useSelector(selectHeaders)
  const filter = useSelector(selectFilter)
  const selected = useSelector(selectSelected)
  const dispatch = useDispatch();
  const { numSelected, tittle } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));

  const handleClickFilterIcon = (event) => {
    anchorEl ? setAnchorEl(null) : setAnchorEl(event.currentTarget);
  };

  const handleClickFilterButton = () => {
    dispatch(setFilter(filter + 1))
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeFilter = (id, input) => {
    return (event) => {
      dispatch(setHeaders(
        headers.map(
          (element) => {
            if (element.id === id) return {
              ...element,
              filter_details: {
                ...element.filter_details,
                [input]: (
                  element.filter_details.options.data_type === 'number'
                ) ? 
                (/^[0-9]*$/.test(event.target.value) ? event.target.value :  element.filter_details[input]) 
                : event.target.value
              }
            };
            return element;
          }
        )
      ));
    };
  }

  const deleteBulkAction = () => {
    return async (dispatch) => {
      dispatch(setBackdropOpen(true));
      dispatch(setLoading('loading'))
      const response = await deleteBulk(selected)
      .then(
        (restult) => {
          enqueueSnackbar({
            key: new Date().getTime() + Math.random(),
            message: `Se eliminaron los registros ${restult.data.objects_deleted}`,
            options: {
                variant: 'success'
            },
            dismissed: false
          });
        }
      )
      .catch(
        (error) => errorHandleDefault(error, enqueueSnackbar)
      )
      .finally(
        () => {
          dispatch(setBackdropOpen(false));
          dispatch(setLoading('idle'))
        }
      )
    }
  }

  const handleDelete = () => {
    dispatch(deleteBulkAction());
  }

  
  const handleClean = () => {
    dispatch(setHeaders(
      headers.map(
        (element) => {
          return {
            ...element,
            filter_details: {
              ...element.filter_details,
              value: '',
              value2: '',
            }
          };
        }
      )
    ));
  };


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {tittle}
          </Typography>
        )}
  
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon onClick={handleDelete} />
            </IconButton>
          </Tooltip>
        ) : (
          headers.find( (element) => { 
            return element.filterable == true;
          }) && 
          <div>
            <Tooltip title="Filtros">
              <IconButton onClick={handleClickFilterIcon}>
                <FilterListIcon/>
              </IconButton>
            </Tooltip>       
            <Popper
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              placement={'bottom-end'}
            >
              <Box sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
                <Grid container sx={{width: 500}} key={"GridFilter"}>
                {headers.map(
                  (header, index) => {
                    if(header.filterable){
                      switch(header.filter_details.type){
                        case "Text":
                          return(
                            <Grid item xs={11} key={"h" + index}>
                              <FormControl fullWidth sx={{ m: 1}} variant="outlined">
                                <InputLabel size="small" htmlFor={header.id}>{header.label}</InputLabel>
                                <OutlinedInput
                                  id={header.id}
                                  label={header.label} variant="outlined" 
                                  value={header.filter_details.value}
                                  size="small"
                                  onChange={changeFilter(header.id, 'value')}
                                />
                              </FormControl>
                            </Grid>
                          )
                        case "Range":
                          return (header.filter_details.options.data_type === 'date') ?
                            [
                            <Grid item xs={6} key={"h" + index}>
                              <FormControl sx={{ m: 1}} variant="outlined">
                                <MobileDatePicker
                                  label="Desde"
                                  inputFormat="MM/dd/yyyy"
                                  renderInput={(params) => <TextField {...params} />}
                                  value={header.filter_details.value || null}
                                  onChange={(newValue) => {
                                    changeFilter(header.id, 'value')({target:{value:newValue.toString()}})
                                  }}
                                />
                              </FormControl>
                            </Grid>,
                            <Grid item xs={6} key={"h2" + index}>
                              <FormControl sx={{ m: 1}} variant="outlined">
                                <MobileDatePicker
                                  label="Hasta"
                                  inputFormat="MM/dd/yyyy"
                                  renderInput={(params) => <TextField {...params} />}
                                  value={header.filter_details.value2 || null}
                                  onChange={(newValue) => {
                                    changeFilter(header.id, 'value2')({target:{value:newValue.toString()}})
                                  }}
                                />
                              </FormControl>
                            </Grid> ] :
                          [
                              <Grid item xs={6} key={"h" + index}>
                                <InputLabel size="small" htmlFor={"filter1" + header.id}>{header.label}</InputLabel>
                                <TextField
                                  id={"filter1" + header.id}
                                  label={header.label} variant="outlined" 
                                  type={header.filter_details.type}
                                  value={header.filter_details.value}
                                  onChange={changeFilter(header.id, 'value')}
                                  size="small"
                                />
                              </Grid> ,
                              <Grid item xs={6} key={"h2" + index}>
                                <InputLabel size="small" htmlFor={"filter2" + header.id}>{header.label}</InputLabel>
                                <TextField
                                  id={"filter2" + header.id}
                                  label={header.label} variant="outlined" 
                                  type={header.filter_details.type} 
                                  value={header.filter_details.value2}
                                  onChange={changeFilter(header.id, 'value2')}
                                  size="small"
                                />
                              </Grid>
                          ]
                        case 'Picker':
                          return (
                            <Grid item xs={11} key={"pick" + index}>
                              <FormControl fullWidth sx={{ m: 1}} variant="outlined">
                                <InputLabel htmlFor={header.id}>Age</InputLabel>
                                  <Select
                                    id={header.id}
                                    value={header.filter_details.value}
                                    label={header.label} 
                                    onChange={changeFilter(header.id, 'value')}
                                  >
                                    {header.filter_details.options.picker_list.map(
                                      (pick, index) => {
                                        return <MenuItem value={pick.key} key={'mi' + index}>{pick.label}</MenuItem>
                                      }
                                    )}
                                  </Select>
                              </FormControl>
                            </Grid>
                          )
                        default:
                          return;
                      }
                    } 
                  }
                )}
                  <Grid item xs={4}>
                    <FormControl sx={{ m: 1}} >
                      <Button variant="outlined" onClick={handleClickFilterButton}>
                        Filtrar
                      </Button>
                    </FormControl>
                  </Grid>  
                  <Grid item xs={4}>
                    <FormControl sx={{ m: 1}} >
                      <Button variant="outlined" onClick={handleClean}>
                        Limpiar
                      </Button>
                    </FormControl>
                  </Grid>  
                  <Grid item xs={4}>
                    <FormControl sx={{ m: 1}} >
                      <Button variant="outlined" onClick={handleClose}>
                        Cerrar
                      </Button>
                    </FormControl>
                  </Grid>  
                </Grid>
              </Box>
            </Popper>
          </div>
        )}
      </Toolbar>
    );
  };
  
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    headers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        numeric: PropTypes.bool.isRequired,
        disablePadding: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        filterable: PropTypes.bool.isRequired,
        filter_details: PropTypes.shape({
          type: PropTypes.oneOf(['Text', 'Range', 'Picker']).isRequired,
          options: PropTypes.shape({
            data_type: PropTypes.oneOf(['number', 'text', 'date']).isRequired,
            min_range: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            max_range: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            picker_list: PropTypes.shape({
              value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
              label: PropTypes.string.isRequired,
            })
          }).isRequired,
          value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
          value2: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        })
      })
    )
  };