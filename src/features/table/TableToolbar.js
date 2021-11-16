import * as React from 'react';
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
import { Projects } from '../projects/Projects';
import MobileDatePicker from '@mui/lab/MobileDatePicker';

export const EnhancedTableToolbar = (props) => {
    const { numSelected, tittle, headers } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      anchorEl ? setAnchorEl(null) : setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
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
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          headers.find( (element) => { 
            return element.filterable == true;
          }) && 
          <div>
            <Tooltip title="Filtros">
              <IconButton>
                <FilterListIcon onClick={handleClick} />
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
                <Grid container sx={{width: 500}}>
                {headers.map(
                  (header) => {
                    if(header.filterable){
                      switch(header.filter_details.type){
                        case "Text":
                          return(
                            <Grid item xs={11}>
                              <FormControl fullWidth sx={{ m: 1}} variant="outlined">
                                <InputLabel size="small" htmlFor={header.id}>{header.label}</InputLabel>
                                <OutlinedInput
                                  id={header.id}
                                  label={header.label} variant="outlined" 
                                  type={header.filter_details.type}
                                  size="small"
                                />
                              </FormControl>
                            </Grid>
                          )
                        case "Range":
                          return (header.filter_details.options.data_type === 'date') ?
                            [
                            <Grid item xs={6} >
                              <FormControl sx={{ m: 1}} variant="outlined">
                                <MobileDatePicker
                                  label="Desde"
                                  inputFormat="MM/dd/yyyy"
                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </FormControl>
                            </Grid>,
                            <Grid item xs={6}>
                              <FormControl sx={{ m: 1}} variant="outlined">
                                <MobileDatePicker
                                  label="Hasta"
                                  inputFormat="MM/dd/yyyy"
                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </FormControl>
                            </Grid> ] :
                          [
                              <Grid item xs={6}>
                                <TextField
                                  id={"filter" + header.id}
                                  label={header.label} variant="outlined" 
                                  type={header.filter_details.type}
                                  size="small"
                                />
                              </Grid> ,
                              <Grid item xs={6}>
                                <TextField
                                  id={"filter" + header.id}
                                  label={header.label} variant="outlined" 
                                  type={header.filter_details.type} 
                                  size="small"
                                />
                              </Grid>
                          ]
                        default:
                          return;
                      }
                    } 
                  }
                )}
                  <Grid item xs={12}>
                    <FormControl sx={{ m: 1}} >
                      <Button variant="outlined">
                        Filtrar
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
        id: PropTypes.number.isRequired,
        numeric: PropTypes.bool.isRequired,
        disablePadding: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        filterable: PropTypes.bool.isRequired,
        options: PropTypes.shape({
          type: PropTypes.oneOf(['Text', 'Range', 'Picker']).isRequired,
          filter_details: PropTypes.shape({
            data_type: PropTypes.oneOf(['number', 'text']).isRequired,
            min_range: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            max_range: PropTypes.number,
            options: PropTypes.shape({
              key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
              value: PropTypes.string.isRequired
            })
          }).isRequired
        })
      })
    )
  };