import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProjectsList } from './tableServices';

function createData(name, calories, fat, carbs, protein) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
    };
}

const rows = [
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Donut', 452, 25.0, 51, 4.9),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Honeycomb', 408, 3.2, 87, 6.5),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Jelly Bean', 375, 0.0, 94, 0.0),
    createData('KitKat', 518, 26.0, 65, 7.0),
    createData('Lollipop', 392, 0.2, 98, 0.0),
    createData('Marshmallow', 318, 0, 81, 2.0),
    createData('Nougat', 360, 19.0, 9, 37.0),
    createData('Oreo', 437, 18.0, 63, 4.0),
];

const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Dessert (100g serving)',
    },
    {
      id: 'calories',
      numeric: true,
      disablePadding: false,
      label: 'Calories',
    },
    {
      id: 'fat',
      numeric: true,
      disablePadding: false,
      label: 'Fat (g)',
    },
    {
      id: 'carbs',
      numeric: true,
      disablePadding: false,
      label: 'Carbs (g)',
    },
    {
      id: 'protein',
      numeric: true,
      disablePadding: false,
      label: 'Protein (g)',
    },
];

const initialState = {
    headers: headCells,
    rows: rows,
    selected: [],
    order: 'asc',
    orderBy: 'name',
    page: 0,
    dense: false,
    rowsPerPage: 5,
    loading: 'idle',
    apiName: "",
};

export const loadData = createAsyncThunk(
  'table/getProjectsList',
  async (query) => {
    const response = await getProjectsList(query)
    return response.data;
  }
);

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
      setHeaders: (state, action) => {
        state.headers = action.payload;
      },
      setRows: (state, action) => {
        state.rows = action.payload;
      },
      setOrder: (state, action) => {
        state.order = action.payload;
      },
      setOrderBy: (state, action) => {
        state.orderBy = action.payload;
      },
      setSelected: (state, action) => {
        state.selected  = action.payload;
      },
      setPage: (state, action) => {
        state.page  = action.payload;
      },
      setDense: (state, action) => {
        state.dense  = action.payload;
      },
      setRowsPerPage: (state, action) => {
        state.rowsPerPage  = action.payload;
      },
      setApiName: (state, action) => {
        state.apiName  = action.payload;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(loadData.pending, (state) => {
          state.loading = 'loading';
        })
        .addCase(loadData.fulfilled, (state, action) => {
          state.loading = 'idle';
          state.rows = action.payload.data;
        })
        .addCase(loadData.rejected, (state, action) => {
          state.loading = 'idle';
        })
        .addDefaultCase((state, action) => {})
    },
});

export const {
    setHeaders,
    setRows,
    setOrder,
    setOrderBy,
    setSelected,
    setPage,
    setDense,
    setRowsPerPage, 
    setApiName,
} = tableSlice.actions;

export const selectHeaders = (state) => state.table.headers;
export const selectRows = (state) => state.table.rows;
export const selectSelected = (state) => state.table.selected;
export const selectOrder = (state) => state.table.order;
export const selectOrderBy = (state) => state.table.orderBy;
export const selectPage = (state) => state.table.page;
export const selectDense = (state) => state.table.dense;
export const selectRowsPerPage = (state) => state.table.rowsPerPage;
export const selectLoading = (state) => state.table.loading;
export const selectApiName = (state) => state.table.apiName;

export default tableSlice.reducer;
